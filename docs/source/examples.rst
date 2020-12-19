========
Examples
========


Create address
--------------

This is example of usage Address class. The address class implements the work with addresses controlled by a private key.
Supports the ability to create P2WPKH, P2PKH, PUBKEY address types and P2SH_P2WPKH as exception for SEGWIT adoption.
It is recommended to use native SEGWIT address type - P2WPKH, which reduces costs of miner fee and expand block capacity.
To create an address, you need to create a class object. Buy default,
will be created P2WPKH address for mainnet.



.. code-block:: bash

      > let a= new Address()
      > a.address
      'bgl1qdzjn6rd7e84lt2m5d3yf9jcg42ncdje7vhp4rl'
      > a.privateKey.wif
      'L1LAHLFBWcW2E1xRsUooVL9ajxJXtsAUjJJ4GuPTgHKAKNhy6fsD'


Get address from key
--------------------

In case you already have private or public key you can object from your key.

.. code-block:: bash

      > let a = new Address('L1LAHLFBWcW2E1xRsUooVL9ajxJXtsAUjJJ4GuPTgHKAKNhy6fsD')
      > a.address
      'bgl1qdzjn6rd7e84lt2m5d3yf9jcg42ncdje7vhp4rl'
      > a.publicKey.hex
      '028608fe359c6ffa37f2429279145e627feff745b2e35fe1f4fcabc1759005ddc7'
      > // get address from public key
      > let pub = new PublicKey('028608fe359c6ffa37f2429279145e627feff745b2e35fe1f4fcabc1759005ddc7')
      > new Address(pub).address
      'bgl1qdzjn6rd7e84lt2m5d3yf9jcg42ncdje7vhp4rl'


Pure functions for address
--------------------------

Create private key

.. code-block:: bash

      > createPrivateKey()
      'L1Gc4WGJWbH4HwjeHiBibyDRP3HRK2GvutXH2dhhJTxxE35uGwt6'
      > createPrivateKey(compressed=False)
      '5J54rpM5FW84bNAuoxf566rPsFYGmSYtvVcT4RjKKeX5PVwqu37'
      > isWifValid('5J54rpM5FW84bNAuoxf566rPsFYGmSYtvVcT4RjKKeX5PVwqu37')
      true
      > isWifValid('5J54rpM5FW84bNA*********sFYGmSYtvVcT4RjKKeX5PVwqu37')
      false



Tools

.. code-block:: bash

      > isAddressValid('bgl1qdzjn6rd7e84lt2m5d3yf9jcg42ncdje7vhp4rl')
      true
      > addressType('bgl1qdzjn6rd7e84lt2m5d3yf9jcg42ncdje7vhp4rl')
      'P2WPKH'
      > addressNetType('bgl1qdzjn6rd7e84lt2m5d3yf9jcg42ncdje7vhp4rl')
      'mainnet'




Create wallet
--------------

This is example of usage Wallet class.



.. code-block:: bash

      > let w = new Wallet({path_type:'BIP84'})
      > w.mnemonic
      'spell scrap legend skin witness inherit gadget resource control replace nothing suspect picnic open letter regret great video voice media bridge walnut parade write'
      > w.accountXPrivateKey
      'zprvAdzgdkFbzjiSsWryBEETfB2hVRdTuA9sFxpqk9q7JZKsMkPMqFvExfQ96s1aYRZ1d49Y4ttUriAbFPtRpuL2G4JcXtRihxYfN8GRp5i1ZH8'
      > w.accountXPublicKey
      'zpub6rz33FnVq7Gk5zwSHFmU2JyS3TTxJcsidBkSYYEirtrrEYiWNoEVWTicx9AQFxBLgYqNjJRSWGmzGcAqYnXSGwBBj66SUDDoZwjMFdR1dCX'
      > let w = new Wallet({from:'spell scrap legend skin witness inherit gadget resource control replace nothing suspect picnic open letter regret great video voice media bridge walnut parade write'},path_type='BIP84')
      > w.Wallet.accountXPrivateKey
      'zprvAdzgdkFbzjiSsWryBEETfB2hVRdTuA9sFxpqk9q7JZKsMkPMqFvExfQ96s1aYRZ1d49Y4ttUriAbFPtRpuL2G4JcXtRihxYfN8GRp5i1ZH8'
      > w.Wallet.accountXPublicKey
      'zpub6rz33FnVq7Gk5zwSHFmU2JyS3TTxJcsidBkSYYEirtrrEYiWNoEVWTicx9AQFxBLgYqNjJRSWGmzGcAqYnXSGwBBj66SUDDoZwjMFdR1dCX'






Get wallet addresses
--------------------


.. code-block:: bash

       > w.getAddress(0).address
      'bgl1qn54eph87wl54atvctxmvvcqs707lwmw4x8pumc'
       > w.getAddress(0).privateKey
      'L3Rf12jKkYXwv8PTVbfi1JmYQMpe2VKKf94KB4ysrDnN2yFQAn9q'
       > w.getAddress(0).publicKey
      '03f8e334ae6dd193eba99220efc8b56e0b9d1a82a4f626c43da4f5a37e630f8e8b'
       > w.getAddress(1).address
       'bgl1q9dzfer3yxgagfr36k258mw3mqn4swkw89fuyuz'
       > w.getAddress(1).privateKey
       'L2KCtKzPPszTSckHcu5evDG7sYaKwmRiVeJaC6r55EAonff2hYtE'
       > w.getAddress(1).publicKey
       '037f4cdd5b10ac741d62aeedeca18da8177e38d04126dbf5d45f957f257c179e10'
