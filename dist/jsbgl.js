"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var __btcCryptoJS = require('./btc_crypto.js');

var constants = require('./constants.js');

var tools = require('./functions/tools.js');

var opcodes = require('./opcodes.js');

var hash = require('./functions/hash.js');

var encoders = require('./functions/encoders.js');

var shamirSecret = require('./functions/shamir_secret_sharing.js');

var mnemonicWordlist = require('./bip39_wordlist.js');

var mnemonic = require('./functions/bip39_mnemonic.js');

var key = require('./functions/key.js');

var address = require('./functions/address.js');

var bip32 = require('./functions/bip32.js');

var script = require('./functions/script.js');

var Address = require('./classes/address.js');

var Transation = require('./classes/transaction.js');

var Wallet = require('./classes/wallet.js');

module.exports = {
  __initTask: null,
  asyncInit: function () {
    var _asyncInit = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(scope) {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(this.__initTask === null)) {
                _context.next = 6;
                break;
              }

              _context.next = 3;
              return this.__asyncInit(scope);

            case 3:
              this.__initTask = _context.sent;
              _context.next = 9;
              break;

            case 6:
              if (!(this.__initTask !== "completed")) {
                _context.next = 9;
                break;
              }

              _context.next = 9;
              return this.__initTask;

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function asyncInit(_x) {
      return _asyncInit.apply(this, arguments);
    }

    return asyncInit;
  }(),
  __asyncInit: function () {
    var _asyncInit2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(scope) {
      var seed, seedPointer;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (scope === undefined) scope = this;
              tools(scope);
              constants(scope);
              opcodes(scope);
              _context2.next = 6;
              return this.__initCryptoModule();

            case 6:
              scope.__bitcoin_core_crypto = _context2.sent;
              hash(scope);
              encoders(scope);
              mnemonic(scope);
              mnemonicWordlist(scope);
              shamirSecret(scope);
              scope.secp256k1PrecompContextSign = scope.__bitcoin_core_crypto.module._secp256k1_context_create(scope.SECP256K1_CONTEXT_SIGN);
              scope.secp256k1PrecompContextVerify = scope.__bitcoin_core_crypto.module._secp256k1_context_create(scope.SECP256K1_CONTEXT_VERIFY);
              seed = scope.generateEntropy({
                'hex': false
              });
              seedPointer = scope.__bitcoin_core_crypto.module._malloc(seed.length);

              scope.__bitcoin_core_crypto.module.HEAPU8.set(seed, seedPointer);

              scope.__bitcoin_core_crypto.module._secp256k1_context_randomize(scope.secp256k1PrecompContextSign, seedPointer);

              key(scope);
              address(scope);
              bip32(scope);
              script(scope);
              Address(scope);
              Transation(scope);
              Wallet(scope);
              this.__initTask = "completed";

            case 26:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function __asyncInit(_x2) {
      return _asyncInit2.apply(this, arguments);
    }

    return __asyncInit;
  }(),
  __initCryptoModule: function __initCryptoModule() {
    return new Promise(function (resolve) {
      __btcCryptoJS().then(function (module) {
        resolve({
          module: module
        });
      });
    });
  }
};