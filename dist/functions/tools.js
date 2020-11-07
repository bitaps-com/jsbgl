"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

module.exports = function (S) {
  S.Buffer = require('buffer/').Buffer;
  S.isBuffer = S.Buffer.isBuffer;
  S.BN = require('bn.js');
  S.__nodeCrypto = false;

  try {
    S.__nodeCrypto = require('crypto');
  } catch (e) {}

  S.Buffer.prototype.seek = function (n) {
    this.__offset = n > this.length ? this.length : n;
  };

  S.Buffer.prototype.tell = function () {
    this.__offset;
  };

  S.Buffer.prototype.read = function (n) {
    if (this.__offset === undefined) this.__offset = 0;
    if (this.__offset === this.length) return S.Buffer.from([]);
    var m = this.__offset + n;
    if (m > this.length) m = this.length;
    var r = this.slice(this.__offset, m);
    this.__offset = m;
    return r;
  };

  S.Buffer.prototype.readVarInt = function () {
    if (this.__offset === undefined) this.__offset = 0;
    if (this.__offset === this.length) return S.Buffer.from([]);
    var l = this[this.__offset];
    if (l < 253) l = 1;else if (l === 253) l = 3;else if (l === 254) l = 5;else if (l === 255) l = 9;
    return this.read(l);
  };

  S.Buffer.prototype.readInt = function (n) {
    var byte_order = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'little';
    if (this.__offset === undefined) this.__offset = 0;
    if (this.__offset === this.length) return 0;
    if (this.__offset + n > this.length) n = this.length - this.__offset;
    var r;
    if (byte_order === 'little') r = this.readUIntLE(this.__offset, n);else r = this.readUIntBE(this.__offset, n);
    this.__offset += n;
    return r;
  };

  S.Buffer.prototype.hex = function () {
    return this.toString('hex');
  };

  S.getWindow = function () {
    if (typeof window !== "undefined") return window;
    if (typeof global !== "undefined") return global;
    if (typeof self !== "undefined") return self;
    return {};
  };

  S.readVarInt = function (s) {
    var l = s[s.__offset];
    if (l < 253) l = 1;else if (l === 253) l = 3;else if (l === 254) l = 5;else if (l === 255) l = 9;
    return s.read(l);
  };

  S.BNZerro = new S.BN(0);

  S.isHex = function (s) {
    return Boolean(/^[0-9a-fA-F]+$/.test(s) && !(s.length % 2));
  };

  S.getBuffer = function (m) {
    var encoding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'hex';

    if (S.isBuffer(m)) {
      if (m.read === undefined) return S.Buffer.from(m);
      return m;
    }

    if (S.isString(m)) {
      if (m.length === 0) return S.Buffer(0);
      encoding = encoding.split('|');

      var _iterator = _createForOfIteratorHelper(encoding),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var e = _step.value;

          if (e === 'hex') {
            if (S.isHex(m)) return S.Buffer.from(m, e);
          } else if (e === 'utf8') return S.Buffer.from(m, e);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      throw new Error(encoding + ' encoding required :' + encoding);
    }

    return S.Buffer.from(m);
  };

  S.isString = function (value) {
    return typeof value === 'string' || value instanceof String;
  };

  S.defArgs = function (n, v) {
    if (!(n instanceof Object) && n !== undefined) throw new Error("Invalid named arguments object");

    for (var k in v) {
      if (n[k] === undefined) n[k] = v[k];
    }
  };

  S.bytesToString = function (bytes) {
    return bytes.map(function (x) {
      return String.fromCharCode(x);
    }).join('');
  };

  S.hexToBytes = function (hex) {
    if (hex.length % 2 === 1) throw new Error("hexToBytes can't have a string with an odd number of characters.");
    if (hex.indexOf('0x') === 0) hex = hex.slice(2);
    return hex.match(/../g).map(function (x) {
      return parseInt(x, 16);
    });
  };

  S.stringToBytes = function (str) {
    return str.split('').map(function (x) {
      return x.charCodeAt(0);
    });
  };

  S.intToBytes = function (x, n) {
    var byte_order = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "little";
    var bytes = [];
    var i = n;
    if (n === undefined) throw new Error('bytes count required');
    if (byte_order !== "big" && byte_order !== "little") throw new Error('invalid byte order');
    var b = byte_order === "big";
    if (n <= 4) do {
      b ? bytes.unshift(x & 255) : bytes.push(x & 255);
      x = x >> 8;
    } while (--i);else {
      x = new S.BN(x);
      bytes = x.toArrayLike(Array, b ? 'be' : 'le', n);
    }
    return bytes;
  };

  S.intToVarInt = function (i) {
    var r;

    if (i instanceof S.BN) {
      if (i.lt(0xfd)) r = i.toArrayLike(Array, 'le', 1);else if (i.lt(0xffff)) r = [0xfd].concat(i.toArrayLike(Array, 'le', 2));else if (i.lt(0xffffffff)) r = [0xfe].concat(i.toArrayLike(Array, 'le', 4));else r = [0xff].concat(i.toArrayLike(Array, 'le', 8));
      return r;
    } else if (!isNaN(i)) {
      if (i < 0xfd) r = [i];else if (i < 0xffff) r = [0xfd].concat(S.intToBytes(i, 2, 'little'));else if (i < 0xffffffff) r = [0xfe].concat(S.intToBytes(i, 4, 'little'));else r = [0xff].concat(S.intToBytes(i, 8, 'little'));
      return r;
    } else {
      throw new Error('invalid argument type', i);
    }
  };

  S.varIntToInt = function (s) {
    var bn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var r;
    if (s[0] < 0xfd) r = new S.BN(s[0]);else if (s[0] < 0xffff) r = new S.BN(s.slice(1, 3), 'le');else if (s[0] < 0xffffffff) r = new S.BN(s.slice(1, 4), 'le');else r = new S.BN(s.slice(1, 8), 'le');
    if (bn) return r;
    return r.toNumber();
  };

  S.varIntLen = function (b) {
    return b[0] < 0xfd ? 1 : b[0] < 0xffff ? 2 : b[0] < 0xffffffff ? 4 : 8;
  };

  S.rh2s = function (s) {
    return S.Buffer.from(s).reverse().hex();
  };

  S.s2rh = function (s) {
    return S.Buffer.from(s, 'hex').reverse();
  };
};