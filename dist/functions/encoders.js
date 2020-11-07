"use strict";

module.exports = function (S) {
  var CM = S.__bitcoin_core_crypto.module;
  var BA = Buffer.alloc;
  var BC = Buffer.concat;
  var getBuffer = S.getBuffer;
  var ARGS = S.defArgs;
  var malloc = CM._malloc;
  var free = CM._free;
  var getValue = CM.getValue;

  S.encodeBase58 = function (m) {
    var A = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    ARGS(A, {
      encoding: 'hex|utf8',
      checkSum: false
    });
    m = getBuffer(m, A.encoding);
    if (A.checkSum) m = BC([m, S.doubleSha256(m).slice(0, 4)]);
    if (m.length > 1073741823) throw new Error('encodeBase58 message is too long');
    var bP = malloc(m.length);
    var eS = m.length * 138 / 100 + 1;
    var oP = malloc(m.length * 138 / 100 + 1);
    CM.HEAPU8.set(m, bP);

    CM._EncodeBase58(bP, bP + m.length, oP);

    var out = new BA(eS);
    var q;

    for (q = 0; q <= eS; q++) {
      out[q] = getValue(oP + q, 'i8');
      if (out[q] === 0) break;
    }

    free(bP);
    free(oP);
    return out.slice(0, q).toString();
  };

  S.decodeBase58 = function (m) {
    var A = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    ARGS(A, {
      hex: true,
      checkSum: false
    });
    if (!S.isString(m)) throw new Error('decodeBase58 string required');
    if (m.length > 2147483647) throw new Error('decodeBase58 string is too long');
    var mB = new BA(m.length + 1);
    mB.write(m);
    mB.writeInt8(0, m.length);
    var bP = malloc(mB.length);
    var oLP = malloc(4);
    var oP = malloc(Math.ceil(m.length * 733 / 1000) + 2);
    CM.HEAPU8.set(mB, bP);

    var r = CM._DecodeBase58(bP, oP, oLP);

    free(bP);

    if (r) {
      var oL = CM.getValue(oLP, 'i32');
      free(oLP);
      var out = new BA(oL);

      for (var q = 0; q <= oL; q++) {
        out[q] = getValue(oP + q, 'i8');
      }

      free(oP);
      if (A.checkSum) out = out.slice(0, -4);
      return A.hex ? out.hex() : out;
    }

    free(oP);
    free(oLP);
    return "";
  };

  S.rebaseBits = function (data, fromBits, toBits, pad) {
    if (pad === undefined) pad = true;
    var acc = 0,
        bits = 0,
        ret = [];
    var maxv = (1 << toBits) - 1;
    var max_acc = (1 << fromBits + toBits - 1) - 1;

    for (var i = 0; i < data.length; i++) {
      var value = data[i];
      if (value < 0 || value >> fromBits) throw "invalid bytes";
      acc = (acc << fromBits | value) & max_acc;
      bits += fromBits;

      while (bits >= toBits) {
        bits -= toBits;
        ret.push(acc >> bits & maxv);
      }
    }

    if (pad === true) {
      if (bits) ret.push(acc << toBits - bits & maxv);
    } else if (bits >= fromBits || acc << toBits - bits & maxv) throw "invalid padding";

    return ret;
  };

  S.rebase_5_to_8 = function (data, pad) {
    if (pad === undefined) pad = true;
    return S.rebaseBits(data, 5, 8, pad);
  };

  S.rebase_8_to_5 = function (data, pad) {
    if (pad === undefined) pad = true;
    return S.rebaseBits(data, 8, 5, pad);
  };

  S.rebase_32_to_5 = function (data) {
    if (typeof data !== "string") data = S.bytesToString(data);
    var b = [];

    try {
      for (var i = 0; i < data.length; i++) {
        b.push(S.INT_BASE32_MAP[data[i]]);
      }
    } catch (err) {
      throw "Non base32 characters";
    }

    return b;
  };

  S.rebase_5_to_32 = function (data, bytes) {
    if (bytes === undefined) bytes = true;
    var r = [];

    for (var i = 0; i < data.length; i++) {
      r.push(S.BASE32_INT_MAP[data[i]]);
    }

    return bytes === true ? r : S.bytesToString(r);
  };

  S.bech32Polymod = function (values) {
    var generator = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
    var chk = 1;

    for (var i = 0; i < values.length; i++) {
      var top = chk >> 25;
      chk = (chk & 0x1ffffff) << 5 ^ values[i];

      for (var k = 0; k < 5; k++) {
        if (top >> k & 1) chk ^= generator[k];else chk ^= 0;
      }
    }

    return chk ^ 1;
  };
};