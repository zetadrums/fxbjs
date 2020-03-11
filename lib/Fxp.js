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

var chunkMagic = 'CcnK';
var fxMagicWithChunk = 'FPCh';
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

var Fxp = /*#__PURE__*/function () {
  function Fxp(buffer) {
    _classCallCheck(this, Fxp);

    _defineProperty(this, "byteSize", null);

    _defineProperty(this, "withChunk", null);

    _defineProperty(this, "version", null);

    _defineProperty(this, "fxId", null);

    _defineProperty(this, "fxVersion", null);

    _defineProperty(this, "numPrograms", null);

    _defineProperty(this, "numParams", null);

    _defineProperty(this, "chunkSize", null);

    _defineProperty(this, "content", null);

    _defineProperty(this, "name", null);

    _defineProperty(this, "params", []);

    if (chunkMagic !== buffer.slice(0, 4).toString()) {
      throw new Error('This is not a FBX file');
    }

    this.byteSize = buffer.readInt32BE(4);
    this.withChunk = fxMagicWithChunk === buffer.slice(8, 12).toString();
    this.version = buffer.readInt32BE(12);
    this.fxId = buffer.slice(16, 20).toString();
    this.fxVersion = buffer.readInt32BE(20);

    if (this.withChunk) {
      this.numPrograms = buffer.readInt32BE(24);
    } else {
      this.numParams = buffer.readInt32BE(24);
    }

    this.name = buffer.slice(28, 56).toString();

    if (this.withChunk) {
      this.chunkSize = buffer.readInt32BE(56);
      this.data = buffer.slice(60, 60 + this.chunkSize);
    } else {
      var offset = 56;

      for (var i = 0; i < this.numParams; i++) {
        this.params.push(buffer.readInt32BE(offset));
        offset += 4;
      }
    }
  }

  _createClass(Fxp, [{
    key: "write",
    value: function write(path) {}
  }], [{
    key: "loadFile",
    value: function loadFile(path) {
      var buffer = _fs["default"].readFileSync(path);

      return new Fxp(buffer);
    }
  }]);

  return Fxp;
}();

exports["default"] = Fxp;