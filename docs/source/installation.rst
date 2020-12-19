============
Installation
============

This part of the documentation covers the installation of jsbgl library. The first step to using any software package is getting it properly installed.


Build
==========================

.. code-block:: bash

   npm install jsbgl.js
   npm run build:wasm:prebuild
   npm run build:wasm
   npm run build
   npm run build:web


Use in browser
===============

.. code-block:: bash

    <script src="jsbgl.web.min.js"></script>
    <script> ...
      // inside async function
    var jsbgl = await jsbgl.asyncInit();
    ... </script>


Tests
===============

.. code-block:: bash

   https://github.com/bitaps-com/jsbgl/blob/master/test/jsbgl.test.js





