"use strict";

var _index = _interopRequireDefault(require("./index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var base = _index["default"].loadFile(__dirname + '/../test_files/light.fxb');

new _index["default"](base.content);