<img src="docs/img/jsbgl.png" width="100">

## JavaScript Bitgesell library

[![travis build](https://img.shields.io/travis/bitaps-com/jsbtc?style=plastic)](https://travis-ci.org/bitaps-com/jsbtc)
[![codecov coverage](https://img.shields.io/codecov/c/github/bitaps-com/jsbtc/beta?style=plastic)](https://codecov.io/gh/bitaps-com/jsbtc)
[![version](https://img.shields.io/npm/v/jsbtc.js/latest?style=plastic)](https://www.npmjs.com/package/jsbtc.js/v/latest)


Crypto secp256k1 + wasm. Implemented: bip32, bip39, bip44, bip49, bip84, bip141. NIST random generation tests on the fly for entropy. Shamir's secret sharing for mnemonic.

### Build
    npm install jsbgl.js
    npm run build:wasm:prebuild
    npm run build:wasm
    npm run build
    npm run build:web
 
### Use in browser
    <script src="jsbgl.web.min.js"></script>
    <script> ...
    // inside async function 
    var jsbgl = await jsbgl.asyncInit();
    ... </script>
    
### Tests
    https://github.com/bitaps-com/jsbgl/blob/master/test/jsbgl.test.js

### Documentation

Documentation is available at https://jsbgl.readthedocs.io

### Example of usage

##### Create address

      > let a= new Address()
      > a.address
      'bgl1qdzjn6rd7e84lt2m5d3yf9jcg42ncdje7vhp4rl'
      > a.privateKey.wif
      'L1LAHLFBWcW2E1xRsUooVL9ajxJXtsAUjJJ4GuPTgHKAKNhy6fsD'
      > let a = new Address('L1LAHLFBWcW2E1xRsUooVL9ajxJXtsAUjJJ4GuPTgHKAKNhy6fsD')
      > a.address
      'bgl1qdzjn6rd7e84lt2m5d3yf9jcg42ncdje7vhp4rl'


##### Create private key

      > createPrivateKey()
      'L1Gc4WGJWbH4HwjeHiBibyDRP3HRK2GvutXH2dhhJTxxE35uGwt6'
      > createPrivateKey(compressed=False)
      '5J54rpM5FW84bNAuoxf566rPsFYGmSYtvVcT4RjKKeX5PVwqu37'
      

##### Create wallet

      > let w = new Wallet({path_type:'BIP84'})
      > w.mnemonic
      'spell scrap legend skin witness inherit gadget resource control replace nothing suspect picnic open letter regret great video voice media bridge walnut parade write'
      > w.accountXPublicKey
      'zpub6rz33FnVq7Gk5zwSHFmU2JyS3TTxJcsidBkSYYEirtrrEYiWNoEVWTicx9AQFxBLgYqNjJRSWGmzGcAqYnXSGwBBj66SUDDoZwjMFdR1dCX'
      > let w = new Wallet({from:'spell scrap legend skin witness inherit gadget resource control replace nothing suspect picnic open letter regret great video voice media bridge walnut parade write'},path_type='BIP84')
      > w.Wallet.accountXPublicKey
      'zpub6rz33FnVq7Gk5zwSHFmU2JyS3TTxJcsidBkSYYEirtrrEYiWNoEVWTicx9AQFxBLgYqNjJRSWGmzGcAqYnXSGwBBj66SUDDoZwjMFdR1dCX'
       > w.getAddress(0).address
      'bgl1qn54eph87wl54atvctxmvvcqs707lwmw4x8pumc'
       > w.getAddress(0).privateKey
      'L3Rf12jKkYXwv8PTVbfi1JmYQMpe2VKKf94KB4ysrDnN2yFQAn9q'
       > w.getAddress(0).publicKey
      '03f8e334ae6dd193eba99220efc8b56e0b9d1a82a4f626c43da4f5a37e630f8e8b'
  
### How to Contribute

In order to make a clone of the GitHub repo: open the link and press the “Fork” button on the upper-right menu of the web page.

Workflow is pretty straightforward:

1. Clone the GitHub
2. Make a change
3. Make sure all tests passed
4. Add a record into file into change.log.
5. Commit changes to own jsbgl clone
6. Make pull request from github page for your clone against master branch
