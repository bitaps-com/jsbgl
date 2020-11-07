"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

module.exports = function (S) {
  var CM = S.__bitcoin_core_crypto.module;
  var malloc = CM._malloc;
  var free = CM._free;
  var BA = S.Buffer.alloc;
  var ARGS = S.defArgs;
  var getBuffer = S.getBuffer;
  var BN = S.BN;
  var getValue = CM.getValue;

  S.sha256 = function (m) {
    var A = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    ARGS(A, {
      encoding: 'hex|utf8',
      hex: false
    });
    m = getBuffer(m, A.encoding);
    var bP = malloc(m.length);
    var oP = malloc(32);
    CM.HEAPU8.set(m, bP);

    CM._single_sha256(bP, m.length, oP);

    var out = new BA(32);

    for (var i = 0; i < 32; i++) {
      out[i] = getValue(oP + i, 'i8');
    }

    free(bP);
    free(oP);
    return A.hex ? out.hex() : out;
  };

  S.SHA256 = /*#__PURE__*/function () {
    function _class() {
      (0, _classCallCheck2["default"])(this, _class);
      this.ptr = new CM.CSHA256();
      this.result = new BA(32);
      return this;
    }

    (0, _createClass2["default"])(_class, [{
      key: "update",
      value: function update(m) {
        var A = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        ARGS(A, {
          encoding: 'hex|utf8'
        });
        m = getBuffer(m, A.encoding);
        var bP = malloc(m.length);
        CM.HEAPU8.set(m, bP);
        this.ptr.Write(bP, m.length);
        free(bP);
        return this;
      }
    }, {
      key: "digest",
      value: function digest() {
        var oP = malloc(32);
        this.ptr.Finalize(oP);

        for (var i = 0; i < 32; i++) {
          this.result[i] = getValue(oP + i, 'i8');
        }

        free(oP);
        return this.result;
      }
    }, {
      key: "hexdigest",
      value: function hexdigest() {
        var oP = malloc(32);
        this.ptr.Finalize(oP);

        for (var i = 0; i < 32; i++) {
          this.result[i] = getValue(oP + i, 'i8');
        }

        free(oP);
        return this.result.hex();
      }
    }]);
    return _class;
  }();

  S.doubleSha256 = function (m) {
    var A = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    ARGS(A, {
      encoding: 'hex|utf8',
      hex: false
    });
    m = getBuffer(m, A.encoding);
    var bP = malloc(m.length);
    var oP = malloc(32);
    CM.HEAPU8.set(m, bP);

    CM._double_sha256(bP, m.length, oP);

    var out = new BA(32);

    for (var i = 0; i < 32; i++) {
      out[i] = getValue(oP + i, 'i8');
    }

    free(bP);
    free(oP);
    return A.hex ? out.hex() : out;
  };

  S.siphash = function (m) {
    var A = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    ARGS(A, {
      encoding: 'hex|utf8',
      v0: S.BNZerro,
      v1: S.BNZerro
    });
    if (!(A.v1 instanceof BN) || !(A.v0 instanceof BN)) throw new Error('siphash init vectors v0, v1 must be BN instance');
    m = getBuffer(m, A.encoding);
    var v0b = A.v0.toArrayLike(Uint8Array, 'le', 8);
    var v1b = A.v1.toArrayLike(Uint8Array, 'le', 8);
    var bP = malloc(m.length);
    var v0Pointer = malloc(8);
    var v1Pointer = malloc(8);
    var oP = malloc(8);
    CM.HEAPU8.set(m, bP);
    CM.HEAPU8.set(v0b, v0Pointer);
    CM.HEAPU8.set(v1b, v1Pointer);

    CM._siphash(v0Pointer, v1Pointer, bP, m.length, oP);

    var out = new BA(9);

    for (var i = 0; i < 8; i++) {
      out[8 - i] = getValue(oP + i, 'i8');
    }

    free(bP);
    free(oP);
    return new BN(out);
  };

  S.ripemd160 = function (m) {
    var A = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    ARGS(A, {
      encoding: 'hex|utf8',
      hex: false
    });
    m = getBuffer(m, A.encoding);
    var bP = malloc(m.length);
    var oP = malloc(32);
    CM.HEAPU8.set(m, bP);

    CM.__ripemd160(bP, m.length, oP);

    var out = new BA(20);

    for (var i = 0; i < 20; i++) {
      out[i] = getValue(oP + i, 'i8');
    }

    free(bP);
    free(oP);
    return A.hex ? out.hex() : out;
  };

  S.md5 = function (m) {
    var A = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    ARGS(A, {
      encoding: 'hex|utf8',
      hex: false
    });
    m = getBuffer(m, A.encoding);
    var bP = malloc(m.length);
    var oP = malloc(16);
    CM.HEAPU8.set(m, bP);

    CM._md5sum(bP, m.length, oP);

    var out = new BA(16);

    for (var i = 0; i < 16; i++) {
      out[i] = getValue(oP + i, 'i8');
    }

    free(bP);
    free(oP);
    return A.hex ? out.hex() : out;
  };

  S.sha3 = function (m) {
    var A = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    ARGS(A, {
      encoding: 'hex|utf8',
      hex: false
    });
    m = getBuffer(m, A.encoding);
    var bP = malloc(m.length);
    var oP = malloc(32);
    CM.HEAPU8.set(m, bP);

    CM._sha3(bP, m.length, oP);

    var out = new BA(32);

    for (var i = 0; i < 32; i++) {
      out[i] = getValue(oP + i, 'i8');
    }

    free(bP);
    free(oP);
    return A.hex ? out.hex() : out;
  };

  S.hash160 = function (m) {
    var A = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    ARGS(A, {
      encoding: 'hex|utf8',
      hex: false
    });
    return S.ripemd160(S.sha256(m, {
      hex: false,
      encoding: A.encoding
    }), {
      hex: A.hex
    });
  };

  S.hmacSha512 = function (k, d) {
    var A = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    ARGS(A, {
      encoding: 'hex|utf8',
      hex: false
    });
    k = getBuffer(k, A.encoding);
    d = getBuffer(d, A.encoding);
    var kP = malloc(k.length);
    var dP = malloc(d.length);
    var oP = malloc(64);
    CM.HEAPU8.set(k, kP);
    CM.HEAPU8.set(d, dP);

    CM._hmac_sha512_oneline(kP, k.length, dP, d.length, oP);

    var out = new BA(64);

    for (var i = 0; i < 64; i++) {
      out[i] = getValue(oP + i, 'i8');
    }

    free(kP);
    free(dP);
    free(oP);
    return A.hex ? out.hex() : out;
  };

  S.pbdkdf2HmacSha512 = function (password, salt, i) {
    var A = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    ARGS(A, {
      encoding: 'utf8',
      hex: false
    });
    var p = getBuffer(password, A.encoding);
    var s = getBuffer(salt, A.encoding);
    var pP = malloc(p.length);
    var sP = malloc(s.length);
    var oP = malloc(64);
    CM.HEAPU8.set(p, pP);
    CM.HEAPU8.set(s, sP);

    CM._pbkdf2_hmac_sha512(pP, p.length, sP, s.length, i, oP, 64);

    var out = new BA(64);

    for (var _i = 0; _i < 64; _i++) {
      out[_i] = getValue(oP + _i, 'i8');
    }

    free(pP);
    free(sP);
    free(oP);
    return A.hex ? out.hex() : out;
  };
};