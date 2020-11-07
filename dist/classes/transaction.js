"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

module.exports = function (S) {
  var s2rh = S.s2rh;
  var rh2s = S.rh2s;
  var Buffer = S.Buffer;
  var BN = S.BN;
  var isBuffer = S.Buffer.isBuffer;
  var ARGS = S.defArgs;
  var getBuffer = S.getBuffer;
  var BF = Buffer.from;
  var BA = Buffer.alloc;
  var BC = Buffer.concat;
  var O = S.OPCODE;
  var iS = S.isString;

  var Transaction = function Transaction() {
    var A = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2["default"])(this, Transaction);
    ARGS(A, {
      rawTx: null,
      format: 'decoded',
      version: 2,
      lockTime: 0,
      testnet: false,
      autoCommit: true,
      keepRawTx: false
    });
    if (!["decoded", "raw"].includes(A.format)) throw new Error('format error, raw or decoded allowed');
    this.autoCommit = A.autoCommit;
    this.format = A.format;
    this.testnet = A.testnet;
    this.segwit = false;
    this.txId = null;
    this.hash = null;
    this.version = A.version;
    this.size = 0;
    this.vSize = 0;
    this.bSize = 0;
    this.vIn = {};
    this.vOut = {};
    this.rawTx = null;
    this.blockHash = null;
    this.confirmations = null;
    this.time = null;
    this.blockTime = null;
    this.lockTime = A.lockTime;
    this.blockIndex = null;
    this.coinbase = false;
    this.fee = null;
    this.data = null;
    this.amount = null;
    if (A.rawTx === null) return;
    var tx = getBuffer(A.rawTx);
    this.amount = 0;
    var sw = 0,
        swLen = 0;
    var start = tx.__offset === undefined ? 0 : tx.__offset;
    this.version = tx.readInt(4);
    var n = tx.readVarInt();

    if (n[0] === 0) {
      // segwit format
      sw = 1;
      this.flag = tx.read(1);
      n = tx.readVarInt();
    } // inputs


    var ic = S.varIntToInt(n);

    for (var k = 0; k < ic; k++) {
      this.vIn[k] = {
        txId: tx.read(32),
        vOut: tx.readInt(4),
        scriptSig: tx.read(S.varIntToInt(tx.readVarInt())),
        sequence: tx.readInt(4)
      };
    } // outputs


    var oc = S.varIntToInt(tx.readVarInt());

    for (var _k = 0; _k < oc; _k++) {
      this.vOut[_k] = {};
      this.vOut[_k].value = tx.readInt(8);
      this.amount += this.vOut[_k].value;
      this.vOut[_k].scriptPubKey = tx.read(S.varIntToInt(tx.readVarInt()));
      var s = S.parseScript(this.vOut[_k].scriptPubKey);
      this.vOut[_k].nType = s.nType;
      this.vOut[_k].type = s.type;
      if (this.data === null && s.type === 3) this.data = s.data;

      if (s.addressHash !== undefined) {
        this.vOut[_k].addressHash = s.addressHash;
        this.vOut[_k].reqSigs = s.reqSigs;
      }
    } // witness


    if (sw) {
      sw = tx.__offset - start;

      for (var _k2 = 0; _k2 < ic; _k2++) {
        this.vIn[_k2].txInWitness = [];
        var t = S.varIntToInt(tx.readVarInt());

        for (var q = 0; q < t; q++) {
          this.vIn[_k2].txInWitness.push(tx.read(S.varIntToInt(tx.readVarInt())));
        }
      }

      swLen = tx.__offset - start - sw + 2;
    }

    this.lockTime = tx.readInt(4);
    var end = tx.__offset;
    this.rawTx = tx.slice(start, end);
    this.size = end - start;
    this.bSize = end - start - swLen;
    this.weight = this.bSize * 3 + this.size;
    this.vSize = Math.ceil(this.weight / 4);
    this.coinbase = !!(ic === 1 && this.vIn[0].txId.equals(Buffer(32)) && this.vIn[0].vOut === 0xffffffff);

    if (sw > 0) {
      this.segwit = true;
      this.hash = S.sha256(this.rawTx);
      this.txId = S.sha256(BC([this.rawTx.slice(0, 4), this.rawTx.slice(6, sw), this.rawTx.slice(this.rawTx.length - 4, this.rawTx.length)]));
    } else {
      this.txId = S.sha256(this.rawTx);
      this.hash = this.txId;
      this.segwit = false;
    }

    if (!A.keepRawTx) this.rawTx = null;
    if (A.format === 'decoded') this.decode();
  }; // change Transaction object representation to "decoded" human readable format


  Transaction.prototype.decode = function (testnet) {
    this.format = 'decoded';
    if (testnet !== undefined) this.testnet = testnet;
    if (isBuffer(this.txId)) this.txId = rh2s(this.txId);
    if (isBuffer(this.hash)) this.hash = rh2s(this.hash);
    if (isBuffer(this.flag)) this.flag = rh2s(this.flag);
    if (isBuffer(this.rawTx)) this.rawTx = this.rawTx.hex();

    for (var i in this.vIn) {
      if (isBuffer(this.vIn[i].txId)) this.vIn[i].txId = rh2s(this.vIn[i].txId);
      if (isBuffer(this.vIn[i].scriptSig)) this.vIn[i].scriptSig = this.vIn[i].scriptSig.hex();
      if (this.vIn[i].amount instanceof S.BN) this.vIn[i].amount = this.vIn[i].amount.toString(16);

      if (this.vIn[i].txInWitness !== undefined) {
        var t = [];

        var _iterator = _createForOfIteratorHelper(this.vIn[i].txInWitness),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var w = _step.value;
            t.push(isBuffer(w) ? w.hex() : w);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        this.vIn[i].txInWitness = t;
      }

      if (isBuffer(this.vIn[i].addressHash)) {
        var _w = this.vIn[i].nType < 5 ? null : this.vIn[i].addressHash[0];

        this.vIn[i].addressHash = this.vIn[i].addressHash.hex();
        var sh = [1, 5].includes(this.vIn[i].nType);
        this.vIn[i].address = S.hashToAddress(this.vIn[i].addressHash, {
          testnet: this.testnet,
          scriptHash: sh,
          witnessVersion: _w
        });
      }

      if (isBuffer(this.vIn[i].scriptPubKey)) {
        this.vIn[i].scriptPubKey = this.vIn[i].scriptPubKey.hex();
        this.vIn[i].scriptPubKeyOpcodes = S.decodeScript(this.vIn[i].scriptPubKey);
        this.vIn[i].scriptPubKeyAsm = S.decodeScript(this.vIn[i].scriptPubKey, {
          asm: true
        });
      }

      if (isBuffer(this.vIn[i].redeemScript)) {
        this.vIn[i].redeemScript = this.vIn[i].redeemScript.hex();
        this.vIn[i].redeemScriptOpcodes = S.decodeScript(this.vIn[i].redeemScript);
        this.vIn[i].redeemScriptAsm = S.decodeScript(this.vIn[i].redeemScript, {
          asm: true
        });
      }

      if (!this.coinbase) {
        if (isBuffer(this.vIn[i].scriptSig)) {
          this.vIn[i].scriptSig = this.vIn[i].scriptSig.hex();
        }

        this.vIn[i].scriptSigOpcodes = S.decodeScript(this.vIn[i].scriptSig);
        this.vIn[i].scriptSigAsm = S.decodeScript(this.vIn[i].scriptSig, {
          asm: true
        });
      }
    }

    for (var _i in this.vOut) {
      if (isBuffer(this.vOut[_i].addressHash)) {
        var _w2 = this.vOut[_i].nType < 5 ? null : this.vOut[_i].scriptPubKey[0];

        this.vOut[_i].addressHash = this.vOut[_i].addressHash.hex();

        var _sh = [1, 5].includes(this.vOut[_i].nType);

        this.vOut[_i].address = S.hashToAddress(this.vOut[_i].addressHash, {
          testnet: this.testnet,
          scriptHash: _sh,
          witnessVersion: _w2
        });
      }

      if (isBuffer(this.vOut[_i].scriptPubKey)) {
        this.vOut[_i].scriptPubKey = this.vOut[_i].scriptPubKey.hex();
        this.vOut[_i].scriptPubKeyOpcodes = S.decodeScript(this.vOut[_i].scriptPubKey);
        this.vOut[_i].scriptPubKeyAsm = S.decodeScript(this.vOut[_i].scriptPubKey, {
          asm: true
        });
      }
    }

    if (isBuffer(this.data)) this.data = this.data.hex();
    return this;
  };

  Transaction.prototype.encode = function () {
    if (iS(this.txId)) this.txId = s2rh(this.txId);
    if (iS(this.flag)) this.flag = s2rh(this.flag);
    if (iS(this.hash)) this.hash = s2rh(this.hash);
    if (iS(this.rawTx)) this.rawTx = BF(this.hash, 'hex');

    for (var i in this.vIn) {
      if (iS(this.vIn[i].txId)) this.vIn[i].txId = s2rh(this.vIn[i].txId);
      if (iS(this.vIn[i].scriptSig)) this.vIn[i].scriptSig = BF(this.vIn[i].scriptSig, 'hex');

      if (this.vIn[i].txInWitness !== undefined) {
        var t = [];

        var _iterator2 = _createForOfIteratorHelper(this.vIn[i].txInWitness),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var w = _step2.value;
            t.push(iS(w) ? BF(w, 'hex') : w);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        this.vIn[i].txInWitness = t;
      }

      if (iS(this.vIn[i].addressHash)) this.vIn[i].addressHash = BF(this.vIn[i].addressHash, 'hex');
      if (iS(this.vIn[i].scriptPubKey)) this.vIn[i].scriptPubKey = BF(this.vIn[i].scriptPubKey, 'hex');
      if (iS(this.vIn[i].redeemScript)) this.vIn[i].redeemScript = BF(this.vIn[i].redeemScript, 'hex');
      if (iS(this.vIn[i].addressHash)) this.vIn[i].addressHash = BF(this.vIn[i].addressHash, 'hex');
      delete this.vIn[i].scriptSigAsm;
      delete this.vIn[i].scriptSigOpcodes;
      delete this.vIn[i].scriptPubKeyOpcodes;
      delete this.vIn[i].scriptPubKeyAsm;
      delete this.vIn[i].redeemScriptOpcodes;
      delete this.vIn[i].redeemScriptAsm;
      delete this.vIn[i].address;
    }

    for (var _i2 in this.vOut) {
      if (iS(this.vOut[_i2].scriptPubKey)) this.vOut[_i2].scriptPubKey = BF(this.vOut[_i2].scriptPubKey, 'hex');
      if (iS(this.vOut[_i2].addressHash)) this.vOut[_i2].addressHash = BF(this.vOut[_i2].addressHash, 'hex');
      delete this.address;
      delete this.vOut[_i2].scriptPubKeyOpcodes;
      delete this.vOut[_i2].scriptPubKeyAsm;
    }

    if (iS(this.data)) this.data = BF(this.data, 'hex');
    this.format = 'raw';
    return this;
  };

  Transaction.prototype.serialize = function () {
    var A = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    ARGS(A, {
      segwit: true,
      hex: true
    });
    var chunks = [];
    chunks.push(BF(S.intToBytes(this.version, 4)));
    if (A.segwit && this.segwit) chunks.push(BF([0, 1]));
    chunks.push(BF(S.intToVarInt(Object.keys(this.vIn).length)));

    for (var i in this.vIn) {
      if (iS(this.vIn[i].txId)) chunks.push(s2rh(this.vIn[i].txId));else chunks.push(this.vIn[i].txId);
      chunks.push(BF(S.intToBytes(this.vIn[i].vOut, 4)));
      var s = iS(this.vIn[i].scriptSig) ? BF(this.vIn[i].scriptSig, 'hex') : this.vIn[i].scriptSig;
      chunks.push(BF(S.intToVarInt(s.length)));
      chunks.push(s);
      chunks.push(BF(S.intToBytes(this.vIn[i].sequence, 4)));
    }

    chunks.push(BF(S.intToVarInt(Object.keys(this.vOut).length)));

    for (var _i3 in this.vOut) {
      chunks.push(BF(S.intToBytes(this.vOut[_i3].value, 8)));

      var _s = iS(this.vOut[_i3].scriptPubKey) ? BF(this.vOut[_i3].scriptPubKey, 'hex') : this.vOut[_i3].scriptPubKey;

      chunks.push(BF(S.intToVarInt(_s.length)));
      chunks.push(_s);
    }

    if (A.segwit && this.segwit) {
      for (var _i4 in this.vIn) {
        chunks.push(BF(S.intToVarInt(this.vIn[_i4].txInWitness.length)));

        var _iterator3 = _createForOfIteratorHelper(this.vIn[_i4].txInWitness),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var w = _step3.value;

            var _s2 = iS(w) ? BF(w, 'hex') : w;

            chunks.push(BF(S.intToVarInt(_s2.length)));
            chunks.push(_s2);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }
    }

    chunks.push(BF(S.intToBytes(this.lockTime, 4)));
    var out = BC(chunks);
    return A.hex ? out.hex() : out;
  };

  Transaction.prototype.json = function () {
    var r;

    if (this.format === 'raw') {
      this.decode();
      r = JSON.stringify(this);
      this.encode();
    } else r = JSON.stringify(this);

    return r;
  };

  Transaction.prototype.addInput = function () {
    var A = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    ARGS(A, {
      txId: null,
      vOut: 0,
      sequence: 0xffffffff,
      scriptSig: "",
      txInWitness: null,
      value: null,
      scriptPubKey: null,
      address: null,
      privateKey: null,
      redeemScript: null,
      inputVerify: true
    });
    var witness = [],
        s;

    if (A.txId === null) {
      A.txId = Buffer(32);
      A.vOut = 0xffffffff;
      if ((A.sequence !== 0xffffffff || Object.keys(this.vOut).length) && A.inputVerify) throw new Error('invalid coinbase transaction');
    }

    if (iS(A.txId)) if (S.isHex(A.txId)) A.txId = s2rh(A.txId);else throw new Error('txId invalid');
    if (!isBuffer(A.txId) || A.txId.length !== 32) throw new Error('txId invalid');
    if (A.scriptSig.length === 0) A.scriptSig = BF([]);
    if (iS(A.scriptSig)) if (S.isHex(A.scriptSig)) A.scriptSig = BF(A.scriptSig, 'hex');else throw new Error('scriptSig invalid');
    if (!isBuffer(A.scriptSig) || A.scriptSig.length > 520 && A.inputVerify) throw new Error('scriptSig invalid');
    if (A.vOut < 0 || A.vOut > 0xffffffff) throw new Error('vOut invalid');
    if (A.sequence < 0 || A.sequence > 0xffffffff) throw new Error('vOut invalid');
    if (A.privateKey !== null && !(A.privateKey instanceof S.PrivateKey)) A.privateKey = S.PrivateKey(A.privateKey);
    if (A.value !== null && (A.value < 0 || A.value > S.MAX_AMOUNT)) throw new Error('amount invalid');

    if (A.txInWitness !== null) {
      var l = 0;

      var _iterator4 = _createForOfIteratorHelper(A.txInWitness),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var w = _step4.value;
          if (iS(w)) witness.push(this.format === 'raw' ? BF(w, 'hex') : w);else witness.push(this.format === 'raw' ? w : BF(w, 'hex'));
          l += 1 + w.length;
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }

    if (A.txId.equals(Buffer.alloc(32))) {
      if (!(A.vOut === 0xffffffff && A.sequence === 0xffffffff && A.scriptSig.length <= 100)) if (A.inputVerify) throw new Error("coinbase tx invalid");
      this.coinbase = true;
    }

    if (A.scriptPubKey !== null) {
      if (iS(A.scriptPubKey)) A.scriptPubKey = BF(A.scriptPubKey, 'hex');
      if (!isBuffer(A.scriptPubKey)) throw new Error("scriptPubKey invalid");
    }

    if (A.redeemScript !== null) {
      if (iS(A.redeemScript)) A.redeemScript = BF(A.redeemScript, 'hex');
      if (!isBuffer(A.redeemScript)) throw new Error("scriptPubKey invalid");
    }

    if (A.address !== null) {
      if (iS(A.address)) {
        var net = S.addressNetType(A.address) === 'mainnet';
        if (!(net !== this.testnet)) throw new Error("address invalid");
        s = S.addressToScript(A.address);
      } else if (A.address.address !== undefined) s = S.addressToScript(A.address.address);else throw new Error("address invalid");

      if (A.scriptPubKey !== null) {
        if (!A.scriptPubKey.equals(s)) throw new Error("address not match script");
      } else A.scriptPubKey = s;
    }

    var k = Object.keys(this.vIn).length;
    this.vIn[k] = {};
    this.vIn[k].vOut = A.vOut;
    this.vIn[k].sequence = A.sequence;

    if (this.format === 'raw') {
      this.vIn[k].txId = A.txId;
      this.vIn[k].scriptSig = A.scriptSig;
      if (A.scriptPubKey !== null) this.vIn[k].scriptPubKey = A.scriptPubKey;
      if (A.redeemScript !== null) this.vIn[k].redeemScript = A.redeemScript;
    } else {
      this.vIn[k].txId = rh2s(A.txId);
      this.vIn[k].scriptSig = A.scriptSig.hex();
      this.vIn[k].scriptSigOpcodes = S.decodeScript(A.scriptSig);
      this.vIn[k].scriptSigAsm = S.decodeScript(A.scriptSig, {
        asm: true
      });

      if (A.scriptPubKey !== null) {
        this.vIn[k].scriptPubKey = A.scriptPubKey.hex();
        this.vIn[k].scriptPubKeyOpcodes = S.decodeScript(A.scriptPubKey);
        this.vIn[k].scriptPubKeyAsm = S.decodeScript(A.scriptPubKey, {
          asm: true
        });
      }

      if (A.redeemScript !== null) {
        this.vIn[k].redeemScript = A.redeemScript.hex();
        this.vIn[k].redeemScriptOpcodes = S.decodeScript(A.redeemScript);
        this.vIn[k].redeemScriptAsm = S.decodeScript(A.redeemScript, {
          asm: true
        });
      }
    }

    if (A.txInWitness !== null) {
      this.segwit = true;
      this.vIn[k].txInWitness = witness;
    }

    if (A.value !== null) this.vIn[k].value = A.value;
    if (A.privateKey !== 0) this.vIn[k].privateKey = A.privateKey;
    if (this.autoCommit) this.commit();
    return this;
  };

  Transaction.prototype.addOutput = function () {
    var A = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    ARGS(A, {
      value: 0,
      address: null,
      scriptPubKey: null
    });
    if (A.address === null && A.scriptPubKey === null) throw new Error("unable to add output, address or script required");
    if (A.value < 0 || A.value > S.MAX_AMOUNT) throw new Error(" amount value error");
    if (A.scriptPubKey !== null) if (iS(A.scriptPubKey)) A.scriptPubKey = BF(A.scriptPubKey, 'hex');else if (A.address !== null) if (A.address.address !== undefined) A.address = A.address.address;
    if (A.address !== null) A.scriptPubKey = S.addressToScript(A.address);
    var k = Object.keys(this.vOut).length;
    this.vOut[k] = {};
    this.vOut[k].value = A.value;
    var s = S.parseScript(A.scriptPubKey, {
      segwit: true
    });
    this.vOut[k].nType = s.nType;
    this.vOut[k].type = s.type;

    if (this.format === 'raw') {
      this.vOut[k].scriptPubKey = A.scriptPubKey;
      if (this.data === null && s.nType === 3) this.data = s.data;

      if (![3, 4, 7, 8].includes(s.nType)) {
        this.vOut[k].addressHash = s.addressHash;
        this.vOut[k].reqSigs = s.reqSigs;
      }
    } else {
      this.vOut[k].scriptPubKey = A.scriptPubKey.hex();
      if (this.data === null && s.nType === 3) this.data = s.data.hex();

      if (![3, 4, 7, 8].includes(s.nType)) {
        this.vOut[k].addressHash = s.addressHash.hex();
        this.vOut[k].reqSigs = s.reqSigs;
      }

      this.vOut[k].scriptPubKeyOpcodes = S.decodeScript(A.scriptPubKey);
      this.vOut[k].scriptPubKeyAsm = S.decodeScript(A.scriptPubKey, {
        "asm": true
      });
      var sh = [1, 5].includes(s.nType);
      var witnessVersion = s.nType < 5 ? null : A.scriptPubKey[0];
      if (this.vOut[k].addressHash !== undefined) this.vOut[k].address = S.hashToAddress(this.vOut[k].addressHash, {
        testnet: this.testnet,
        scriptHash: sh,
        witnessVersion: witnessVersion
      });
    }

    if (this.autoCommit) this.commit();
    return this;
  };

  Transaction.prototype.delOutput = function (n) {
    var l = Object.keys(this.vOut).length;
    if (l === 0) return this;
    if (n === undefined) n = l - 1;
    var out = {};
    var c = 0;

    for (var i = 0; i < l; i++) {
      if (i !== n) {
        out[c] = this.vOut[i];
        c++;
      }
    }

    this.vOut = out;
    if (this.autoCommit) this.commit();
    return this;
  };

  Transaction.prototype.delInput = function (n) {
    var l = Object.keys(this.vIn).length;
    if (l === 0) return this;
    if (n === undefined) n = l - 1;
    var out = {};
    var c = 0;

    for (var i = 0; i < l; i++) {
      if (i !== n) {
        out[c] = this.vIn[i];
        c++;
      }
    }

    this.vOut = out;
    if (this.autoCommit) this.commit();
    return this;
  };

  Transaction.prototype.commit = function () {
    if (Object.keys(this.vIn).length === 0 || Object.keys(this.vOut).length === 0) return this;
    if (this.segwit) for (var i in this.vIn) {
      if (this.vIn[i].txInWitness === undefined) this.vIn[i].txInWitness = [];
    }
    var nonSegwitView = this.serialize({
      segwit: false,
      hex: false
    });
    this.txId = S.sha256(nonSegwitView);
    this.rawTx = this.serialize({
      segwit: true,
      hex: false
    });
    this.hash = S.sha256(this.rawTx);
    this.size = this.rawTx.length;
    this.bSize = nonSegwitView.length;
    this.weight = this.bSize * 3 + this.size;
    this.vSize = Math.ceil(this.weight / 4);

    if (this.format !== 'raw') {
      this.txId = rh2s(this.txId);
      this.hash = rh2s(this.hash);
      this.rawTx = this.rawTx.hex();
    }

    var inputSum = 0;
    var outputSum = 0;

    for (var _i5 in this.vIn) {
      if (this.vIn[_i5].value !== undefined) inputSum += this.vIn[_i5].value;else {
        inputSum = null;
        break;
      }

      for (var _i6 in this.vOut) {
        if (this.vOut[_i6].value !== undefined) outputSum += this.vOut[_i6].value;
      }
    }

    this.amount = outputSum;
    if (outputSum && inputSum) this.fee = inputSum - outputSum;else this.fee = null;
    return this;
  };

  Transaction.prototype.sigHash = function (n) {
    var A = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    ARGS(A, {
      scriptPubKey: null,
      sigHashType: S.SIGHASH_ALL,
      preImage: false
    });
    if (this.vIn[n] === undefined) throw new Error("input not exist");
    var scriptCode;
    if (A.scriptPubKey !== null) scriptCode = A.scriptPubKey;else {
      if (this.vIn[n].scriptPubKey === undefined) throw new Error("scriptPubKey required");
      scriptCode = this.vIn[n].scriptPubKey;
    }
    scriptCode = getBuffer(scriptCode);

    if ((A.sigHashType & 31) === S.SIGHASH_SINGLE && n >= Object.keys(this.vOut).length) {
      var r = BC([BF([1]), BA(31)]);
      return this.format === 'raw' ? r : rh2s(r);
    }

    scriptCode = S.deleteFromScript(scriptCode, BF([O.OP_CODESEPARATOR]));
    var pm = [BF(S.intToBytes(this.version, 4))];
    pm.push(A.sigHashType & S.SIGHASH_ANYONECANPAY ? BF([1]) : BF(S.intToVarInt(Object.keys(this.vIn).length)));

    for (var i in this.vIn) {
      i = parseInt(i);
      if (A.sigHashType & S.SIGHASH_ANYONECANPAY && n !== i) continue;
      var sequence = this.vIn[i].sequence;
      if ([S.SIGHASH_SINGLE, S.SIGHASH_NONE].includes(A.sigHashType & 31) && n !== i) sequence = 0;
      var txId = iS(this.vIn[i].txId) ? s2rh(this.vIn[i].txId) : this.vIn[i].txId;
      pm.push(txId);
      pm.push(BF(S.intToBytes(this.vIn[i].vOut, 4)));

      if (n === i) {
        pm.push(BF(S.intToVarInt(scriptCode.length)));
        pm.push(scriptCode);
        pm.push(BF(S.intToBytes(sequence, 4)));
      } else {
        pm.push(BF([0]));
        pm.push(BF(S.intToBytes(sequence, 4)));
      }
    }

    if ((A.sigHashType & 31) === S.SIGHASH_NONE) pm.push(BF([0]));else if ((A.sigHashType & 31) === S.SIGHASH_SINGLE) pm.push(BF(S.intToVarInt(n + 1)));else pm.push(BF(S.intToVarInt(Object.keys(this.vOut).length)));
    var scriptPubKey;

    if ((A.sigHashType & 31) !== S.SIGHASH_NONE) {
      for (var _i7 in this.vOut) {
        _i7 = parseInt(_i7);
        scriptPubKey = this.vOut[_i7].scriptPubKey;
        scriptPubKey = iS(scriptPubKey) ? BF(scriptPubKey, 'hex') : scriptPubKey;
        if (_i7 > n && (A.sigHashType & 31) === S.SIGHASH_SINGLE) continue;

        if ((A.sigHashType & 31) === S.SIGHASH_SINGLE && n !== _i7) {
          pm.push(BA(8, 0xff));
          pm.push(BA(1, 0x00));
        } else {
          pm.push(BF(S.intToBytes(this.vOut[_i7].value, 8)));
          pm.push(BF(S.intToVarInt(scriptPubKey.length)));
          pm.push(scriptPubKey);
        }
      }
    }

    pm.push(BF(S.intToBytes(this.lockTime, 4)));
    pm.push(BF(S.intToBytes(A.sigHashType, 4)));
    pm = BC(pm);

    if (!A.preImage) {
      pm = S.doubleSha256(pm);
      return this.format === 'raw' ? pm : rh2s(pm);
    }

    return this.format === 'raw' ? pm : pm.hex();
  };

  Transaction.prototype.sigHashSegwit = function (n) {
    var A = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    ARGS(A, {
      value: null,
      scriptPubKey: null,
      sigHashType: S.SIGHASH_ALL,
      preImage: false
    });
    if (this.vIn[n] === undefined) throw new Error("input not exist");
    var scriptCode, value;
    if (A.scriptPubKey !== null) scriptCode = A.scriptPubKey;else {
      if (this.vIn[n].scriptPubKey === undefined) throw new Error("scriptPubKey required");
      scriptCode = this.vIn[n].scriptPubKey;
    }
    scriptCode = getBuffer(scriptCode);
    if (A.value !== null) value = A.value;else {
      if (this.vIn[n].value === undefined) throw new Error("value required");
      value = this.vIn[n].value;
    }
    var hp = [],
        hs = [],
        ho = [],
        outpoint,
        nSequence;

    for (var i in this.vIn) {
      i = parseInt(i);
      var txId = this.vIn[i].txId;
      if (iS(txId)) txId = s2rh(txId);
      var vOut = BF(S.intToBytes(this.vIn[i].vOut, 4));

      if (!(A.sigHashType & S.SIGHASH_ANYONECANPAY)) {
        hp.push(txId);
        hp.push(vOut);
        if ((A.sigHashType & 31) !== S.SIGHASH_SINGLE && (A.sigHashType & 31) !== S.SIGHASH_NONE) hs.push(BF(S.intToBytes(this.vIn[i].sequence, 4)));
      }

      if (i === n) {
        outpoint = BC([txId, vOut]);
        nSequence = BF(S.intToBytes(this.vIn[i].sequence, 4));
      }
    } // https://github.com/wu-emma/bitgesell/blob/cb9f0da214f38691b0a4947fd9f9c4ff9a647f43/src/script/interpreter.cpp#L1186


    var hashPrevouts = hp.length > 0 ? S.sha3(BC(hp)) : BA(32, 0); // https://github.com/wu-emma/bitgesell/blob/cb9f0da214f38691b0a4947fd9f9c4ff9a647f43/src/script/interpreter.cpp#L1196

    var hashSequence = hs.length > 0 ? S.sha3(BC(hs)) : BA(32, 0);
    value = BF(S.intToBytes(value, 8));

    for (var o in this.vOut) {
      o = parseInt(o);
      var scriptPubKey = getBuffer(this.vOut[o].scriptPubKey);

      if (![S.SIGHASH_SINGLE, S.SIGHASH_NONE].includes(A.sigHashType & 31)) {
        ho.push(BF(S.intToBytes(this.vOut[o].value, 8)));
        ho.push(BF(S.intToVarInt(scriptPubKey.length)));
        ho.push(scriptPubKey);
      } else if ((A.sigHashType & 31) === S.SIGHASH_SINGLE && n < Object.keys(this.vOut).length) {
        if (o === n) {
          ho.push(BF(S.intToBytes(this.vOut[o].value, 8)));
          ho.push(BF(S.intToVarInt(scriptPubKey.length)));
          ho.push(scriptPubKey);
        }
      }
    } // https://github.com/wu-emma/bitgesell/blob/cb9f0da214f38691b0a4947fd9f9c4ff9a647f43/src/script/interpreter.cpp#L1206


    var hashOutputs = ho.length > 0 ? S.sha3(BC(ho)) : BA(32, 0);
    var pm = BC([BF(S.intToBytes(this.version, 4)), hashPrevouts, hashSequence, outpoint, scriptCode, value, nSequence, hashOutputs, BF(S.intToBytes(this.lockTime, 4)), BF(S.intToBytes(A.sigHashType, 4))]);
    if (A.preImage) return this.format === 'raw' ? pm.hex() : pm; // https://github.com/wu-emma/bitgesell/blob/cb9f0da214f38691b0a4947fd9f9c4ff9a647f43/src/hash.h#L180
    // https://github.com/wu-emma/bitgesell/blob/cb9f0da214f38691b0a4947fd9f9c4ff9a647f43/src/script/interpreter.cpp#L1281

    return S.sha3(pm, {
      'hex': this.format !== 'raw'
    });
  };

  Transaction.prototype.signInput = function (n) {
    var A = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    ARGS(A, {
      privateKey: null,
      scriptPubKey: null,
      redeemScript: null,
      sigHashType: S.SIGHASH_ALL,
      address: null,
      value: null,
      witnessVersion: 0,
      p2sh_p2wsh: false
    });
    if (this.vIn[n] === undefined) throw new Error('input not exist'); // privateKey

    if (A.privateKey === null) {
      if (this.vIn[n].privateKey === undefined) throw new Error('no private key');
      A.privateKey = this.vIn[n].privateKey;
    }

    if (A.privateKey instanceof Array) {
      A.publicKey = [];
      var pk = [];

      var _iterator5 = _createForOfIteratorHelper(A.privateKey),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var key = _step5.value;
          if (key.key !== undefined) key = key.wif;
          A.publicKey.push(S.privateToPublicKey(key, {
            hex: false
          }));
          pk.push(new S.PrivateKey(key).key);
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }

      A.privateKey = pk;
    } else {
      if (A.privateKey.key === undefined) {
        var k = new S.PrivateKey(A.privateKey);
        A.privateKey = k.key;
        A.privateKeyCompressed = k.compressed;
      } else {
        A.privateKeyCompressed = A.privateKey.compressed;
        A.privateKey = A.privateKey.key;
      }

      A.publicKey = [S.privateToPublicKey(A.privateKey, {
        hex: false,
        compressed: A.privateKeyCompressed
      })];
      A.privateKey = [A.privateKey];
    } // address


    if (A.address === null && this.vIn[n].address !== undefined) A.address = this.vIn[n].address;

    if (A.address !== null) {
      if (A.address.address !== undefined) A.address = A.address.address;
      if (this.testnet !== (S.addressNetType(A.address) === 'testnet')) throw new Error('address network invalid');
      A.scriptPubKey = S.addressToScript(A.address);
    }

    var scriptType = null; // redeem script

    if (A.redeemScript === null && this.vIn[n].redeemScript !== undefined) A.redeemScript = this.vIn[n].redeemScript;
    if (A.redeemScript !== null) A.redeemScript = getBuffer(A.redeemScript); // script pub key

    if (A.scriptPubKey === null && this.vIn[n].scriptPubKey !== undefined) A.scriptPubKey = this.vIn[n].scriptPubKey;else if (A.scriptPubKey === null && A.redeemScript === null) throw new Error('no scriptPubKey key');

    if (A.scriptPubKey !== null) {
      A.scriptPubKey = getBuffer(A.scriptPubKey);
      var p = S.parseScript(A.scriptPubKey);
      scriptType = p.type;
      if ([5, 6].includes(p.nType)) A.witnessVersion = A.scriptPubKey[0];
    } else if (A.redeemScript !== null) {
      if (A.witnessVersion === null || A.p2sh_p2wsh) scriptType = "P2SH";else scriptType = "P2WSH";
    } // sign input


    var sigSript;

    switch (scriptType) {
      case 'PUBKEY':
        sigSript = this.__sign_PUBKEY(n, A);
        break;

      case 'P2PKH':
        sigSript = this.__sign_P2PKH(n, A);
        break;

      case 'P2SH':
        sigSript = this.__sign_P2SH(n, A);
        break;

      case 'P2WPKH':
        sigSript = this.__sign_P2WPKH(n, A);
        break;

      case 'P2WSH':
        sigSript = this.__sign_P2WSH(n, A);
        break;

      case 'MULTISIG':
        sigSript = this.__sign_MULTISIG(n, A);
        break;

      default:
        throw new Error('not implemented');
    }

    if (this.format === 'raw') this.vIn[n].scriptSig = sigSript;else {
      this.vIn[n].scriptSig = sigSript.hex();
      this.vIn[n].scriptSigOpcodes = S.decodeScript(sigSript);
      this.vIn[n].scriptSigAsm = S.decodeScript(sigSript, {
        asm: true
      });
    }
    if (this.autoCommit) this.commit();
    return this;
  };

  Transaction.prototype.__sign_PUBKEY = function (n, A) {
    var sighash = this.sigHash(n, A);
    if (iS(sighash)) sighash = s2rh(sighash);
    var signature = BC([S.signMessage(sighash, A.privateKey[0]).signature, BF(S.intToBytes(A.sigHashType, 1))]);
    if (this.format === 'raw') this.vIn[n].signatures = [signature];else this.vIn[n].signatures = [signature.hex()];
    return BC([BF([signature.length]), signature]);
  };

  Transaction.prototype.__sign_P2PKH = function (n, A) {
    var sighash = this.sigHash(n, A);
    if (iS(sighash)) sighash = s2rh(sighash);
    var signature = BC([S.signMessage(sighash, A.privateKey[0]).signature, BF(S.intToBytes(A.sigHashType, 1))]);
    if (this.format === 'raw') this.vIn[n].signatures = [signature];else this.vIn[n].signatures = [signature.hex()];
    return BC([BF([signature.length]), signature, BF([A.publicKey[0].length]), A.publicKey[0]]);
  };

  Transaction.prototype.__sign_P2SH = function (n, A) {
    if (A.redeemScript === null) throw new Error('no redeem script');
    if (A.p2sh_p2wsh) return this.__sign_P2SH_P2WSH(n, A);
    var scriptType = S.parseScript(A.redeemScript)["type"];

    switch (scriptType) {
      case 'MULTISIG':
        return this.__sign_P2SH_MULTISIG(n, A);

      case 'P2WPKH':
        return this.__sign_P2SH_P2WPKH(n, A);

      default:
        throw new Error('not implemented');
    }
  };

  Transaction.prototype.__sign_P2SH_MULTISIG = function (n, A) {
    var sighash = this.sigHash(n, {
      scriptPubKey: A.redeemScript,
      sigHashType: A.sigHashType
    });
    if (iS(sighash)) sighash = s2rh(sighash);
    var sig = [];
    this.vIn[n].signatures = [];

    var _iterator6 = _createForOfIteratorHelper(A.privateKey),
        _step6;

    try {
      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        var key = _step6.value;
        var s = BC([S.signMessage(sighash, key).signature, BF(S.intToBytes(A.sigHashType, 1))]);
        sig.push(s);
        this.vIn[n].signatures.push(this.format === 'raw' ? s : s.hex());
      }
    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
    }

    return this.__get_MULTISIG_scriptSig(n, A.publicKey, sig, A.redeemScript, A.redeemScript);
  };

  Transaction.prototype.__sign_P2SH_P2WPKH = function (n, A) {
    var s = BC([BF([0x19]), BF([O.OP_DUP, O.OP_HASH160]), S.opPushData(S.hash160(A.publicKey[0])), BF([O.OP_EQUALVERIFY, O.OP_CHECKSIG])]);

    if (A.value === null) {
      if (this.vIn[n].value !== undefined) A.value = this.vIn[n].value;else throw new Error('no input amount');
    }

    var sighash = this.sigHashSegwit(n, {
      scriptPubKey: s,
      sigHashType: A.sigHashType,
      value: A.value
    });
    sighash = getBuffer(sighash);
    var signature = BC([S.signMessage(sighash, A.privateKey[0]).signature, BF(S.intToBytes(A.sigHashType, 1))]);
    this.segwit = true;
    if (this.format === 'raw') this.vIn[n].txInWitness = [signature, A.publicKey[0]];else this.vIn[n].txInWitness = [signature.hex(), A.publicKey[0].hex()];
    this.vIn[n].signatures = this.format === 'raw' ? [signature] : [signature.hex()];
    return S.opPushData(A.redeemScript);
  };

  Transaction.prototype.__sign_P2SH_P2WSH = function (n, A) {
    var scriptType = S.parseScript(A.redeemScript)["type"];

    switch (scriptType) {
      case 'MULTISIG':
        return this.__sign_P2SH_P2WSH_MULTISIG(n, A);

      default:
        throw new Error('not implemented');
    }
  };

  Transaction.prototype.__sign_P2SH_P2WSH_MULTISIG = function (n, A) {
    this.segwit = true;
    var scriptCode = BC([BF(S.intToVarInt(A.redeemScript.length)), A.redeemScript]);
    var sighash = this.sigHashSegwit(n, {
      scriptPubKey: scriptCode,
      sigHashType: A.sigHashType,
      value: A.value
    });
    sighash = getBuffer(sighash);
    this.vIn[n].signatures = [];
    var sig = [];

    var _iterator7 = _createForOfIteratorHelper(A.privateKey),
        _step7;

    try {
      for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
        var key = _step7.value;
        var s = BC([S.signMessage(sighash, key).signature, BF(S.intToBytes(A.sigHashType, 1))]);
        sig.push(s);
        this.vIn[n].signatures.push(this.format === 'raw' ? s : s.hex());
      }
    } catch (err) {
      _iterator7.e(err);
    } finally {
      _iterator7.f();
    }

    var witness = this.__get_MULTISIG_scriptSig(n, A.publicKey, sig, scriptCode, A.redeemScript, A.value);

    if (this.format === 'raw') this.vIn[n].txInWitness = witness;else {
      this.vIn[n].txInWitness = [];

      var _iterator8 = _createForOfIteratorHelper(witness),
          _step8;

      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var w = _step8.value;
          this.vIn[n].txInWitness.push(w.hex());
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }
    } // calculate P2SH redeem script from P2WSH redeem script

    return S.opPushData(BC([BF([0]), S.opPushData(S.sha256(A.redeemScript))]));
  };

  Transaction.prototype.__sign_P2WPKH = function (n, A) {
    var s = BC([BF([0x19]), BF([O.OP_DUP, O.OP_HASH160]), A.scriptPubKey.slice(1), BF([O.OP_EQUALVERIFY, O.OP_CHECKSIG])]);

    if (A.value === null) {
      if (this.vIn[n].value !== undefined) A.value = this.vIn[n].value;else throw new Error('no input amount');
    }

    var sighash = this.sigHashSegwit(n, {
      scriptPubKey: s,
      sigHashType: A.sigHashType,
      value: A.value
    });
    sighash = getBuffer(sighash);
    var signature = BC([S.signMessage(sighash, A.privateKey[0]).signature, BF(S.intToBytes(A.sigHashType, 1))]);
    this.segwit = true;
    if (this.format === 'raw') this.vIn[n].txInWitness = [signature, A.publicKey[0]];else this.vIn[n].txInWitness = [signature.hex(), A.publicKey[0].hex()];
    this.vIn[n].signatures = this.format === 'raw' ? [signature] : [signature.hex()];
    return BF([]);
  };

  Transaction.prototype.__sign_P2WSH = function (n, A) {
    this.segwit = true;

    if (A.value === null) {
      if (this.vIn[n].value !== undefined) A.value = this.vIn[n].value;else throw new Error('no input amount');
    }

    var scriptType = S.parseScript(A.redeemScript)["type"];

    switch (scriptType) {
      case 'MULTISIG':
        return this.__sign_P2WSH_MULTISIG(n, A);

      default:
        throw new Error('not implemented');
    }
  };

  Transaction.prototype.__sign_P2WSH_MULTISIG = function (n, A) {
    var scriptCode = BC([BF(S.intToVarInt(A.redeemScript.length)), A.redeemScript]);
    var sighash = this.sigHashSegwit(n, {
      scriptPubKey: scriptCode,
      sigHashType: A.sigHashType,
      value: A.value
    });
    sighash = getBuffer(sighash);
    var sig = [];
    this.vIn[n].signatures = [];

    var _iterator9 = _createForOfIteratorHelper(A.privateKey),
        _step9;

    try {
      for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
        var key = _step9.value;
        var s = BC([S.signMessage(sighash, key).signature, BF(S.intToBytes(A.sigHashType, 1))]);
        sig.push(s);
        this.vIn[n].signatures.push(this.format === 'raw' ? s : s.hex());
      }
    } catch (err) {
      _iterator9.e(err);
    } finally {
      _iterator9.f();
    }

    var witness = this.__get_MULTISIG_scriptSig(n, A.publicKey, sig, scriptCode, A.redeemScript, A.value);

    if (this.format === 'raw') this.vIn[n].txInWitness = witness;else {
      this.vIn[n].txInWitness = [];

      var _iterator10 = _createForOfIteratorHelper(witness),
          _step10;

      try {
        for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
          var w = _step10.value;
          this.vIn[n].txInWitness.push(w.hex());
        }
      } catch (err) {
        _iterator10.e(err);
      } finally {
        _iterator10.f();
      }
    }
    return BF([]);
  };

  Transaction.prototype.__sign_MULTISIG = function (n, A) {
    var sighash = this.sigHash(n, {
      scriptPubKey: A.scriptPubKey,
      sigHashType: A.sigHashType
    });
    if (iS(sighash)) sighash = s2rh(sighash);
    var sig = [];
    this.vIn[n].signatures = [];

    var _iterator11 = _createForOfIteratorHelper(A.privateKey),
        _step11;

    try {
      for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
        var key = _step11.value;
        var s = BC([S.signMessage(sighash, key).signature, BF(S.intToBytes(A.sigHashType, 1))]);
        sig.push(s);
        this.vIn[n].signatures.push(this.format === 'raw' ? s : s.hex());
      }
    } catch (err) {
      _iterator11.e(err);
    } finally {
      _iterator11.f();
    }

    return this.__get_bare_multisig_script_sig__(n, A.publicKey, sig, A.scriptPubKey);
  };

  Transaction.prototype.__get_bare_multisig_script_sig__ = function (n, publicKeys, signatures, scriptPubKey) {
    var sigMap = {};

    for (var i in publicKeys) {
      sigMap[publicKeys[i]] = signatures[i];
    }

    scriptPubKey.seek(0);
    var pubKeys = S.getMultiSigPublicKeys(scriptPubKey);
    var s = getBuffer(this.vIn[n].scriptSig);
    s.seek(0);
    var r = S.readOpCode(s);

    while (r[0] !== null) {
      r = S.readOpCode(s);

      if (r[1] !== null && S.isValidSignatureEncoding(r[1])) {
        var sigHash = this.sigHash(n, {
          scriptPubKey: scriptPubKey,
          sigHashType: r[1][r[1].length - 1]
        });
        if (iS(sigHash)) sigHash = s2rh(sigHash);

        for (var _i8 = 0; _i8 < 4; _i8++) {
          var pk = S.publicKeyRecovery(r[1].slice(0, r[1].length - 1), sigHash, _i8, {
            hex: false
          });
          if (pk === null) continue;

          var _iterator12 = _createForOfIteratorHelper(pubKeys),
              _step12;

          try {
            for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
              var p = _step12.value;

              if (pk.equals(p)) {
                sigMap[pk] = r[1];
                break;
              }
            }
          } catch (err) {
            _iterator12.e(err);
          } finally {
            _iterator12.f();
          }
        }
      }
    }

    r = [BF([O.OP_0])];

    var _iterator13 = _createForOfIteratorHelper(pubKeys),
        _step13;

    try {
      for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
        var _p = _step13.value;
        if (sigMap[_p] !== undefined) r.push(S.opPushData(sigMap[_p]));
      }
    } catch (err) {
      _iterator13.e(err);
    } finally {
      _iterator13.f();
    }

    return BC(r);
  };

  Transaction.prototype.__get_MULTISIG_scriptSig = function (n, publicKeys, signatures, scriptCode, redeemScript) {
    var value = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
    var sigMap = {};

    for (var i in publicKeys) {
      sigMap[publicKeys[i]] = signatures[i];
    }

    redeemScript.seek(0);
    var pubKeys = S.getMultiSigPublicKeys(redeemScript);
    var p2wsh = value !== null;

    if (!p2wsh) {
      var s = getBuffer(this.vIn[n].scriptSig);
      s.seek(0);

      var _r = S.readOpCode(s);

      while (_r[0] !== null) {
        _r = S.readOpCode(s);

        if (_r[1] !== null && S.isValidSignatureEncoding(_r[1])) {
          var sigHash = this.sigHash(n, {
            scriptPubKey: scriptCode,
            sigHashType: _r[1][_r[1].length - 1]
          });
          if (iS(sigHash)) sigHash = s2rh(sigHash);

          for (var _i9 = 0; _i9 < 4; _i9++) {
            var pk = S.publicKeyRecovery(_r[1].slice(0, _r[1].length - 1), sigHash, _i9, {
              hex: false
            });
            if (pk === null) continue;

            var _iterator14 = _createForOfIteratorHelper(pubKeys),
                _step14;

            try {
              for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
                var p = _step14.value;

                if (pk.equals(p)) {
                  sigMap[pk] = _r[1];
                  break;
                }
              }
            } catch (err) {
              _iterator14.e(err);
            } finally {
              _iterator14.f();
            }
          }
        }
      }

      _r = [BF([O.OP_0])];

      var _iterator15 = _createForOfIteratorHelper(pubKeys),
          _step15;

      try {
        for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
          var _p2 = _step15.value;
          if (sigMap[_p2] !== undefined) _r.push(S.opPushData(sigMap[_p2]));
        }
      } catch (err) {
        _iterator15.e(err);
      } finally {
        _iterator15.f();
      }

      _r.push(S.opPushData(redeemScript));

      return BC(_r);
    }

    if (this.vIn[n].txInWitness !== undefined) {
      var _iterator16 = _createForOfIteratorHelper(this.vIn[n].txInWitness),
          _step16;

      try {
        for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
          var w = _step16.value;
          w = getBuffer(w);

          if (w.length > 0 && S.isValidSignatureEncoding(w)) {
            var _sigHash = this.sigHashSegwit(n, {
              scriptPubKey: scriptCode,
              sigHashType: w[w.length - 1],
              value: value
            });

            _sigHash = getBuffer(_sigHash);

            for (var _i10 = 0; _i10 < 4; _i10++) {
              var _pk = S.publicKeyRecovery(w.slice(0, w.length - 1), _sigHash, _i10, {
                hex: false
              });

              if (_pk === null) continue;

              var _iterator17 = _createForOfIteratorHelper(pubKeys),
                  _step17;

              try {
                for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
                  var _p3 = _step17.value;

                  if (_pk.equals(_p3)) {
                    sigMap[_pk] = w;
                    break;
                  }
                }
              } catch (err) {
                _iterator17.e(err);
              } finally {
                _iterator17.f();
              }
            }
          }
        }
      } catch (err) {
        _iterator16.e(err);
      } finally {
        _iterator16.f();
      }
    }

    var r = [BF([])];

    var _iterator18 = _createForOfIteratorHelper(pubKeys),
        _step18;

    try {
      for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
        var _p4 = _step18.value;
        if (sigMap[_p4] !== undefined) r.push(sigMap[_p4]);
      }
    } catch (err) {
      _iterator18.e(err);
    } finally {
      _iterator18.f();
    }

    r.push(redeemScript);
    return r;
  };

  S.Transaction = Transaction;
};