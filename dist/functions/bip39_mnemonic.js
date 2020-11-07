"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

module.exports = function (S) {
  var BN = S.BN;
  var C = S.__nodeCrypto;
  var W = S.getWindow();
  var ARGS = S.defArgs;

  S.getRandomValues = function (buf) {
    if (W.crypto && W.crypto.getRandomValues) return W.crypto.getRandomValues(buf);
    if ((0, _typeof2["default"])(W.msCrypto) === 'object' && typeof W.msCrypto.getRandomValues === 'function') return W.msCrypto.getRandomValues(buf);

    if (C !== false) {
      if (!(buf instanceof Uint8Array)) throw new TypeError('expected Uint8Array');

      if (buf.length > 65536) {
        var e = new Error();
        e.code = 22;
        e.message = 'Failed to execute \'getRandomValues\' on \'Crypto\': The ' + 'ArrayBufferView\'s byte length (' + buf.length + ') exceeds the ' + 'number of bytes of entropy available via this API (65536).';
        e.name = 'QuotaExceededError';
        throw e;
      }

      var bytes = C.randomBytes(buf.length);
      buf.set(bytes);
      return buf;
    } else throw new Error('No secure random number generator available.');
  };

  S.lngamma = function (z) {
    if (z < 0) return null;
    var x = S.GAMMA_TABLE_LN[0];

    for (var i = S.GAMMA_TABLE_LN.length - 1; i > 0; --i) {
      x += S.GAMMA_TABLE_LN[i] / (z + i);
    }

    var t = z + S.GAMMA_NUM_LN + 0.5;
    return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x) - Math.log(z);
  };

  S.igam = function (a, x) {
    if (x <= 0 || a <= 0) return 0.0;
    if (x > 1.0 && x > a) return 1.0 - S.igamc(a, x);
    var ans, ax, c, r;
    /* Compute xa exp(-x) / gamma(a) */

    ax = a * Math.log(x) - x - S.lngamma(a);
    if (ax < -S.MAXLOG) return 0.0;
    ax = Math.exp(ax);
    /* power series */

    r = a;
    c = 1.0;
    ans = 1.0;

    do {
      r += 1.0;
      c *= x / r;
      ans += c;
    } while (c / ans > S.MACHEP);

    return ans * ax / a;
  };

  S.igamc = function (a, x) {
    if (x <= 0 || a <= 0) return 1.0;
    if (x < 1.0 || x < a) return 1.0 - igam(a, x);
    var big = 4.503599627370496e15;
    var biginv = 2.22044604925031308085e-16;
    var ans, ax, c, yc, r, t, y, z;
    var pk, pkm1, pkm2, qk, qkm1, qkm2;
    ax = a * Math.log(x) - x - S.lngamma(a);
    if (ax < -S.MAXLOG) return 0.0;
    ax = Math.exp(ax);
    y = 1.0 - a;
    z = x + y + 1.0;
    c = 0.0;
    pkm2 = 1.0;
    qkm2 = x;
    pkm1 = x + 1.0;
    qkm1 = z * x;
    ans = pkm1 / qkm1;

    do {
      c += 1.0;
      y += 1.0;
      z += 2.0;
      yc = y * c;
      pk = pkm1 * z - pkm2 * yc;
      qk = qkm1 * z - qkm2 * yc;

      if (qk !== 0) {
        r = pk / qk;
        t = Math.abs((ans - r) / r);
        ans = r;
      } else t = 1.0;

      pkm2 = pkm1;
      pkm1 = pk;
      qkm2 = qkm1;
      qkm1 = qk;

      if (Math.abs(pk) > big) {
        pkm2 *= biginv;
        pkm1 *= biginv;
        qkm2 *= biginv;
        qkm1 *= biginv;
      }
    } while (t > S.MACHEP);

    return ans * ax;
  };

  S.erfc = function (x) {
    var z = Math.abs(x);
    var t = 1 / (1 + z / 2);
    var r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
    return x >= 0 ? r : 2 - r;
  };

  S.randomnessTest = function (b) {
    // NIST SP 800-22 randomness tests
    // https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-22r1a.pdf
    var p = new BN(b);
    var s = p.toString(2).padStart(256, '0'); // Frequency (Monobit) Test

    var n = s.length;
    var s_0 = (s.match(/0/g) || []).length;
    var s_1 = (s.match(/1/g) || []).length;
    var s_obs = Math.abs(s_1 - s_0) / Math.sqrt(2 * n);
    if (!(S.erfc(s_obs) > 0.01)) throw new Error('Frequency (Monobit) Test failed.'); // Runs Test

    var pi = s_1 / n;
    if (!(Math.abs(pi - 0.5) < 2 / Math.sqrt(n))) throw new Error('Runs Test failed.');
    var v = 1;

    for (var i = 0; i < n - 1; i++) {
      v += s[i] === s[i + 1] ? 0 : 1;
    }

    var a = v - 2 * n * pi * (1 - pi);
    var q = 2 * Math.sqrt(2 * n) * pi * (1 - pi);
    if (!(S.erfc(Math.abs(a) / q) > 0.01)) throw new Error('Runs Test failed.'); // Test for the Longest Run of Ones in a Block

    s = [s.substring(0, 128).match(/.{1,8}/g), s.substring(128, 256).match(/.{1,8}/g)];

    for (var w = 0; w < 2; w++) {
      var sl = s[w];
      v = [0, 0, 0, 0];

      for (var _i = 0; _i < sl.length; _i++) {
        var _q = sl[_i].split('0');

        var l = _q.reduce(function (a, b) {
          return a.length > b.length ? a : b;
        }).length;

        switch (l) {
          case 0:
            v[0] += 1;
            break;

          case 1:
            v[0] += 1;
            break;

          case 2:
            v[1] += 1;
            break;

          case 3:
            v[2] += 1;
            break;

          default:
            v[3] += 1;
        }
      }

      var k = 3;
      var r = 16;
      pi = [0.2148, 0.3672, 0.2305, 0.1875];
      var x_sqrt = Math.pow(v[0] - r * pi[0], 2) / (r * pi[0]);
      x_sqrt += Math.pow(v[1] - r * pi[1], 2) / (r * pi[1]);
      x_sqrt += Math.pow(v[2] - r * pi[2], 2) / (r * pi[2]);
      x_sqrt += Math.pow(v[3] - r * pi[3], 2) / (r * pi[3]);
      if (!(S.igamc(k / 2, x_sqrt / 2) > 0.01)) throw new Error('Test for the Longest Run of Ones in a Block failed.');
    }
  };

  S.generateEntropy = function () {
    var A = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    ARGS(A, {
      strength: 256,
      hex: true,
      sec256k1Order: true
    });
    if (![128, 160, 192, 224, 256].includes(A.strength)) throw new TypeError('strength should be one of the following [128, 160, 192, 224, 256]');
    var b = S.Buffer.alloc(32);
    var attempt = 0,
        p,
        f;

    do {
      f = true;
      if (attempt++ > 100) throw new Error('Generate randomness failed');
      S.getRandomValues(b);

      if (A.sec256k1Order) {
        p = new BN(b);
        if (p.gte(S.ECDSA_SEC256K1_ORDER)) continue;
      }

      try {
        S.randomnessTest(b);
      } catch (e) {
        f = false;
      }
    } while (!f);

    b = b.slice(0, A.strength / 8);
    return A.hex ? b.hex() : b;
  };

  S.entropyToMnemonic = function (e) {
    var A = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    ARGS(A, {
      wordList: S.BIP39_WORDLIST,
      data: false
    });
    e = S.getBuffer(e);
    var i = new BN(e, 16);
    if (![16, 20, 24, 28, 32].includes(e.length)) throw new TypeError('entropy length should be one of the following: [16, 20, 24, 28, 32]');
    if (!(A.wordList instanceof Array) || A.wordList.length !== 2048) throw new TypeError('invalid wordlist');
    var b = Math.ceil(e.length * 8 / 32);

    if (A.data !== false) {
      if (A.data > Math.pow(2, b) - 1) throw new TypeError('embedded data bits too long');
      i = i.shln(b).or(new BN(A.data));
    } else i = i.shln(b).or(new BN(S.sha256(e)[0] >> 8 - b));

    var r = [];

    for (var d = (e.length * 8 + 8) / 11 | 0; d > 0; d--) {
      r.push(A.wordList[i.shrn((d - 1) * 11).and(new BN(2047)).toNumber()]);
    }

    return r.join(' ');
  };

  S.mnemonicToEntropy = function (m) {
    var A = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    ARGS(A, {
      wordList: S.BIP39_WORDLIST,
      checkSum: false,
      hex: true
    });
    m = m.trim().split(/\s+/);
    if (!S.isMnemonicValid(m, A)) throw new TypeError('invalid mnemonic words');
    var e = new BN(0);

    var _iterator = _createForOfIteratorHelper(m),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var w = _step.value;
        e = e.shln(11).or(new BN(A.wordList.indexOf(w)));
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    var bitSize = m.length * 11;
    var checkSumBitLen = bitSize % 32;
    e = e.shrn(checkSumBitLen);
    e = e.toArrayLike(S.Buffer, 'be', Math.ceil((bitSize - checkSumBitLen) / 8));
    return A.hex ? e.hex() : e;
  };

  S.mnemonicToSeed = function (m) {
    var A = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    ARGS(A, {
      passphrase: "",
      checkSum: false,
      hex: true
    });
    if (!S.isString(m)) throw new Error("mnemonic should be string");
    if (!S.isString(A.passphrase)) throw new Error("passphrase should be string");
    var s = S.pbdkdf2HmacSha512(m, "mnemonic" + A.passphrase, 2048);
    return A.hex ? s.hex() : s;
  };

  S.isMnemonicValid = function (m) {
    var A = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    ARGS(A, {
      wordList: S.BIP39_WORDLIST
    });
    if (S.isString(m)) m = m.trim().split(/\s+/);

    var _iterator2 = _createForOfIteratorHelper(m),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var w = _step2.value;
        if (!A.wordList.includes(w)) return false;
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    return true;
  };

  S.isMnemonicCheckSumValid = function (m) {
    var A = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    ARGS(A, {
      wordList: S.BIP39_WORDLIST
    });
    var e;

    try {
      e = S.mnemonicToEntropy(m, {
        wordList: A.wordList,
        hex: false
      });
    } catch (e) {
      return false;
    }

    m = m.trim().split(/\s+/);
    var bitSize = m.length * 11;
    var checkSumBitLen = bitSize % 32;
    var c = S.sha256(e)[0] >> 8 - checkSumBitLen;
    var c2 = S.intToBytes(A.wordList.indexOf(m.pop()), 1) & Math.pow(2, checkSumBitLen) - 1;
    return c === c2;
  };

  S.getMnemonicCheckSumData = function (m) {
    var A = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    ARGS(A, {
      wordList: S.BIP39_WORDLIST
    });
    m = m.trim().split(/\s+/);
    var bitSize = m.length * 11;
    var checkSumBitLen = bitSize % 32;
    return S.intToBytes(A.wordList.indexOf(m.pop()), 1) & Math.pow(2, checkSumBitLen) - 1;
  };

  S.__combinations = function (a, n) {
    var results = [],
        result,
        mask,
        i;
    var total = Math.pow(2, a.length);

    for (var m = n; m < total; m++) {
      var r = [];
      i = a.length - 1;

      do {
        if ((m & 1 << i) !== 0) r.push(a[i]);
      } while (i--);

      if (r.length >= n) {
        results.push(r);
      }
    }

    return results;
  };

  S.splitMnemonic = function (threshold, total, m) {
    var A = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    ARGS(A, {
      wordList: S.BIP39_WORDLIST,
      checkSumVerify: false,
      sharesVerify: false,
      embeddedIndex: false,
      hex: true
    });
    var e = S.mnemonicToEntropy(m, {
      wordList: A.wordList,
      checkSum: A.checkSumVerify,
      hex: false
    });
    var bits;
    if (A.embeddedIndex) bits = Math.ceil(Math.log2(total)) + 1;else bits = 8;

    var shares = S.__split_secret(threshold, total, e, bits);

    if (A.sharesVerify) {
      // shares validation
      var a = [];

      for (var i in shares) {
        i = parseInt(i);
        a.push([i, shares[i]]);
      }

      var combinations = S.__combinations(a, threshold);

      var _iterator3 = _createForOfIteratorHelper(combinations),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var c = _step3.value;
          var d = {};

          var _iterator4 = _createForOfIteratorHelper(c),
              _step4;

          try {
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              var q = _step4.value;
              d[q[0]] = q[1];
            }
          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }

          var s = S.__restore_secret(d);

          if (!s.equals(e)) {
            throw new Error("split secret failed");
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }

    var result;

    if (A.embeddedIndex === false) {
      result = {};

      for (var _i2 in shares) {
        result[_i2] = S.entropyToMnemonic(shares[_i2], A);
      }
    } else {
      result = [];

      for (var _i3 in shares) {
        A.data = _i3;
        result.push(S.entropyToMnemonic(shares[_i3], A));
      }
    }

    return result;
  };

  S.combineMnemonic = function (shares) {
    var A = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var embeddedIndex = shares.constructor === Array;
    var s = {};

    if (embeddedIndex) {
      var _iterator5 = _createForOfIteratorHelper(shares),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var share = _step5.value;
          var e = S.mnemonicToEntropy(share, {
            wordList: A.wordList,
            checkSum: false,
            hex: false
          });
          var i = S.getMnemonicCheckSumData(share);
          if (s[i] !== undefined) throw new Error("Non unique or invalid shares");
          s[i] = e;
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    } else {
      for (var _i4 in shares) {
        s[_i4] = S.mnemonicToEntropy(shares[_i4], {
          wordList: A.wordList,
          checkSum: A.checkSum,
          hex: false
        });
      }
    }

    return S.entropyToMnemonic(S.__restore_secret(s), A);
  };
};