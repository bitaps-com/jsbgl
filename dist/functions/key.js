"use strict";

module.exports = function (S) {
  var Buffer = S.Buffer;
  var BF = Buffer.from;
  var BC = Buffer.concat;
  var BA = Buffer.alloc;
  var isBuffer = S.isBuffer;
  var getBuffer = S.getBuffer;
  var ARGS = S.defArgs;
  var crypto = S.__bitcoin_core_crypto.module;
  var malloc = crypto._malloc;
  var free = crypto._free;
  var getValue = crypto.getValue;

  S.createPrivateKey = function () {
    var A = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    ARGS(A, {
      compressed: true,
      testnet: false,
      wif: true,
      hex: false
    });
    if (A.wif) return S.privateKeyToWif(S.generateEntropy({
      hex: false
    }), A);
    if (A.hex) return S.generateEntropy({
      hex: true
    });
    return S.generateEntropy({
      hex: false
    });
  };

  S.privateKeyToWif = function (h) {
    var A = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    ARGS(A, {
      compressed: true,
      testnet: false
    });
    h = getBuffer(h);
    if (h.length !== 32) throw new Error('invalid byte string');
    var prefix;
    if (A.testnet) prefix = BF(S.TESTNET_PRIVATE_KEY_BYTE_PREFIX);else prefix = BF(S.MAINNET_PRIVATE_KEY_BYTE_PREFIX);
    if (A.compressed) h = BC([prefix, h, Buffer.from([1])]);else h = BC([prefix, h]);
    h = BC([h, S.doubleSha256(h).slice(0, 4)]);
    return S.encodeBase58(h);
  };

  S.wifToPrivateKey = function (h) {
    var A = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    ARGS(A, {
      hex: true
    });
    h = S.decodeBase58(h, {
      hex: false
    });
    if (!S.doubleSha256(h.slice(0, h.length - 4), {
      hex: false
    }).slice(0, 4).equals(h.slice(h.length - 4, h.length))) throw new Error('invalid byte string');
    return A.hex ? h.slice(1, 33).hex() : h.slice(1, 33);
  };

  S.isWifValid = function (wif) {
    if (!S.isString(wif)) return false;
    if (!S.PRIVATE_KEY_PREFIX_LIST.includes(wif[0])) return false;

    try {
      var h = S.decodeBase58(wif, {
        hex: false
      });
      var checksum = h.slice(h.length - 4, h.length);
      var unc = [S.MAINNET_PRIVATE_KEY_UNCOMPRESSED_PREFIX, S.TESTNET_PRIVATE_KEY_UNCOMPRESSED_PREFIX];

      if (unc.includes(wif[0])) {
        if (h.length !== 37) return false;
      } else {
        if (h.length !== 38) return false;
      }

      var calcChecksum = S.doubleSha256(h.slice(0, h.length - 4), {
        hex: false
      }).slice(0, 4);
      return calcChecksum.equals(checksum);
    } catch (e) {}

    return false;
  };

  S.privateToPublicKey = function (privateKey) {
    var A = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    ARGS(A, {
      compressed: true,
      hex: true
    });

    if (!isBuffer(privateKey)) {
      if (S.isString(privateKey)) {
        if (S.isHex(privateKey)) privateKey = Buffer.from(privateKey, 'hex');else {
          var unc = [S.MAINNET_PRIVATE_KEY_UNCOMPRESSED_PREFIX, S.TESTNET_PRIVATE_KEY_UNCOMPRESSED_PREFIX];
          if (unc.includes(privateKey[0])) A.compressed = false;
          privateKey = S.wifToPrivateKey(privateKey, {
            hex: false
          });
        }
      } else {
        throw new Error('invalid private key string');
      }
    }

    if (privateKey.length !== 32) throw new Error('private key length invalid');
    var privateKeyPointer = malloc(32);
    var publicKeyPointer = malloc(64);
    crypto.HEAPU8.set(privateKey, privateKeyPointer);

    crypto._secp256k1_ec_pubkey_create(S.secp256k1PrecompContextSign, publicKeyPointer, privateKeyPointer);

    free(privateKeyPointer);
    var outq = new BA(64);

    for (var i = 0; i < 64; i++) {
      outq[i] = getValue(publicKeyPointer + i, 'i8');
    }

    var pubLen = A.compressed ? 33 : 65;
    var publicKeySerializedPointer = malloc(65);
    var pubLenPointer = malloc(1);
    crypto.HEAPU8.set([pubLen], pubLenPointer);
    var flag = A.compressed ? S.SECP256K1_EC_COMPRESSED : S.SECP256K1_EC_UNCOMPRESSED;

    var r = crypto._secp256k1_ec_pubkey_serialize(S.secp256k1PrecompContextVerify, publicKeySerializedPointer, pubLenPointer, publicKeyPointer, flag);

    var out;

    if (r) {
      out = new BA(pubLen);

      for (var _i = 0; _i < pubLen; _i++) {
        out[_i] = getValue(publicKeySerializedPointer + _i, 'i8');
      }
    } else out = false;

    free(publicKeyPointer);
    free(pubLenPointer);
    free(publicKeySerializedPointer);
    if (out === false) throw new Error('privateToPublicKey failed');
    return A.hex ? out.hex() : out;
  };

  S.isPublicKeyValid = function (key) {
    if (S.isString(key)) {
      if (!S.isHex(key)) return false;
      key = BF(key, 'hex');
    }

    if (key.length < 33) return false;
    if (key[0] === 4 && key.length !== 65) return false;
    if (key[0] === 2 || key[0] === 3) if (key.length !== 33) return false;
    return !(key[0] < 2 || key[0] > 4);
  };

  S.publicKeyAdd = function (key, tweak) {
    var A = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    ARGS(A, {
      compressed: true,
      hex: true
    });
    key = S.getBuffer(key);
    tweak = S.getBuffer(tweak);
    var keyP = malloc(65);
    var tweakP = malloc(tweak.length);
    crypto.HEAPU8.set(key, keyP);
    crypto.HEAPU8.set(tweak, tweakP);
    var rawKeyP = malloc(65);

    var r = crypto._secp256k1_ec_pubkey_parse(S.secp256k1PrecompContextVerify, rawKeyP, keyP, key.length);

    if (!r) throw new Error('publicKeyAdd failed');
    r = crypto._secp256k1_ec_pubkey_tweak_add(S.secp256k1PrecompContextVerify, rawKeyP, tweakP);
    free(tweakP);
    if (!r) throw new Error('publicKeyAdd failed');
    var flag = A.compressed ? S.SECP256K1_EC_COMPRESSED : S.SECP256K1_EC_UNCOMPRESSED;
    var pubLen = A.compressed ? 33 : 65;
    var publicKeySerializedPointer = malloc(65);
    var pubLenPointer = malloc(1);
    crypto.HEAPU8.set([pubLen], pubLenPointer);
    r = crypto._secp256k1_ec_pubkey_serialize(S.secp256k1PrecompContextVerify, publicKeySerializedPointer, pubLenPointer, rawKeyP, flag);
    free(rawKeyP);
    free(keyP);
    var out;

    if (r) {
      out = new BA(pubLen);

      for (var i = 0; i < pubLen; i++) {
        out[i] = getValue(publicKeySerializedPointer + i, 'i8');
      }
    } else out = false;

    free(pubLenPointer);
    free(publicKeySerializedPointer);
    if (out === false) throw new Error('publicKeyAdd failed');
    return A.hex ? out.hex() : out;
  };
};