"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var FileHandler = /*#__PURE__*/function () {
  function FileHandler(buffer) {
    _classCallCheck(this, FileHandler);

    _defineProperty(this, "buffer", null);

    _defineProperty(this, "offset", 0);

    _defineProperty(this, "map", {});

    if ('CcnK' !== buffer.slice(0, 4).toString()) {
      throw new Error('This is not a valid file');
    }

    this.buffer = buffer;
  }

  _createClass(FileHandler, [{
    key: "get",
    value: function get(field) {
      if (this[field] !== undefined) return this[field];
      var conf = this.map[field];
      if (!conf) return null;

      if (conf.getter !== undefined) {
        this[field] = conf.getter(this);
      } else {
        switch (conf.type) {
          case 'int':
            this[field] = this.buffer.readInt32BE(conf.from);
            break;

          case 'string':
            this[field] = this.buffer.slice(conf.from, conf.to).toString();
            break;

          default:
            return null;
        }
      }

      if (conf.filter !== undefined) this[field] = conf.filter(this[field]);
      return this[field];
    }
  }, {
    key: "set",
    value: function set(field, value) {
      var conf = this.map[field];

      if (!conf) {
        return null;
      }

      if (conf.setter !== undefined) {
        conf.setter(value, this);
      } else {
        switch (conf.type) {
          case 'int':
            this[field] = value;
            this.buffer.writeInt32BE(value, conf.from);
            break;

          case 'string':
            this[field] = value;
            this.buffer.fill("\0", conf.from, conf.to);
            this.buffer.write(value, conf.from, conf.to - conf.from);
            break;

          default:
            return null;
        }
      } // Write byteSize


      this.byteSize = this.buffer.length;
      this.buffer.writeInt32BE(this.byteSize, 4);
    }
  }, {
    key: "write",
    value: function write(path) {
      _fs["default"].writeFileSync(path, this.buffer);
    }
  }], [{
    key: "loadFile",
    value: function loadFile(path) {
      var buffer = _fs["default"].readFileSync(path);

      return new this(buffer);
    }
  }]);

  return FileHandler;
}();

exports["default"] = FileHandler;