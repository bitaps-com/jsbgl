"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

module.exports = function (S) {
  var BA = S.Buffer.alloc;
  var BF = S.Buffer.from;
  var BC = S.Buffer.concat;

  S.__precompute_GF256_expLog = function (S) {
    var exp = BA(255, 0);
    var log = BA(256, 0);
    var poly = 1;

    for (var i = 0; i < 255; i++) {
      exp[i] = poly;
      log[poly] = i; // Multiply poly by the polynomial x + 1.

      poly = poly << 1 ^ poly; // Reduce poly by x^8 + x^4 + x^3 + x + 1

      if (poly & 0x100) poly ^= 0x11b;
    }

    S.GF256_EXP_TABLE = exp;
    S.GF256_LOG_TABLE = log;
  };

  S.__GF256_mul = function (a, b) {
    if (a === 0 || b === 0) return 0;
    return S.GF256_EXP_TABLE[S.__mod(S.GF256_LOG_TABLE[a] + S.GF256_LOG_TABLE[b], 255)];
  };

  S.__GF256_pow = function (a, b) {
    if (b === 0) return 1;
    if (a === 0) return 0;
    var c = a;

    for (var i = 0; i < b - 1; i++) {
      c = S.__GF256_mul(c, a);
    }

    return c;
  };

  S.__mod = function (a, b) {
    return (a % b + b) % b;
  };

  S.__GF256_add = function (a, b) {
    return a ^ b;
  };

  S.__GF256_sub = function (a, b) {
    return a ^ b;
  };

  S.__GF256_inverse = function (a) {
    if (a === 0) throw new Error("Zero division");
    return S.GF256_EXP_TABLE[S.__mod(-1 * S.GF256_LOG_TABLE[a], 255)];
  };

  S.__GF256_div = function (a, b) {
    if (b === 0) throw new Error("Zero division");
    if (a === 0) return 0;

    var r = S.GF256_EXP_TABLE[S.__mod(S.GF256_LOG_TABLE[a] - S.GF256_LOG_TABLE[b], 255)]; // let r = S.__GF256_mul(a, S.__GF256_inverse(b));


    if (a !== S.__GF256_mul(r, b)) throw new Error("failed");
    return r;
  };

  S.__shamirFn = function (x, q) {
    var r = 0;

    var _iterator = _createForOfIteratorHelper(q),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var a = _step.value;
        r = S.__GF256_add(r, S.__GF256_mul(a, S.__GF256_pow(x, q.indexOf(a))));
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return r;
  };

  S.__shamirInterpolation = function (points) {
    var k = points.length;
    if (k < 2) throw new Error("Minimum 2 points required");
    points.sort(function (a, b) {
      return a[0] - b[0];
    });
    var z = new Set();

    var _iterator2 = _createForOfIteratorHelper(points),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var i = _step2.value;
        z.add(i[0]);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    if (z.size !== points.length) throw new Error("Unique points required");
    var p_x = 0;

    for (var j = 0; j < k; j++) {
      var p_j_x = 1;

      for (var m = 0; m < k; m++) {
        if (m === j) continue; // let a = S.__GF256_sub(x, points[m][0]);

        var a = points[m][0]; // let b = S.__GF256_sub(points[j][0], points[m][0]);

        var b = S.__GF256_add(points[j][0], points[m][0]);

        var c = S.__GF256_div(a, b);

        p_j_x = S.__GF256_mul(p_j_x, c);
      }

      p_j_x = S.__GF256_mul(points[j][1], p_j_x);
      p_x = S.__GF256_add(p_x, p_j_x);
    }

    return p_x;
  };

  S.__split_secret = function (threshold, total, secret) {
    var indexBits = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 8;
    if (threshold > 255) throw new Error("threshold limit 255");
    if (total > 255) throw new Error("total limit 255");
    var index_mask = Math.pow(2, indexBits) - 1;
    if (total > index_mask) throw new Error("index bits is to low");
    if (threshold > total) throw new Error("invalid threshold");
    var shares = {};
    var sharesIndexes = [];
    var e = S.generateEntropy({
      hex: false
    });
    var ePointer = 0;
    var i = 0;
    var index; // generate random indexes (x coordinate)

    do {
      if (ePointer >= e.length) {
        // get more 32 bytes entropy
        e = S.generateEntropy({
          hex: false
        });
        ePointer = 0;
      }

      index = e[ePointer] & index_mask;

      if (shares[index] === undefined && index !== 0) {
        i++;
        shares[index] = BF([]);
        sharesIndexes.push(index);
      }

      ePointer++;
    } while (i !== total);

    e = S.generateEntropy({
      hex: false
    });
    ePointer = 0;
    var w;

    for (var b = 0; b < secret.length; b++) {
      var q = [secret[b]];

      for (var _i = 0; _i < threshold - 1; _i++) {
        do {
          if (ePointer >= e.length) {
            ePointer = 0;
            e = S.generateEntropy({
              hex: false
            });
          }

          w = e[ePointer++];
        } while (q.includes(w));

        q.push(w);
      }

      var _iterator3 = _createForOfIteratorHelper(sharesIndexes),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _i2 = _step3.value;
          shares[_i2] = BC([shares[_i2], BF([S.__shamirFn(_i2, q)])]);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }

    return shares;
  };

  S.__restore_secret = function (shares) {
    var secret = BF([]);
    var shareLength = null;
    var q = [];

    for (var i in shares) {
      i = parseInt(i);
      if (i < 1 || i > 255) throw new Error("Invalid share index " + i);
      if (shareLength === null) shareLength = shares[i].length;
      if (shareLength !== shares[i].length || shareLength === 0) throw new Error("Invalid shares");
    }

    for (var _i3 = 0; _i3 < shareLength; _i3++) {
      var points = [];

      for (var z in shares) {
        z = parseInt(z);
        points.push([z, shares[z][_i3]]);
      }

      secret = BC([secret, BF([S.__shamirInterpolation(points)])]);
    }

    return secret;
  };

  S.__precompute_GF256_expLog(S);
};