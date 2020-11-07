"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

module.exports = function (S) {
  var Buffer = S.Buffer;
  var defArgs = S.defArgs;
  var getBuffer = S.getBuffer;
  var BF = Buffer.from;
  var BC = Buffer.concat;
  var O = S.OPCODE;
  var ARGS = S.defArgs;

  var Wallet = function Wallet() {
    var A = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2["default"])(this, Wallet);
    ARGS(A, {
      from: null,
      passphrase: "",
      path: null,
      testnet: false,
      strength: 256,
      threshold: 1,
      shares: 1,
      wordList: S.BIP39_WORDLIST,
      addressType: null,
      hardenedAddresses: false,
      account: 0,
      chain: 0
    });
    this.account = A.account;
    this.chain = A.chain;
    this.hardenedAddresses = A.hardenedAddresses;

    if (A.path === "BIP84") {
      this.pathType = "BIP84";
      this.path = "m/84'/0'/".concat(this.account, "'/").concat(this.chain);
      this.__account_path = "m/84'/0'/".concat(this.account, "'");
    } else if (A.path === "BIP49") {
      this.pathType = "BIP49";
      this.path = "m/49'/0'/".concat(this.account, "'/").concat(this.chain);
      this.__account_path = "m/49'/0'/".concat(this.account, "'");
    } else if (A.path === "BIP44") {
      this.pathType = "BIP44";
      this.path = "m/44'/0'/".concat(this.account, "'/").concat(this.chain);
      this.__account_path = "m/44'/0'/".concat(this.account, "'");
    } else if (A.path !== null) {
      this.pathType = "custom";
      this.path = A.path;
    } else {
      this.pathType = null;
      this.path = null;
    }

    var from = A.from;
    this.from = from;
    var fromType = null;

    if (from === null) {
      var e = S.generateEntropy({
        strength: A.strength
      });
      this.mnemonic = S.entropyToMnemonic(e, {
        wordList: A.wordList
      });
      this.seed = S.mnemonicToSeed(this.mnemonic, {
        hex: true,
        wordList: A.wordList,
        passphrase: A.passphrase
      });
      this.passphrase = A.passphrase;
      from = S.createMasterXPrivateKey(this.seed, {
        testnet: A.testnet
      });

      if (this.pathType === null) {
        this.pathType = "BIP84";
        this.path = "m/84'/0'/".concat(this.account, "'/").concat(this.chain);
        this.__account_path = "m/84'/0'/".concat(this.account, "'");
      }

      if (this.pathType !== null && this.pathType !== "custom") from = S.BIP32_XKeyToPathXKey(from, this.pathType);
      fromType = "xPriv";
    } else if (S.isString(from)) {
      if (S.isXPrivateKeyValid(from)) {
        if (this.pathType === null) {
          this.pathType = S.xKeyDerivationType(from);

          if (this.pathType === "BIP84") {
            this.path = "m/84'/0'/".concat(this.account, "'/").concat(this.chain);
            this.__account_path = "m/84'/0'/".concat(this.account, "'");
          } else if (this.pathType === "BIP49") {
            this.path = "m/49'/0'/".concat(this.account, "'/").concat(this.chain);
            this.__account_path = "m/49'/0'/".concat(this.account, "'");
          } else if (this.pathType === "BIP44") {
            this.path = "m/44'/0'/".concat(this.account, "'/").concat(this.chain);
            this.__account_path = "m/44'/0'/".concat(this.account, "'");
          } else {
            this.path = "m";
          }
        }

        if (this.pathType !== null && this.pathType !== 'custom') from = S.BIP32_XKeyToPathXKey(S.pathXKeyTo_BIP32_XKey(from), this.pathType);
        fromType = "xPriv";
      } else if (S.isXPublicKeyValid(from)) {
        if (this.pathType === null) {
          this.pathType = S.xKeyDerivationType(from);

          if (this.pathType === "BIP84") {
            this.path = "m/84'/0'/".concat(this.account, "'/").concat(this.chain);
            this.__account_path = "m/84'/0'/".concat(this.account, "'");
          } else if (this.pathType === "BIP49") {
            this.path = "m/49'/0'/".concat(this.account, "'/").concat(this.chain);
            this.__account_path = "m/49'/0'/".concat(this.account, "'");
          } else if (this.pathType === "BIP44") {
            this.path = "m/44'/0'/".concat(this.account, "'/").concat(this.chain);
            this.__account_path = "m/44'/0'/".concat(this.account, "'");
          } else {
            this.path = "m";
          }
        }

        if (this.pathType !== "custom") {
          from = S.BIP32_XKeyToPathXKey(S.pathXKeyTo_BIP32_XKey(from), this.pathType);
          fromType = "xPub";
          if (this.depth === 3) this.__path = "";
        }
      } else {
        if (!S.isMnemonicValid(from, {
          wordList: A.BIP39_WORDLIST
        })) throw new Error("invalid mnemonic");
        this.mnemonic = from;
        this.seed = S.mnemonicToSeed(this.mnemonic, {
          hex: true,
          wordList: A.wordList,
          passphrase: A.passphrase
        });
        this.passphrase = A.passphrase;
        from = S.createMasterXPrivateKey(this.seed, {
          testnet: A.testnet
        });

        if (this.pathType === null) {
          this.pathType = "BIP84";
          this.path = "m/84'/0'/".concat(this.account, "'/").concat(this.chain);
          this.__account_path = "m/84'/0'/".concat(this.account, "'");
        }

        if (this.pathType !== null && this.pathType !== "custom") from = S.BIP32_XKeyToPathXKey(from, this.pathType);
        fromType = "xPriv";
      }
    } else throw new Error("invalid initial data");

    var rawFrom = S.decodeBase58(from, {
      checkSum: true,
      hex: false
    });
    this.testnet = S.xKeyNetworkType(rawFrom) === 'testnet';
    this.version = rawFrom.slice(0, 4).hex();
    this.depth = rawFrom[4];

    if (this.pathType !== "custom") {
      if (this.depth === 0 || this.depth === 3) {
        var l = this.path.split('/');
        this.__path = l.slice(this.depth, 4).join('/');
      } else {
        this.pathType = 'custom';
        this.path = "m";
      }
    }

    this.fingerprint = rawFrom.slice(5, 9).hex();
    this.child = rawFrom.readUIntBE(9, 4);
    this.chainCode = rawFrom.slice(9, 4).hex();

    if (fromType === "xPriv") {
      if (this.depth === 0) this.masterXPrivateKey = from;

      if (this.pathType !== "custom") {
        this.accountXPrivateKey = S.deriveXKey(from, this.__path, {
          subPath: true
        });
        this.accountXPublicKey = S.xPrivateToXPublicKey(this.accountXPrivateKey);
        this.accountXPrivateKey = S.deriveXKey(from, this.__path, {
          subPath: true
        });
        this.accountXPublicKey = S.xPrivateToXPublicKey(this.accountXPrivateKey);
        this.externalChainXPrivateKey = S.deriveXKey(from, this.__path + "/".concat(this.chain), {
          subPath: true
        });
        this.externalChainXPublicKey = S.xPrivateToXPublicKey(this.externalChainXPrivateKey);
        this.internalChainXPrivateKey = S.deriveXKey(from, this.__path + "/".concat(this.chain + 1), {
          subPath: true
        });
        this.internalChainXPublicKey = S.xPrivateToXPublicKey(this.internalChainXPrivateKey);
      } else {
        this.chainXPrivateKey = S.deriveXKey(from, this.path);
        this.chainXPublicKey = S.xPrivateToXPublicKey(this.chainXPrivateKey);
      }
    } else {
      if (this.pathType !== "custom") {
        this.accountXPublicKey = from;
        this.externalChainXPublicKey = S.deriveXKey(from, this.__path + "/".concat(this.chain), {
          subPath: true
        });
        this.internalChainXPrivateKey = S.deriveXKey(from, this.__path + "/".concat(this.chain + 1), {
          subPath: true
        });
      } else {
        this.chainXPublicKey = S.deriveXKey(from, this.path);
      }
    }

    if (this.mnemonic !== null) {
      this.sharesThreshold = A.threshold;
      this.sharesTotal = A.shares;
      if (this.sharesThreshold > this.sharesTotal) throw new Error("Threshold invalid");

      if (this.sharesTotal > 1) {
        var m = this.mnemonic.trim().split(/\s+/);
        var bitSize = m.length * 11;
        var checkSumBitLen = bitSize % 32;
        if (this.sharesTotal > Math.pow(2, checkSumBitLen) - 1) throw new Error("Maximum ".concat(Math.pow(2, checkSumBitLen) - 1, " shares allowed for ").concat(m.length, " mnemonic words"));
        this.mnemonicShares = S.splitMnemonic(A.threshold, A.shares, this.mnemonic, {
          wordList: A.BIP39_WORDLIST,
          embeddedIndex: true
        });
      }
    }

    if (A.addressType !== null) this.addressType = A.addressType;else {
      if (this.pathType === "BIP84") this.addressType = "P2WPKH";else if (this.pathType === "BIP49") this.addressType = "P2SH_P2WPKH";else this.addressType = "P2PKH";
    }
  };

  Wallet.prototype.setChain = function (i) {
    this.chain = i;
  };

  Wallet.prototype.getAddress = function (i) {
    var external = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var r = {};
    var h = this.hardenedAddresses ? "'" : "";

    if (this.pathType !== 'custom') {
      var p = "m/" + i + h;
      r.path = "".concat(this.__account_path, "/").concat(this.chain + !external, "/").concat(i).concat(h);

      if (external) {
        if (this.externalChainXPrivateKey !== undefined) {
          var key = S.deriveXKey(this.externalChainXPrivateKey, p);
          r.privateKey = S.privateFromXPrivateKey(key);
          r.publicKey = S.privateToPublicKey(r.privateKey);
        } else {
          var _key = S.deriveXKey(this.externalChainXPublicKey, p);

          r.publicKey = S.publicFromXPublicKey(_key);
        }
      } else {
        if (this.internalChainXPrivateKey !== undefined) {
          var _key2 = S.deriveXKey(this.internalChainXPrivateKey, p);

          r.privateKey = S.privateFromXPrivateKey(_key2);
          r.publicKey = S.privateToPublicKey(r.privateKey);
        } else {
          var _key3 = S.deriveXKey(this.internalChainXPublicKey, p);

          r.publicKey = S.publicFromXPublicKey(_key3);
        }
      }
    } else {
      var _p = "m/" + i + h;

      r.path = this.path + "/" + i + h;

      if (this.chainXPrivateKey !== undefined) {
        var _key4 = S.deriveXKey(this.chainXPrivateKey, _p);

        r.privateKey = S.privateFromXPrivateKey(_key4);
        r.publicKey = S.privateToPublicKey(r.privateKey);
      } else {
        var _key5 = S.deriveXKey(this.chainXPublicKey, _p);

        r.publicKey = S.publicFromXPublicKey(_key5);
      }
    }

    if (this.addressType === "P2WPKH") r.address = S.publicKeyToAddress(r.publicKey, {
      testnet: this.testnet
    });else if (this.addressType === "P2SH_P2WPKH") r.address = S.publicKeyToAddress(r.publicKey, {
      p2sh_p2wpkh: true,
      testnet: this.testnet
    });else if (this.addressType === "P2PKH") r.address = S.publicKeyToAddress(r.publicKey, {
      witnessVersion: null,
      testnet: this.testnet
    });
    return r;
  };

  S.Wallet = Wallet;
};