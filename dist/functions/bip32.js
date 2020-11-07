"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

module.exports = function (S) {
  var CM = S.__bitcoin_core_crypto.module;
  var malloc = CM._malloc;
  var free = CM._free;
  var BA = S.Buffer.alloc;
  var BC = S.Buffer.concat;
  var BF = S.Buffer.from;
  var ARGS = S.defArgs;
  var getBuffer = S.getBuffer;
  var BN = S.BN;
  var getValue = CM.getValue;

  S.createMasterXPrivateKey = function (seed) {
    var A = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    ARGS(A, {
      testnet: false,
      base58: true
    });
    var i = S.hmacSha512("Bitcoin seed", seed);
    var m = i.slice(0, 32);
    var c = i.slice(32);
    var mi = new BN(m);
    if (mi.gte(S.ECDSA_SEC256K1_ORDER) || mi.lte(1)) return null;
    var key = A.testnet ? S.TESTNET_XPRIVATE_KEY_PREFIX : S.MAINNET_XPRIVATE_KEY_PREFIX;
    key = BC([key, BA(9, 0), c, BA(1, 0), m]);
    if (A.base58) return S.encodeBase58(BC([key, S.doubleSha256(key).slice(0, 4)]));
    return key;
  };

  S.xPrivateToXPublicKey = function (xKey) {
    var A = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    ARGS(A, {
      base58: true
    });
    if (S.isString(xKey)) xKey = S.decodeBase58(xKey, {
      hex: false
    }).slice(0, -4);
    if (!S.isBuffer(xKey)) throw new Error("invalid xPrivateKey");
    if (xKey.length !== 78) throw new Error("invalid xPrivateKey");
    var prefix;
    if (xKey.slice(0, 4).equals(S.TESTNET_XPRIVATE_KEY_PREFIX)) prefix = S.TESTNET_XPUBLIC_KEY_PREFIX;else if (xKey.slice(0, 4).equals(S.MAINNET_XPRIVATE_KEY_PREFIX)) prefix = S.MAINNET_XPUBLIC_KEY_PREFIX;else if (xKey.slice(0, 4).equals(S.MAINNET_M49_XPRIVATE_KEY_PREFIX)) prefix = S.MAINNET_M49_XPUBLIC_KEY_PREFIX;else if (xKey.slice(0, 4).equals(S.TESTNET_M49_XPRIVATE_KEY_PREFIX)) prefix = S.TESTNET_M49_XPUBLIC_KEY_PREFIX;else if (xKey.slice(0, 4).equals(S.MAINNET_M84_XPRIVATE_KEY_PREFIX)) prefix = S.MAINNET_M84_XPUBLIC_KEY_PREFIX;else if (xKey.slice(0, 4).equals(S.TESTNET_M84_XPRIVATE_KEY_PREFIX)) prefix = S.TESTNET_M84_XPUBLIC_KEY_PREFIX;else throw new Error("invalid xPrivateKey");
    var key = BC([prefix, xKey.slice(4, 45), S.privateToPublicKey(xKey.slice(46), {
      hex: false
    })]);
    if (A.base58) return S.encodeBase58(BC([key, S.doubleSha256(key).slice(0, 4)]));
    return key;
  };

  S.__decodePath = function (p) {
    var subPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    p = p.split('/');
    if (!subPath) if (p[0] !== 'm') throw new Error("invalid path");
    var r = [];

    for (var i = 1; i < p.length; i++) {
      var k = parseInt(p[i]);
      if (p[i][p[i].length - 1] === "'" && k < S.HARDENED_KEY) k += S.HARDENED_KEY;
      r.push(k);
    }

    return r;
  };

  S.deriveXKey = function (xKey, path) {
    var A = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    ARGS(A, {
      base58: true,
      subPath: false
    });
    if (S.isString(xKey)) xKey = S.decodeBase58(xKey, {
      checkSum: true,
      hex: false
    });
    path = S.__decodePath(path, A.subPath);

    if (S.xKeyType(xKey) === "private") {
      var _iterator = _createForOfIteratorHelper(path),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var p = _step.value;
          xKey = S.__deriveChildXPrivateKey(xKey, p);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    } else {
      var _iterator2 = _createForOfIteratorHelper(path),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _p = _step2.value;
          xKey = S.__deriveChildXPublicKey(xKey, _p);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }

    if (A.base58) return S.encodeBase58(xKey, {
      checkSum: true
    });
    return xKey;
  };

  S.__deriveChildXPrivateKey = function (xPrivateKey, i) {
    var c = xPrivateKey.slice(13, 45);
    var k = xPrivateKey.slice(45);
    var depth = xPrivateKey[4] + 1;
    if (depth > 255) throw new Error("path depth should be <= 255");
    var r = BF(k.slice(1));
    var pub = S.privateToPublicKey(r, {
      hex: false
    });
    var fingerprint = S.hash160(pub).slice(0, 4);
    var s = S.hmacSha512(c, BC([i >= S.HARDENED_KEY ? k : pub, BF(S.intToBytes(i, 4, "big"))]));
    var pi = new BN(s.slice(0, 32));
    if (pi.gte(S.ECDSA_SEC256K1_ORDER)) return null;
    var ki = new BN(k.slice(1));
    ki = ki.add(pi);
    ki = ki.mod(S.ECDSA_SEC256K1_ORDER);
    if (ki.isZero()) return null;
    var key = ki.toArrayLike(S.Buffer, 'be', 32);
    return BC([xPrivateKey.slice(0, 4), BF([depth]), fingerprint, BF(S.intToBytes(i, 4, "big")), s.slice(32), BA(1, 0), key]);
  };

  S.__deriveChildXPublicKey = function (xPublicKey, i) {
    var c = xPublicKey.slice(13, 45);
    var k = xPublicKey.slice(45);
    var depth = xPublicKey[4] + 1;
    if (depth > 255) throw new Error("path depth should be <= 255");
    if (i >= S.HARDENED_KEY) throw new Error("derivation from extended public key impossible");
    var fingerprint = S.hash160(k).slice(0, 4);
    var s = S.hmacSha512(c, BC([k, BF(S.intToBytes(i, 4, "big"))]));
    var pi = new BN(s.slice(0, 32));
    if (pi.gte(S.ECDSA_SEC256K1_ORDER)) return null;
    var pk = S.publicKeyAdd(k, s.slice(0, 32), {
      hex: false
    });
    return BC([xPublicKey.slice(0, 4), BF([depth]), fingerprint, BF(S.intToBytes(i, 4, "big")), s.slice(32), pk]);
  };

  S.publicFromXPublicKey = function (xPub) {
    var A = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    ARGS(A, {
      hex: true
    });
    if (S.isString(xPub)) xPub = S.decodeBase58(xPub, {
      checkSum: true,
      hex: false
    });
    if (xPub.length !== 78) throw new Error("invalid extended public key");
    return A.hex ? xPub.slice(45).hex() : xPub.slice(45);
  };

  S.privateFromXPrivateKey = function (xPriv) {
    var A = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    ARGS(A, {
      wif: true
    });
    if (S.isString(xPriv)) xPriv = S.decodeBase58(xPriv, {
      checkSum: true,
      hex: false
    });
    if (xPriv.length !== 78) throw new Error("invalid extended public key");
    var prefix = xPriv.slice(0, 4);
    var testnet;
    if (prefix.equals(S.MAINNET_XPRIVATE_KEY_PREFIX)) testnet = false;else if (prefix.equals(S.TESTNET_XPRIVATE_KEY_PREFIX)) testnet = true;else if (prefix.equals(S.MAINNET_M49_XPRIVATE_KEY_PREFIX)) testnet = false;else if (prefix.equals(S.TESTNET_M49_XPRIVATE_KEY_PREFIX)) testnet = true;else if (prefix.equals(S.MAINNET_M84_XPRIVATE_KEY_PREFIX)) testnet = false;else if (prefix.equals(S.TESTNET_M84_XPRIVATE_KEY_PREFIX)) testnet = true;else throw new Error("invalid extended public key");
    return A.wif ? S.privateKeyToWif(xPriv.slice(46), {
      testnet: testnet,
      wif: true
    }) : xPriv.slice(46);
  };

  S.isXPrivateKeyValid = function (xPriv) {
    if (S.isString(xPriv)) xPriv = S.decodeBase58(xPriv, {
      checkSum: true,
      hex: false
    });
    if (xPriv.length !== 78) return false;
    var prefix = xPriv.slice(0, 4);
    if (prefix.equals(S.MAINNET_XPRIVATE_KEY_PREFIX)) return true;
    if (prefix.equals(S.TESTNET_XPRIVATE_KEY_PREFIX)) return true;
    if (prefix.equals(S.MAINNET_M49_XPRIVATE_KEY_PREFIX)) return true;
    if (prefix.equals(S.TESTNET_M49_XPRIVATE_KEY_PREFIX)) return true;
    if (prefix.equals(S.MAINNET_M84_XPRIVATE_KEY_PREFIX)) return true;
    return prefix.equals(S.TESTNET_M84_XPRIVATE_KEY_PREFIX);
  };

  S.isXPublicKeyValid = function (xPub) {
    if (S.isString(xPub)) xPub = S.decodeBase58(xPub, {
      checkSum: true,
      hex: false
    });
    if (xPub.length !== 78) return false;
    var prefix = xPub.slice(0, 4);
    if (prefix.equals(S.MAINNET_XPUBLIC_KEY_PREFIX)) return true;
    if (prefix.equals(S.TESTNET_XPUBLIC_KEY_PREFIX)) return true;
    if (prefix.equals(S.MAINNET_M49_XPUBLIC_KEY_PREFIX)) return true;
    if (prefix.equals(S.TESTNET_M49_XPUBLIC_KEY_PREFIX)) return true;
    if (prefix.equals(S.MAINNET_M84_XPUBLIC_KEY_PREFIX)) return true;
    return prefix.equals(S.TESTNET_M84_XPUBLIC_KEY_PREFIX);
  };

  S.xKeyNetworkType = function (xKey) {
    if (S.isString(xKey)) xKey = S.decodeBase58(xKey, {
      checkSum: true,
      hex: false
    });
    if (xKey.length !== 78) return false;
    var prefix = xKey.slice(0, 4);
    if (prefix.equals(S.MAINNET_XPRIVATE_KEY_PREFIX)) return "mainnet";
    if (prefix.equals(S.TESTNET_XPRIVATE_KEY_PREFIX)) return "testnet";
    if (prefix.equals(S.MAINNET_M49_XPRIVATE_KEY_PREFIX)) return "mainnet";
    if (prefix.equals(S.TESTNET_M49_XPRIVATE_KEY_PREFIX)) return "testnet";
    if (prefix.equals(S.MAINNET_M84_XPRIVATE_KEY_PREFIX)) return "mainnet";
    if (prefix.equals(S.TESTNET_M84_XPRIVATE_KEY_PREFIX)) return "testnet";
    if (prefix.equals(S.MAINNET_XPUBLIC_KEY_PREFIX)) return "mainnet";
    if (prefix.equals(S.TESTNET_XPUBLIC_KEY_PREFIX)) return "testnet";
    if (prefix.equals(S.MAINNET_M49_XPUBLIC_KEY_PREFIX)) return "mainnet";
    if (prefix.equals(S.TESTNET_M49_XPUBLIC_KEY_PREFIX)) return "testnet";
    if (prefix.equals(S.MAINNET_M84_XPUBLIC_KEY_PREFIX)) return "mainnet";
    if (prefix.equals(S.TESTNET_M84_XPUBLIC_KEY_PREFIX)) return "testnet";
    throw new Error("invalid extended key");
  };

  S.xKeyType = function (xKey) {
    if (S.isString(xKey)) xKey = S.decodeBase58(xKey, {
      checkSum: true,
      hex: false
    });
    if (xKey.length !== 78) return false;
    var prefix = xKey.slice(0, 4);
    if (prefix.equals(S.MAINNET_XPRIVATE_KEY_PREFIX)) return "private";
    if (prefix.equals(S.TESTNET_XPRIVATE_KEY_PREFIX)) return "private";
    if (prefix.equals(S.MAINNET_M49_XPRIVATE_KEY_PREFIX)) return "private";
    if (prefix.equals(S.TESTNET_M49_XPRIVATE_KEY_PREFIX)) return "private";
    if (prefix.equals(S.MAINNET_M84_XPRIVATE_KEY_PREFIX)) return "private";
    if (prefix.equals(S.TESTNET_M84_XPRIVATE_KEY_PREFIX)) return "private";
    if (prefix.equals(S.MAINNET_XPUBLIC_KEY_PREFIX)) return "public";
    if (prefix.equals(S.TESTNET_XPUBLIC_KEY_PREFIX)) return "public";
    if (prefix.equals(S.MAINNET_M49_XPUBLIC_KEY_PREFIX)) return "public";
    if (prefix.equals(S.TESTNET_M49_XPUBLIC_KEY_PREFIX)) return "public";
    if (prefix.equals(S.MAINNET_M84_XPUBLIC_KEY_PREFIX)) return "public";
    if (prefix.equals(S.TESTNET_M84_XPUBLIC_KEY_PREFIX)) return "public";
    throw new Error("invalid extended key");
  };

  S.xKeyDerivationType = function (xKey) {
    if (S.isString(xKey)) xKey = S.decodeBase58(xKey, {
      checkSum: true,
      hex: false
    });
    if (xKey.length !== 78) return false;
    var prefix = xKey.slice(0, 4);
    if (prefix.equals(S.MAINNET_XPRIVATE_KEY_PREFIX)) return "BIP44";
    if (prefix.equals(S.TESTNET_XPRIVATE_KEY_PREFIX)) return "BIP44";
    if (prefix.equals(S.MAINNET_M49_XPRIVATE_KEY_PREFIX)) return "BIP49";
    if (prefix.equals(S.TESTNET_M49_XPRIVATE_KEY_PREFIX)) return "BIP49";
    if (prefix.equals(S.MAINNET_M84_XPRIVATE_KEY_PREFIX)) return "BIP84";
    if (prefix.equals(S.TESTNET_M84_XPRIVATE_KEY_PREFIX)) return "BIP84";
    if (prefix.equals(S.MAINNET_XPUBLIC_KEY_PREFIX)) return "BIP44";
    if (prefix.equals(S.TESTNET_XPUBLIC_KEY_PREFIX)) return "BIP44";
    if (prefix.equals(S.MAINNET_M49_XPUBLIC_KEY_PREFIX)) return "BIP49";
    if (prefix.equals(S.TESTNET_M49_XPUBLIC_KEY_PREFIX)) return "BIP49";
    if (prefix.equals(S.MAINNET_M84_XPUBLIC_KEY_PREFIX)) return "BIP84";
    if (prefix.equals(S.TESTNET_M84_XPUBLIC_KEY_PREFIX)) return "BIP84";
    return "custom";
  };

  S.pathXKeyTo_BIP32_XKey = function (xKey) {
    var A = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    ARGS(A, {
      base58: true
    });
    if (S.isString(xKey)) xKey = S.decodeBase58(xKey, {
      checkSum: true,
      hex: false
    });
    if (xKey.length !== 78) throw new Error("invalid extended key");
    var prefix = xKey.slice(0, 4);
    var newPrefix;
    if (prefix.equals(S.MAINNET_XPUBLIC_KEY_PREFIX)) newPrefix = prefix;else if (prefix.equals(S.TESTNET_XPUBLIC_KEY_PREFIX)) newPrefix = prefix;else if (prefix.equals(S.MAINNET_XPRIVATE_KEY_PREFIX)) newPrefix = prefix;else if (prefix.equals(S.TESTNET_XPRIVATE_KEY_PREFIX)) newPrefix = prefix;else if (prefix.equals(S.MAINNET_M49_XPUBLIC_KEY_PREFIX)) newPrefix = S.MAINNET_XPUBLIC_KEY_PREFIX;else if (prefix.equals(S.MAINNET_M84_XPUBLIC_KEY_PREFIX)) newPrefix = S.MAINNET_XPUBLIC_KEY_PREFIX;else if (prefix.equals(S.TESTNET_M49_XPUBLIC_KEY_PREFIX)) newPrefix = S.TESTNET_XPUBLIC_KEY_PREFIX;else if (prefix.equals(S.TESTNET_M84_XPUBLIC_KEY_PREFIX)) newPrefix = S.TESTNET_XPUBLIC_KEY_PREFIX;else if (prefix.equals(S.MAINNET_M49_XPRIVATE_KEY_PREFIX)) newPrefix = S.MAINNET_XPRIVATE_KEY_PREFIX;else if (prefix.equals(S.TESTNET_M49_XPRIVATE_KEY_PREFIX)) newPrefix = S.TESTNET_XPRIVATE_KEY_PREFIX;else if (prefix.equals(S.TESTNET_M84_XPRIVATE_KEY_PREFIX)) newPrefix = S.TESTNET_XPRIVATE_KEY_PREFIX;else if (prefix.equals(S.MAINNET_M84_XPRIVATE_KEY_PREFIX)) newPrefix = S.MAINNET_XPRIVATE_KEY_PREFIX;else throw new Error("invalid extended key");
    if (A.base58) return S.encodeBase58(BC([newPrefix, xKey.slice(4)]), {
      checkSum: true
    });
    return BC([newPrefix, xKey.slice(4)]);
  };

  S.BIP32_XKeyToPathXKey = function (xKey, pathType) {
    var A = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    ARGS(A, {
      base58: true
    });
    if (!["BIP44", "BIP49", "BIP84"].includes(pathType)) throw new Error("unsupported path type " + pathType);
    if (S.isString(xKey)) xKey = S.decodeBase58(xKey, {
      checkSum: true,
      hex: false
    });
    if (xKey.length !== 78) throw new Error("invalid extended key");
    var prefix = xKey.slice(0, 4);
    var newPrefix;
    if (prefix.equals(S.TESTNET_XPRIVATE_KEY_PREFIX)) switch (pathType) {
      case "BIP44":
        newPrefix = S.TESTNET_M44_XPRIVATE_KEY_PREFIX;
        break;

      case "BIP49":
        newPrefix = S.TESTNET_M49_XPRIVATE_KEY_PREFIX;
        break;

      case "BIP84":
        newPrefix = S.TESTNET_M84_XPRIVATE_KEY_PREFIX;
    } else if (prefix.equals(S.MAINNET_XPRIVATE_KEY_PREFIX)) switch (pathType) {
      case "BIP44":
        newPrefix = S.MAINNET_M44_XPRIVATE_KEY_PREFIX;
        break;

      case "BIP49":
        newPrefix = S.MAINNET_M49_XPRIVATE_KEY_PREFIX;
        break;

      case "BIP84":
        newPrefix = S.MAINNET_M84_XPRIVATE_KEY_PREFIX;
    } else if (prefix.equals(S.TESTNET_XPUBLIC_KEY_PREFIX)) switch (pathType) {
      case "BIP44":
        newPrefix = S.TESTNET_M44_XPUBLIC_KEY_PREFIX;
        break;

      case "BIP49":
        newPrefix = S.TESTNET_M49_XPUBLIC_KEY_PREFIX;
        break;

      case "BIP84":
        newPrefix = S.TESTNET_M84_XPUBLIC_KEY_PREFIX;
    } else if (prefix.equals(S.MAINNET_XPUBLIC_KEY_PREFIX)) switch (pathType) {
      case "BIP44":
        newPrefix = S.MAINNET_M44_XPUBLIC_KEY_PREFIX;
        break;

      case "BIP49":
        newPrefix = S.MAINNET_M49_XPUBLIC_KEY_PREFIX;
        break;

      case "BIP84":
        newPrefix = S.MAINNET_M84_XPUBLIC_KEY_PREFIX;
    } else throw new Error("invalid extended key");
    if (A.base58) return S.encodeBase58(BC([newPrefix, xKey.slice(4)]), {
      checkSum: true
    });
    return BC([newPrefix, xKey.slice(4)]);
  };
};