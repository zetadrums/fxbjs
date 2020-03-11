"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var fs = require('fs');

var chunkMagic = 'CcnK';
var fxMagicRegular = 'FxBk';
var fxMagicOpaque = 'FBCh';
var fxMagicProgram = 'FxCk';

var Fxb = /*#__PURE__*/function () {
  function Fxb(buffer) {
    _classCallCheck(this, Fxb);

    _defineProperty(this, "byteSize", null);

    _defineProperty(this, "fxMagic", null);

    _defineProperty(this, "version", null);

    _defineProperty(this, "fxId", null);

    _defineProperty(this, "fxVersion", null);

    _defineProperty(this, "numPrograms", null);

    _defineProperty(this, "content", null);

    if (chunkMagic !== buffer.slice(0, 4).toString()) {
      throw new Error('This is not a FBX file');
    }

    this.byteSize = buffer.readInt32BE(4);
    var fxMagicString = buffer.slice(8, 12).toString();

    if (fxMagicRegular === fxMagicString) {
      this.fxMagic = Fxb.TYPE_REGULAR;
    }

    if (fxMagicOpaque === fxMagicString) {
      this.fxMagic = Fxb.TYPE_OPAQUE;
    }

    if (fxMagicProgram === fxMagicString) {
      this.fxMagic = Fxb.TYPE_PROGRAM;
    }

    if (this.fxMagic === null) {
      throw new Error("Unknown fxMagic (".concat(fxMagicString, ")"));
    }

    this.version = buffer.readInt32BE(12);
    this.fxId = buffer.readInt32BE(16);
    this.fxVersion = buffer.readInt32BE(20);
    this.fxVersion = buffer.readInt32BE(24);
    var offset = 128 + 7 * 4;
    this.content = buffer.slice(offset, offset + this.byteSize);
    console.log(this);
  }

  _createClass(Fxb, null, [{
    key: "loadFile",
    value: function loadFile(path) {
      var buffer = fs.readFileSync(path);
      return new Fxb(buffer);
    }
  }]);

  return Fxb;
}();

exports["default"] = Fxb;

_defineProperty(Fxb, "TYPE_REGULAR", 'regular');

_defineProperty(Fxb, "TYPE_OPAQUE", 'opaque');

_defineProperty(Fxb, "TYPE_PROGRAM", 'program');