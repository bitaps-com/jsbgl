
========================
Pure functions reference
========================

Base function primitives implemented in functional programming paradigm.



Mnemonic(BIP39)
===============

.. js:autofunction:: generateEntropy
.. js:autofunction:: entropyToMnemonic
.. js:autofunction:: mnemonicToEntropy
.. js:autofunction:: mnemonicToSeed

Private keys
============

.. js:autofunction:: createPrivateKey
.. js:autofunction:: privateKeyToWif
.. js:autofunction:: wifToPrivateKey
.. js:autofunction:: isWifValid


Public keys
===========

.. WARNING::
   Using uncompressed public keys is
   `deprecated <https://github.com/bitcoin/bips/blob/master/bip-0143.mediawiki#restrictions-on-public-key-type>`_
   in  a new SEGWIT address format.
   To avoid potential future funds loss, users MUST NOT use uncompressed keys
   in version 0 witness programs. Use uncompressed keys only for backward
   compatibilitylegacy in legacy address format (PUBKEY, P2PKH).


.. js:autofunction:: privateToPublicKey
.. js:autofunction:: isPublicKeyValid


Extended keys(BIP32)
====================

.. js:autofunction:: createMasterXPrivateKey
.. js:autofunction:: xPrivateToXPublicKey
.. js:autofunction:: deriveXKey
.. js:autofunction:: publicFromXPublicKey
.. js:autofunction:: privateFromXPrivateKey


Addresses
=========

.. js:autofunction:: hashToAddress
.. js:autofunction:: addressToHash
.. js:autofunction:: publicKeyToAddress
.. js:autofunction:: addressType
.. js:autofunction:: addressToScript
.. js:autofunction:: isAddressValid



Script
======

.. js:autofunction:: decodeScript
.. js:autofunction:: parseScript
.. js:autofunction:: deleteFromScript
.. js:autofunction:: scriptToHash


Signatures
==========

.. js:autofunction:: verifySignature
.. js:autofunction:: signBitcoinMessage
.. js:autofunction:: isValidSignatureEncoding

Hash encoding
=============

.. js:autofunction:: rh2s
.. js:autofunction:: s2rh


Tools
=====

.. js:autofunction:: encodeBase58
.. js:autofunction:: decodeBase58
.. js:autofunction:: intToBytes
.. js:autofunction:: intToVarInt
.. js:autofunction:: varIntToInt
.. js:autofunction:: varIntLen
.. js:autofunction:: bytesToString
.. js:autofunction:: stringToBytes
.. js:autofunction:: hexToBytes





