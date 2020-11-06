#!/bin/bash
rm /jsbgl/src/btc_crypto.*  2> /dev/null
rm /jsbgl/c-crypto/*.o  2> /dev/null
cd /root/emsdk;

source /root/emsdk/emsdk_env.sh;

set -e

export OPTIMIZE="-Oz"
export LDFLAGS="${OPTIMIZE}"
export CFLAGS="${OPTIMIZE}"
export CXXFLAGS="${OPTIMIZE}"

echo "============================================="
echo "Compiling wasm bindings"
echo "============================================="

cd /jsbgl/c-crypto

(
    emcc \
     -Oz \
     -c \
     /jsbgl/c-crypto/hmac.c \
     /jsbgl/c-crypto/pbkdf2.c \
     /jsbgl/c-crypto/memzero.c \
     /jsbgl/c-crypto/sha512.c \
     /jsbgl/c-crypto/md5.c \
     /jsbgl/c-crypto/sha3.c \
)

ls

cd /jsbgl/secp256k1

sh autogen.sh
emconfigure ./configure --enable-module-recovery
emmake make





(
    emcc \
    ${OPTIMIZE} \
     -s WASM=1  \
     -s "ENVIRONMENT='web,node'" \
     -s NO_EXIT_RUNTIME=1 \
     -s INLINING_LIMIT=1 \
     -s FILESYSTEM=0 \
     -s MODULARIZE=1 \
     -s NO_DYNAMIC_EXECUTION=0 \
     -s STRICT=1 \
     --closure 1 \
     -s NO_FILESYSTEM=1 \
     -s LINKABLE=0 \
     -s BINARYEN_IGNORE_IMPLICIT_TRAPS=1 \
     -std=c++1z \
    -s ALLOW_MEMORY_GROWTH=0 \
    -s INVOKE_RUN=1 \
    -s ERROR_ON_UNDEFINED_SYMBOLS=0 \
    -s EXPORTED_FUNCTIONS="['_malloc', '_free', '_secp256k1_ec_pubkey_create', '_secp256k1_context_randomize', '_secp256k1_context_create', '_secp256k1_ecdsa_recover', '_secp256k1_ecdsa_signature_parse_der', '_secp256k1_ec_pubkey_parse', '_secp256k1_ec_pubkey_serialize', '_secp256k1_ecdsa_verify', '_secp256k1_ecdsa_sign_recoverable', '_secp256k1_ecdsa_signature_serialize_der', '_secp256k1_ecdsa_signature_serialize_compact', '_secp256k1_ecdsa_recoverable_signature_parse_compact', '_secp256k1_ecdsa_recoverable_signature_serialize_compact', '_hmac_sha512_oneline', '_pbkdf2_hmac_sha512', '_secp256k1_ec_pubkey_tweak_add', '_md5sum', '_sha3' ]" \
    -s EXPORTED_RUNTIME_METHODS='["getValue"]' \
    -s SINGLE_FILE=1 \
    --bind \
     -o /jsbgl/src/btc_crypto.js \
     /jsbgl/cpp-crypto/sha256.cpp \
     /jsbgl/cpp-crypto/siphash.cpp \
     /jsbgl/cpp-crypto/uint256.cpp \
     /jsbgl/cpp-crypto/base58.cpp \
     /jsbgl/cpp-crypto/ripemd160.cpp \
     /jsbgl/c-crypto/hmac.o \
     /jsbgl/c-crypto/pbkdf2.o \
     /jsbgl/c-crypto/memzero.o \
     /jsbgl/c-crypto/sha512.o \
     /jsbgl/c-crypto/md5.o \
     /jsbgl/c-crypto/sha3.o \
     /jsbgl/secp256k1/.libs/libsecp256k1.a


)

echo "============================================="
echo "Compiling wasm bindings done"
echo "============================================="