"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _FileHandler2 = _interopRequireDefault(require("./FileHandler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
// Preset (Program) (.fxp) with chunk (magic = 'FPCh')
typedef struct
{
    char chunkMagic[4];     // 'CcnK'
    long byteSize;          // of this chunk, excl. magic + byteSize
    char fxMagic[4];        // 'FPCh'
    long version;
    char fxID[4];           // fx unique id
    long fxVersion;
    long numPrograms;
    char name[28];
    long chunkSize;
    unsigned char chunkData[chunkSize];
} fxProgramSet;

// For Preset (Program) (.fxp) without chunk (magic = 'FxCk')
typedef struct {
    char chunkMagic[4];     // 'CcnK'
    long byteSize;          // of this chunk, excl. magic + byteSize
    char fxMagic[4];        // 'FxCk'
    long version;
    char fxID[4];           // fx unique id
    long fxVersion;
    long numParams;
    char prgName[28];
    float params[numParams];        // variable no. of parameters
} fxProgram;
*/
var Fxp = /*#__PURE__*/function (_FileHandler) {
  _inherits(Fxp, _FileHandler);

  function Fxp() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Fxp);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Fxp)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "offset", 56);

    _defineProperty(_assertThisInitialized(_this), "map", {
      byteSize: {
        type: 'int',
        from: 4
      },
      withChunk: {
        type: 'string',
        from: 8,
        to: 12,
        filter: function filter(val) {
          return val === 'FPCh';
        },
        setter: function setter(val) {
          this.withChunk = val;
          this.buffer.write(val ? 'FPCh' : 'FxCk', 8, 4);
        }
      },
      version: {
        type: 'int',
        from: 12
      },
      fxId: {
        type: 'string',
        from: 16,
        to: 20
      },
      fxVersion: {
        type: 'int',
        from: 20
      },
      numPrograms: {
        type: 'int',
        from: 24
      },
      name: {
        type: 'string',
        from: 28,
        to: 56
      },
      data: {
        getter: function getter(obj) {
          if (obj.get('withChunk')) {
            var chunkSize = obj.buffer.readInt32BE(obj.get('offset'));
            return Buffer.from(obj.buffer.slice(obj.get('offset') + 4, obj.get('offset') + 4 + chunkSize));
          } else {
            var ret = [];

            for (var i = 0; i < obj.get('numPrograms'); i++) {
              ret.push(obj.buffer.readInt32BE(obj.get('offset') + i * 4));
              offset += 4;
            }

            return ret;
          }
        },
        setter: function setter(val, obj) {
          obj.data = val;

          if (obj.get('withChunk')) {
            obj.buffer.writeInt32BE(val.length, obj.get('offset'));
            var left = obj.buffer.slice(0, obj.get('offset') + 4);
            obj.buffer = Buffer.concat([left, val]);
          } else {
            obj.set('numPrograms', val.length);
            obj.buffer = Buffer.concat(Array.concat([[obj.buffer.slice(0, obj.get('offset'))], val.map(function (v) {
              var buf = Buffer.alloc(4);
              buf.writeInt32BE(v);
              return buf;
            })]));
          }
        }
      }
    });

    return _this;
  }

  return Fxp;
}(_FileHandler2["default"]);

exports["default"] = Fxp;