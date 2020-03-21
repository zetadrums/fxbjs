"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Fxp = _interopRequireDefault(require("./Fxp"));

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
// Bank (.fxb) with chunk (magic = 'FBCh')
typedef struct
{
    char chunkMagic[4];     // 'CcnK'
    long byteSize;          // of this chunk, excl. magic + byteSize
    char fxMagic[4];        // 'FBCh'
    long version;
    char fxID[4];           // fx unique id
    long fxVersion;
    long numPrograms;
    char future[128];
    long chunkSize;
    unsigned char chunkData[chunkSize];
} fxChunkSet;


// For Bank (.fxb) without chunk (magic = 'FxBk')
typedef struct {
    char chunkMagic[4];     // 'CcnK'
    long byteSize;          // of this chunk, excl. magic + byteSize
    char fxMagic[4];        // 'FxBk'
    long version;
    char fxID[4];           // fx unique id
    long fxVersion;
    long numPrograms;
    char future[128];
    fxProgram programs[numPrograms];  // variable no. of programs
} fxSet;
*/
var Fxb = /*#__PURE__*/function (_FileHandler) {
  _inherits(Fxb, _FileHandler);

  function Fxb() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Fxb);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Fxb)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "offset", 128 + 7 * 4);

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
          return val === 'FBCh';
        },
        setter: function setter(val) {
          this.withChunk = val;
          this.buffer.write(val ? 'FBCh' : 'FxBk', 8, 4);
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
      data: {
        getter: function getter(obj) {
          if (obj.get('withChunk')) {
            var chunkSize = obj.buffer.readInt32BE(obj.get('offset'));
            return Buffer.from(obj.buffer.slice(obj.get('offset') + 4, obj.get('offset') + 4 + chunkSize));
          } else {
            var ret = [];
            var chunkOffset = obj.get('offset');
            var size = 0;

            for (var i = 0; i < obj.get('numPrograms'); i++) {
              size = obj.buffer.readInt32BE(chunkOffset);
              ret.push(new _Fxp["default"](Buffer.from(obj.buffer.slice(chunkOffset, chunkOffset + size + 8))));
              chunkOffset += size + 8;
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
              return v.buffer;
            })]));
          }
        }
      }
    });

    return _this;
  }

  return Fxb;
}(_FileHandler2["default"]);

exports["default"] = Fxb;