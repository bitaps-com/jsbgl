.. aiohttp documentation master file, created by
   sphinx-quickstart on Wed Mar  5 12:35:35 2014.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

==================
Welcome to JSBGL
==================

Javascript library for Bitgesell.


.. _GitHub: https://github.com/bitaps-com/jsbgl


Key Features
============


- Crypto secp256k1 + wasm.
- Implemented: bip32, bip39, bip44, bip49, bip84, bip141.
- NIST random generation tests on the fly for entropy.
- Shamir's secret sharing for mnemonic.


.. _aiohttp-installation:

Quick library Installation
==========================

.. code-block:: bash

   npm install jsbgl.js
   npm run build:wasm:prebuild
   npm run build:wasm
   npm run build
   npm run build:web


Source code
===========

The project is hosted on GitHub_

Please feel free to file an issue on the `bug tracker
<https://github.com/bitaps-com/jsbgl/issues>`_ if you have found a bug
or have some suggestion in order to improve the library.


Authors
===================

The ``jsbgl`` package was initially written by `Aleksey Karpov <https://github.com/4tochka>`_ and development continues with contributors.

Recent contributors:

- `Aleksey Karpov <https://github.com/4tochka>`_
- `Nadezhda Karpova <https://github.com/madnadyka>`_

Feel free to improve this package and send a pull request to GitHub_.




Table Of Contents
=================

.. toctree::
   :name: mastertoc
   :maxdepth: 2


   installation.rst
   examples.rst
   classes.rst
   functional.rst
   contributing.rst



