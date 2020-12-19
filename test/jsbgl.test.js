var browser = true;
try {
    var jsbgl = require('../src/jsbgl.js');
    var chai = require('chai');
    chai.use(require("chai-as-promised"));
    browser = false;
    var fetch = require('node-fetch');
    var window = global;
} catch (e) {
    console.log(e);
}

const assert = chai.assert;
const expect = chai.expect;
const equal = assert.equal;

describe(`${(browser) ? 'Browser' : 'Node'} test jsbgl library`, function () {
    it('Asynchronous initialization', async () => {
        await jsbgl.asyncInit(window);
    });
    describe("Hash functions:", function () {
        it('sha256', () => {
            equal(sha256("test sha256", {hex: true}),
                "c71d137da140c5afefd7db8e7a255df45c2ac46064e934416dc04020a91f3fd2");
            equal(sha256("7465737420736861323536", {hex: true}),
                "c71d137da140c5afefd7db8e7a255df45c2ac46064e934416dc04020a91f3fd2");
            equal(sha256("00bb", {hex: true, encoding: 'utf8'}),
                "bb88b952880c3a64d575449f8c767a53c52ce8f55f9c80f83e851aa6fce5bbea");
            equal(sha256("30306262", {hex: true}),
                "bb88b952880c3a64d575449f8c767a53c52ce8f55f9c80f83e851aa6fce5bbea");
            equal(sha256(stringToBytes("test sha256"), {hex: true}),
                "c71d137da140c5afefd7db8e7a255df45c2ac46064e934416dc04020a91f3fd2");
        });
        it('double sha256', () => {
            equal(doubleSha256("test double sha256", {hex: true}),
                "1ab3067efb509c48bda198f48c473f034202537c28b7b4c3b2ab2c4bf4a95c8d");
            equal(doubleSha256(stringToBytes("test double sha256"), {hex: true}),
                "1ab3067efb509c48bda198f48c473f034202537c28b7b4c3b2ab2c4bf4a95c8d");
            equal(doubleSha256("7465737420646f75626c6520736861323536", {hex: true}),
                "1ab3067efb509c48bda198f48c473f034202537c28b7b4c3b2ab2c4bf4a95c8d");
            equal(doubleSha256("00bb", {encoding: "utf8", hex: true}),
                "824d078ceda8e8eb07cc8181a81f43c8855586c913dd7f54c94f05134e085d5f");
            equal(doubleSha256("30306262", {hex: true}),
                "824d078ceda8e8eb07cc8181a81f43c8855586c913dd7f54c94f05134e085d5f");
        });
       it('Class sha256', () => {
            equal(sha256("test sha256", {hex: true}),
                "c71d137da140c5afefd7db8e7a255df45c2ac46064e934416dc04020a91f3fd2");
            let s = new SHA256().update("test sha256").hexdigest();
            equal(s, "c71d137da140c5afefd7db8e7a255df45c2ac46064e934416dc04020a91f3fd2");


        });

        it('siphash', () => {
            let v0 = new BN("0706050403020100", 16);
            let v1 = new BN("0F0E0D0C0B0A0908", 16);
            equal(siphash("000102030405060708090a0b0c0d0e0f",  {v0: v0, v1: v1}).toString('hex'), "3f2acc7f57c29bdb");
            equal(siphash("0001020304050607", {v0: v0, v1: v1}).toString('hex'), "93f5f5799a932462");
            equal(siphash("", {v0: v0, v1: v1}).toString('hex'), "726fdb47dd0e0e31");
            equal(siphash("siphash test").toString('hex'), "84c247dc01541d54");
            equal(siphash(stringToBytes("siphash test")).toString('hex'), "84c247dc01541d54");
            expect(() => siphash("", {v0: 43, v1: v1}).toString('hex')).to.throw('must be BN instance');
            expect(() => siphash("", {v0: v0, v1: 11}).toString('hex')).to.throw('must be BN instance');
        });
        it('ripemd160', () => {
            equal(ripemd160("test hash160", {hex: true}),
                "46a80bd289028559818a222eea64552d7a6a966f");
            equal(ripemd160(stringToBytes("test hash160"), {hex: true}),
                "46a80bd289028559818a222eea64552d7a6a966f");
            equal(ripemd160("746573742068617368313630", {hex: true}),
                "46a80bd289028559818a222eea64552d7a6a966f");
            equal(Buffer.from("46a80bd289028559818a222eea64552d7a6a966f", 'hex').equals(ripemd160("746573742068617368313630")),
                true);
            equal(Buffer.from("46a80bd289028559818a222eea64552d7a6a966f", 'hex').equals(ripemd160("146573742068617368313630")),
                false);
        });
        it('md5', () => {
            equal(md5("test hash md5", {hex: true}),
                "6715e18f329d8efc81c42a5ae0d48b7c");

        });
        it('hash160', () => {
            equal(hash160("test hash160", {hex: true}), "b720061a734285a70e86cb32b31f32884e198c32");
            equal(hash160("746573742068617368313630", {hex: true}), "b720061a734285a70e86cb32b31f32884e198c32");
            equal(Buffer.from("b720061a734285a70e86cb32b31f32884e198c32", 'hex').equals(hash160("746573742068617368313630")), true);
            equal(Buffer.from("b720061a734285a70e86cb32b31f32884e198c32", 'hex').equals(hash160("146573742068617368313630")), false);
        });

        it('sha3', () => {
            // equal(hash160("test sha3", {hex: true}), "b720061a734285a70e86cb32b31f32884e198c32");
            // equal(hash160("746573742068617368313630", {hex: true}), "b720061a734285a70e86cb32b31f32884e198c32");
            equal(sha3(Buffer.from("0000002040dee9142842cfd14796055fc8f16e48454b31e1c1f34c69be4834f40b000000f2e8d5499863e98272006d82dab93645902a255b279b0e98add955f66b5b9b3cc7f1195e82670f1d9bc3ab00", 'hex')).hex(),
                s2rh("0000000b1ab864338f2ac7fd9d6b833be3a113031f09c30e9c944c161635e0db").hex());
            // equal(Buffer.from("b720061a734285a70e86cb32b31f32884e198c32", 'hex').equals(hash160("146573742068617368313630")), false);
        });

        it('hmac sha512', () => {
            equal(hmacSha512("super key", "super data", {hex: true}),
                "8ec43ebe20084b72849eaca74d0dff44cb8db418944a25887673dc22ef8dd52d46ca56739d3d35e841" +
                "bcebc3d7e8afc763b13c2018ef2462a5903c548c5c2600");
            equal(hmacSha512("7375706572206b6579", "super data", {hex: true}),
                "8ec43ebe20084b72849eaca74d0dff44cb8db418944a25887673dc22ef8dd52d46ca56739d3d35e841" +
                "bcebc3d7e8afc763b13c2018ef2462a5903c548c5c2600");
        });

    });


    describe("Encoder functions:", function () {
        it('encodeBase58', () => {
            equal(encodeBase58("000002030405060708090a0b0c0d0e0f"),
                "11ju1bKJX8HGdT7YmKLi");
            equal(encodeBase58("00759d5f2b6d12712fef6f0f24c56804193e1aeac176c1faae"),
                "1Bitapsw1aT8hkLXFtXwZQfHgNwNJEyJJ1");

        });
        it('decodeBase58', () => {
            equal(decodeBase58("1Bitapsw1aT8hkLXFtXwZQfHgNwNJEyJJ1"),
                "00759d5f2b6d12712fef6f0f24c56804193e1aeac176c1faae");
            equal(encodeBase58(decodeBase58("11ju1bKJX8HGdT7YmKLi", {hex: false})),
                "11ju1bKJX8HGdT7YmKLi");
            equal(encodeBase58(decodeBase58("11ju1bKJX8HGdT7YmKLi", {hex: true})),
                "11ju1bKJX8HGdT7YmKLi");
        });

    });

    describe("BIP38 mnemonic functions:", function () {
        it('Generate entropy', () => {
            equal(generateEntropy().length, 64);
            equal(generateEntropy({strength: 224}).length, 56);
            equal(generateEntropy({strength: 192}).length, 48);
            equal(generateEntropy({strength: 160}).length, 40);
            equal(generateEntropy({strength: 128}).length, 32);
        });
        it('igam and igamc math functions', function () {
            let q = 0.0000000000001;
            equal(igam(0.56133437, 7.79533309) - 0.99989958147838275959 < q, true);
            equal(igam(3.80398274, 0.77658461) - 0.01162079725209424867 < q, true);
            equal(igam(6.71146614, 0.39790492) - 0.00000051486912406477 < q, true);
            equal(igam(5.05505886, 6.08602125) - 0.71809645160316382118 < q, true);
            equal(igam(9.45603411, 4.60043366) - 0.03112942473115925396 < q, true);
            equal(igamc(3.08284045, 0.79469709) - 0.95896191705843125686 < q, true);
            equal(igamc(7.91061495, 9.30889249) - 0.27834295370900602462 < q, true);
            equal(igamc(4.89616780, 5.75314859) - 0.30291667399717547848 < q, true);
            equal(igamc(8.11261940, 4.05857957) - 0.95010562492501993148 < q, true);
            equal(igamc(1.34835811, 6.64708856) - 0.00295250273836756942 < q, true);
        });
        it('Entropy <-> mnemonic', () => {
            let m = 'young crime force door joy subject situate hen pen sweet brisk snake nephew sauce ' +
                   'point skate life truly hockey scout assault lab impulse boss';
            let e = "ff46716c20b789aff26b59a27b74716699457f29d650815d2db1e0a0d8f81c88";
            equal(entropyToMnemonic(e), m);
            equal(mnemonicToEntropy(m), e);
            for (let i = 0; i< 1000;i++) {
                let e = generateEntropy();
                let m = entropyToMnemonic(e);
                equal(mnemonicToEntropy(m), e);
            }

            e = "000000717ded6e3da64ad190e524dcdd0980099415b7a878d13fdd7583ff4da9";
            m = entropyToMnemonic(e);
            equal(mnemonicToEntropy(m), e);
            e = "000000007ded6e3da64ad190e524dcdd0980099415b7a878d13fdd7583000000";
            m = entropyToMnemonic(e);
            equal(mnemonicToEntropy(m), e);

            m = 'gift unfold street machine glue spring spin energy assist stereo liar ramp';
            e = '61dda75bc2c63fa6747a500ddab20358';

            equal(entropyToMnemonic(e), m);
            equal(mnemonicToEntropy(m), e);

            for (let i = 0; i< 1000;i++) {
                let e = generateEntropy({strength: 128});
                let m = entropyToMnemonic(e);
                equal(mnemonicToEntropy(m), e);
            }
            for (let i = 0; i< 1000;i++) {
                let e = generateEntropy({strength: 160});
                let m = entropyToMnemonic(e);
                equal(mnemonicToEntropy(m), e);
            }
            for (let i = 0; i< 1000;i++) {
                let e = generateEntropy({strength: 192});
                let m = entropyToMnemonic(e);
                equal(mnemonicToEntropy(m), e);
            }
            for (let i = 0; i< 1000;i++) {
                let e = generateEntropy({strength: 224});
                let m = entropyToMnemonic(e);
                equal(mnemonicToEntropy(m), e);
            }
        }).timeout(10000);

        it('isMnemonicCheckSumValid', () => {
            let m = 'gift unfold street machine glue spring spin energy assist stereo liar ramp';
            equal(isMnemonicCheckSumValid(m), true);
            m = 'gift gift gift machine glue spring spin energy assist stereo liar ramp';
            equal(isMnemonicCheckSumValid(m), false);
            m = 'gift gift street machine glue spring spin energy assist stereo liar ramp';
            equal(isMnemonicCheckSumValid(m), false)
            m = 'young crime force door joy subject situate hen pen sweet brisk snake nephew sauce ' +
                'point skate life truly hockey scout assault lab impulse boss';
            equal(isMnemonicCheckSumValid(m), true);
            m = 'young crime force door joy subject situate hen pen sweet brisk snake nephew sauce ' +
                'point skate life forcet hockey scout assault lab impulse boss';
            equal(isMnemonicCheckSumValid(m), false);
        });

        it('isMnemonicValid', () => {
            let m = 'gift unfold street machine glue spring spin energy assist stereo liar ramp';
            equal(isMnemonicValid(m), true);
            m = 'gift gift gift machine glue spring spin energy assist stereo liar ramp';
            equal(isMnemonicValid(m), true);
            m = 'gift gift streety machine glue spring spin energy assist stereo liar ramp';
            equal(isMnemonicValid(m), false)
        });

        it('mnemonic to seed', () => {
            let m = 'young crime force door joy subject situate hen pen sweet brisk snake nephew sauce ' +
                   'point skate life truly hockey scout assault lab impulse boss';
            let s = "a870edd6272a4f0962a7595612d96645f683a3378fd9b067340eb11ebef45cb3d28fb64678cadc43969846" +
               "0a3d48bd57b2ae562b6d2b3c9fb5462d21e474191c";
            equal(mnemonicToSeed(m, {hex:true}), s);

        });


        it('splitMnemonic + combineMnemonic', () => {
            let m = entropyToMnemonic(generateEntropy());
            let s = splitMnemonic(3, 5, m);
            equal(m, combineMnemonic(s));

            for (let q = 0; q < 10; q++) {
                let t =  Math.floor(Math.random() * (10  )) + 2;
                let i =  Math.floor(Math.random() * (t - 2 )) + 2;
                let m = entropyToMnemonic(generateEntropy());
                let shares = splitMnemonic(i, t, m, {sharesVerify: true});
                let s = {};
                let q = Math.floor(Math.random() * (Object.keys(shares).length) + 1);
                if (q<i) q = i;
                let keys = [];
                for (let k in shares)
                    keys.push(k);
                do {
                    let i = keys[Math.floor(Math.random() * (keys.length))];

                    s[i] = shares[i];
                } while (Object.keys(s).length < i);
                let m2 = combineMnemonic(s);
                equal(m, m2);
            }
        }).timeout(10000);

        it('split mnemonic with embedded indexes', () => {
            let m = 'young crime force door joy subject situate hen pen sweet brisk snake nephew sauce ' +
                   'point skate life truly hockey scout assault lab impulse boss';
            let s = "a870edd6272a4f0962a7595612d96645f683a3378fd9b067340eb11ebef45cb3d28fb64678cadc43969846" +
               "0a3d48bd57b2ae562b6d2b3c9fb5462d21e474191c";
            let t = 5;
            let i = 3;
            let shares = splitMnemonic(i, t, m, {embeddedIndex: true});
            equal(combineMnemonic(shares), m);

        });
        it('split mnemonic with embedded indexes extensive test', () => {

            let m = entropyToMnemonic(generateEntropy());
            let s = splitMnemonic(3, 255, m, {embeddedIndex: true});
            equal(m, combineMnemonic(s));
            s = splitMnemonic(255, 255, m, {embeddedIndex: true});
            equal(m, combineMnemonic(s));
            s = splitMnemonic(2, 255, m, {embeddedIndex: true});
            equal(m, combineMnemonic(s));

            s = splitMnemonic(1, 255, m, {embeddedIndex: true});
            equal(m, combineMnemonic(s));

            m = "stage amused wasp estate tomorrow outer satoshi version verb pudding ghost slender";
            s = splitMnemonic(3, 8, m, {embeddedIndex: true});

            equal(m, combineMnemonic(s));

            for (let q = 0; q < 10; q++) {
                let t =  Math.floor(Math.random() * (10  )) + 2;
                let i =  Math.floor(Math.random() * (t - 2 )) + 2;
                let m = entropyToMnemonic(generateEntropy());
                // i of t shares
                let shares = splitMnemonic(i, t, m, {embeddedIndex: true, sharesVerify:true});
                let s = [];
                let keys = [];

                do {
                    let q = Math.floor(Math.random() * (shares.length));

                    if (!keys.includes(q)) {
                    s.push(shares[q]);
                    keys.push(q);
                    }

                } while (s.length < i);

                let m2 = combineMnemonic(s);
                equal(m, m2);
            }
        }).timeout(10000);
    });

    describe("BIP32 functions:", function () {
        it('createMasterXPrivateKey', () => {
            let e = "6afd4fd96ca02d0b7038429b77e8b32042fc205d031144054086130e8d83d981";
            equal("xprv9s21ZrQH143K4LAkSUTJ3JiZ4cJc1FyRxCbPoWTQVssiezx3gpav8iJdHggBTTUv37iQUrfNDYpGmTSP6zwFD2kJAFiUzpewivZUD6Jqdai",
                createMasterXPrivateKey(mnemonicToSeed(entropyToMnemonic(e))))
            equal(decodeBase58("xprv9s21ZrQH143K4LAkSUTJ3JiZ4cJc1FyRxCbPoWTQVssiezx3gpav8iJdHggBTTUv37iQUrfNDYpGmTSP6zwFD2kJAFiUzpewivZUD6Jqdai",
                {checkSum: true, hex: false}).hex(),
                createMasterXPrivateKey(mnemonicToSeed(entropyToMnemonic(e)), {base58: false}).hex())
        });

        it('xPrivateToXPublicKey', () => {
            let m = "debate pattern hotel silly grit must bronze athlete kitten salute salmon cat control hungry little";
            let seed = mnemonicToSeed(m);
            let xPriv = createMasterXPrivateKey(seed, {hex: true});
            equal("xpub661MyMwAqRbcFRtq6C9uK3bk7pmqc5ahhqDjxx6dfge6njx6jU9EhFwpLfiE6tQv8gjuez5PkQfxTZw4UUwwkut34JRYLWpJLNGPcUCGxj8",
                  xPrivateToXPublicKey(xPriv));
            xPriv = createMasterXPrivateKey(seed, {hex: false});
            equal("xpub661MyMwAqRbcFRtq6C9uK3bk7pmqc5ahhqDjxx6dfge6njx6jU9EhFwpLfiE6tQv8gjuez5PkQfxTZw4UUwwkut34JRYLWpJLNGPcUCGxj8",
                xPrivateToXPublicKey(xPriv));
            xPriv = "tprv8ZgxMBicQKsPf9QH73JoCxLYNjipEn1SHkWWfvsryrNCSbh8gBvfeTg5CrqqTpsEQZFBUxH8NuQ5EJz8EDHC261tgtvnfBNze2Jteoxhi47";
            equal("tpubD6NzVbkrYhZ4YcS4zgyPcMzewmEkQ7CLs47HxSvAQ8AbH5wuJakFpxHwNyXDSmSDzNQmkKx2unk3xTDNN716cAKbgr6CyPm3hsAW4CqPVK2",
                xPrivateToXPublicKey(xPriv));

            equal(decodeBase58("tpubD6NzVbkrYhZ4YcS4zgyPcMzewmEkQ7CLs47HxSvAQ8AbH5wuJakFpxHwNyXDSmSDzNQmkKx2unk3xTDNN716cAKbgr6CyPm3hsAW4CqPVK2",
                {checkSum: true, hex: false}).hex(),
                xPrivateToXPublicKey(xPriv, {base58: false}).hex());

            xPriv = "ttrv8ZgxMBicQKsPf9QH73JoCxLYNjipEn1SHkWWfvsryrNCSbh8gBvfeTg5CrqqTpsEQZFBUxH8NuQ5EJz8EDHC261tgtvnfBNze2Jteoxhi47";
            expect(() => xPrivateToXPublicKey(xPriv)).to.throw('invalid');

            m = "extend whip emerge audit drama pumpkin breeze weather torch image insane rigid";
            seed = mnemonicToSeed(m);
            xPriv = createMasterXPrivateKey(seed);
            equal("xpub661MyMwAqRbcEodnzMiUBjyAnsYRzMKSAo8e2APk4Z6qXbtWPFxtDPGLeuPRJ2NJaWQBYn6weuExWuNDsNvUWLyRXmSHBdzwZysmJoLatK7",
                xPrivateToXPublicKey(xPriv));
            m = "toast exchange giggle car seminar beyond federal debate donate confirm topple enough unusual corn photo casual section only";
            seed = mnemonicToSeed(m);
            xPriv = createMasterXPrivateKey(seed);
            equal("xpub661MyMwAqRbcFVMC8d2uwpiGSh16zofbhi8PDzNBantpk5qNpRr1kK3mpgScnqUp4VDW9iFwt6gVgQcFp3QjfUYSNee8n9V2SZiMtotWfDm",
                xPrivateToXPublicKey(xPriv));
            m = "festival life pudding glide champion enhance sponsor phone panel permit mean guard chunk hedgehog view foam thought pride regular invite rice";
            seed = mnemonicToSeed(m);
            xPriv = createMasterXPrivateKey(seed);
            equal("xpub661MyMwAqRbcH5iGdcfyAo1JvG6eweRhYgNvnMv7QBYZ7KNW32CKh1W3kxa2t4MHZhLt71EMhMPEifvxLmo7SKh5wmYxUDKVDeWbuHDcDsb",
                xPrivateToXPublicKey(xPriv));
            m = "window travel aunt result badge two federal defense weasel window nothing life enforce warrior rubber stool parent elevator jazz lava fame blade prefer utility";
            seed = mnemonicToSeed(m);
            xPriv = createMasterXPrivateKey(seed);
            equal("xpub661MyMwAqRbcG5AjafHzq3GsaoY2PwudLxECQ4hrkfV2K5JrnWQj1puS1Ci5DLNDTQrdU7y1ibkBFdQ2CaZnV9MHXX78gbtUXASAuQ3kiJe",
                xPrivateToXPublicKey(xPriv));
        });

        it('__deriveChildXPrivateKey', () => {
            let xPriv = "xprv9s21ZrQH143K3CSC8gBJRWPHPzi8Y17VzhuMGgSyyiGYzbbCnmUE1zpR2iQCzVGPGAQBy2m7LTEtPAvfB6p2ECoQBAWtQYgYHpn1UFQv6Mi";
            xPriv = decodeBase58(xPriv, {hex: false, checkSum: true});
            equal("xprv9uxHkb3zFYjmC9AshDxocSv8SWphDkWq7VpNauF8hhGNMuqK2o4AKhhhuFADy1H5pVVAdZJCnyDmjZBZmgUR8aciXXELWfU6tCF4BCrhz5m",
                  encodeBase58(__deriveChildXPrivateKey(xPriv, 1),{checkSum: true}));
            equal("xprv9uxHkb3zFYjm9WnMk636CLyiCt2h6mgVR2u5iy8PgAkPW1xYCuUGYUzU6A4HWS7hDhKVQufiymoj9oYjqg1h7331YjwVTfSBN97gSo65DiV",
                encodeBase58(__deriveChildXPrivateKey(xPriv, 0),{checkSum: true}));
            equal("xprv9uxHkb3zFYzv3TK97XAQ5YykGBuFgMo5mKzjvQKuzbPf3FBeVgTC2ozTtspLBU2X4HWWFDocpB1sHjSXJby89m6cKhLhWUdhUWdF4o39kw4",
                encodeBase58(__deriveChildXPrivateKey(xPriv, 20000),{checkSum: true}));
            equal("xprv9uxHkb3zFzs4rMGo9d25NcHCyePGswYHY6fMk76DzbZ5iCucy7VtdjYa1o4n28bnnGLW4ComhMjNiUKxbgq6p6vc9zwHfHb1fvdhAvsURty",
                encodeBase58(__deriveChildXPrivateKey(xPriv, 2000000),{checkSum: true}));

        });

        it('__deriveChildXPublicKey', () => {
            let xPub = "xpub661MyMwAqRbcFgWfEhiJneL1x2YcwTqMMvpx54rbY3oXsPvMLJnUZo8tsxpGFsUrFW9zMFKAGzaDDy1pR2uoohh1CW24Se1vkSnXRMqPV9R";
            xPub = decodeBase58(xPub, {hex: false, checkSum: true});
            equal("xpub68weA6at5vJ4Mzrpr7a6ZUvSkusBWEQLnFpgXMY1EWHNNpHgkSnX6HJwwSjN7z9PFrgTLK6gtWZ37o3b2ZAQSc4V9GdxdjVTjymSVit5Sai",
                encodeBase58(__deriveChildXPublicKey(xPub, 0),{checkSum: true}));
            equal("xpub68weA6at5vJ5fuUhS2bUgtse4cswz9VpU3UJAY93oUwpP8P4oDhTtGKizXsosJH99RWnnyD9txQXBAcyAEiykRDAoyHLCcpW2vkrnsSymDQ",
                encodeBase58(__deriveChildXPublicKey(xPub, 30),{checkSum: true}));
        });

        it('deriveXKey', () => {
            let root = "xprv9s21ZrQH143K39fFeGf2cWBTZ6NVj6ZsQ7nEK9f5pWqt4YwHPhnCF3GtMsPNA9cCz1j8j9Zs493ejkzJqUWqwGqQ2J8iNc1jFtFPbie7bZ4";
            equal(deriveXKey(root, "m/0"), "xprv9v7aNJTyjf9pZ2e1XwaKwTaiYqmwy9C43GPrczk9NauP4aWYqeKh5UfE3ocfV92UGFKBbQNZib8TDtqD8y5axYQMUzVJzHXphdNF6Cc6YM3");
            equal(deriveXKey(root, "m/0'"), "xprv9v7aNJU85KgnkrGKiEJMTnZJMSpbAvQdcUGm2q4s7Z2ZPA9iTwNdD92ESDXbxLt6WAsjaT5xHQNNgHBmwjgwscmPjE1dDuQ5rVC9Jowgu8q");
            equal(deriveXKey(root, "m/1"), "xprv9v7aNJTyjf9pazc9j5X7CkK3t4ywxLzsWazZL9x8JE1f8f7dsv6xjtWEZN2cahUYqaEkr27oyGfc7Y8KG18B55j7h57W3SdiAvXcztzB7MV");
            equal(deriveXKey(root, "m/44'/0'/0'"), "xprv9zAN5JC2upM319x3bsP9aa1jbE9MoyXNuSkm9rTggLBgUSHwsvigCrwb3VJHpkb5KLteb9jwCpXnk7kS5ac3Av8Vn5UG2PgTdrxb9wPeipW");
            equal(deriveXKey(root, "m/44'/0'/1'"), "xprv9zAN5JC2upM355bhe2xJWyzEVg7SD15PxVkN6FWPTjFPAkKoNoxPmxvC76SK6k7HDc1WQhYaXYyEUTTuVLYbKomAna5pFbDJCMVzfKHfZUS");
            let pub = "xpub6D9iUoivkBuLHZgAk4VJt7vy3hwvcToFKifxtdv124nN3YewvMGeKmEfxLVZFLTCzQLS9NBwUzFVi66w5YnHM5o3y9GwQJSfroev539tkUZ";
            equal(deriveXKey(pub, "m/0"), "xpub6FPUvcox6BxqQCt2GRHTdy5ehEKr3JRX1DjZTUutrRh8VsWNS6tfNZd5ZctuDZhm5dRdepkwBgz77p8dVmNuMbBifts556S6jy3gERc3Tfy");
            equal(deriveXKey(pub, "m/0/3/4"), "xpub6J7BeAMm9AYT56iBvZ8ceMksXimevjhcV9yCWM7UdkFZXWDvNHb7qLkFwwewtZp8bVKhsqZfHfvZN6KpT59BuQy4e93pP3AoXk8uzCu8aPJ");
            equal(deriveXKey(pub, "m/0/3/4", {base58: false}).hex(),
                decodeBase58("xpub6J7BeAMm9AYT56iBvZ8ceMksXimevjhcV9yCWM7UdkFZXWDvNHb7qLkFwwewtZp8bVKhsqZfHfvZN6KpT59BuQy4e93pP3AoXk8uzCu8aPJ",
                    {checkSum: true, hex: false}).hex());
            pub = "ppub6D9iUoivkBuLHZgAk4VJt7vy3hwvcToFKifxtdv124nN3YewvMGeKmEfxLVZFLTCzQLS9NBwUzFVi66w5YnHM5o3y9GwQJSfroev539tkUZ";
            expect(() => xPrivateToXPublicKey(deriveXKey(pub, "m/0/3/4"))).to.throw('invalid');
        });
        it('publicFromXPublicKey', () => {
           equal(publicFromXPublicKey("xpub6BP3EN8n7YTGYKL7nK9yUekCr9ixHK3taG2ATSkE5XjM7K12YMigC9pqUhj2K2f4TRg8xvDfqpHsWsjBHoMdJ6QF9dfSeKALRiTFAi9dA5T"),
               "02832b4cd1990dc9ffb7624bdc33e19061836f237f5ccd8730777a10bfca88944c");
        });
        it('privateFromXPrivateKey', () => {
            equal(privateFromXPrivateKey("xprv9xPgprbtHAtyKqFegHcy7WoUJ7tTsrL3D36Zf4LcXCCNEWfszpQReMWMdSpjE9qosHonUirqo418nd6vG46yi34nbHQ8wvWjLLjzMBFKNqM"),
                "L2BfXTBFwabUYoGkXKeR34f3TBpcThLtnC8yf6ZURvM952x8sWmz");
            equal(privateFromXPrivateKey("tprv8ZgxMBicQKsPf9QH73JoCxLYNjipEn1SHkWWfvsryrNCSbh8gBvfeTg5CrqqTpsEQZFBUxH8NuQ5EJz8EDHC261tgtvnfBNze2Jteoxhi47"),
                "cNu63US2f9jLLwDeD9321q1S5xviXCxSyem2GkFJjcF8DTWxqteC");
            equal(privateKeyToWif(privateFromXPrivateKey("tprv8ZgxMBicQKsPf9QH73JoCxLYNjipEn1SHkWWfvsryrNCSbh8gBvfeTg5CrqqTpsEQZFBUxH8NuQ5EJz8EDHC261tgtvnfBNze2Jteoxhi47",
                {wif: false}), {testnet: true}),
                 "cNu63US2f9jLLwDeD9321q1S5xviXCxSyem2GkFJjcF8DTWxqteC");
            equal(privateKeyToWif(privateFromXPrivateKey("xprv9xPgprbtHAtyKqFegHcy7WoUJ7tTsrL3D36Zf4LcXCCNEWfszpQReMWMdSpjE9qosHonUirqo418nd6vG46yi34nbHQ8wvWjLLjzMBFKNqM",
                {wif: false}), {testnet: false}),
                "L2BfXTBFwabUYoGkXKeR34f3TBpcThLtnC8yf6ZURvM952x8sWmz");
            expect(() => privateFromXPrivateKey("qprv8ZgxMBicQKsPf9QH73JoCxLYNjipEn1SHkWWfvsryrNCSbh8gBvfeTg5CrqqTpsEQZFBUxH8NuQ5EJz8EDHC261tgtvnfBNze2Jteoxhi47")).to.throw('invalid');
        });

        it('isXPrivateKeyValid', () => {
            equal(isXPrivateKeyValid("xprv9xPgprbtHAtyKqFegHcy7WoUJ7tTsrL3D36Zf4LcXCCNEWfszpQReMWMdSpjE9qosHonUirqo418nd6vG46yi34nbHQ8wvWjLLjzMBFKNqM"), true);
            equal(isXPrivateKeyValid("tprv8ZgxMBicQKsPf9QH73JoCxLYNjipEn1SHkWWfvsryrNCSbh8gBvfeTg5CrqqTpsEQZFBUxH8NuQ5EJz8EDHC261tgtvnfBNze2Jteoxhi47"), true);
            equal(isXPrivateKeyValid("yprvAJXHiBz6oBHZouVo25rgayS7ss1FGAkAsPMrtpTX7DrAHqocTrusQmMNuA2VoJyxJ9jsfAQFRFoRrDFKAhNoVgvhLYSZ5LWqQJy7fYUzRW8"), true);
            equal(isXPrivateKeyValid("uprv8tXDerPXZ1QsWSbPwQ6RR3S3YhsGBPzwCs2jTKmkMrk5VhWMvr6EGXLDE4oRTjX9pCMzERsgqZkd7bbgwuhCpKhVZEdDF6CUukNY3RLytkD"), true);
            equal(isXPrivateKeyValid("zprvAc4DSBwiaXyw2RdtM1CDXgzUe4BMm6K33G91Dr8PHCx8LiJLW8jYtUpdfrjuDy9ega3Pyg3xiNiEZCL3hSw1JWRzKxnz7k9hsnsH8R1Ckwk"), true);
            equal(isXPrivateKeyValid("vprv9DMUxX4ShgxMMjnWmkt3d8XYig1i81zS7yYxEifdjs7xYoKbBWFntazMFGm1TeB5DqUnyuUFJE7AztDFfc7DcZP6RaKdq11yBUSBRvwZLXe"), true);
            equal(isXPrivateKeyValid("qprv9DMUxX4ShgxMMjnWmkt3d8XYig1i81zS7yYxEifdjs7xYoKbBWFntazMFGm1TeB5DqUnyuUFJE7AztDFfc7DcZP6RaKdq11yBUSBRvwZLXe"), false);
            equal(isXPrivateKeyValid(""), false);
            equal(isXPrivateKeyValid("1212qsdbfnn,i;p/"), false);
        });

        it('isXPublicKeyValid', () => {
            equal(isXPublicKeyValid("xpub68isDcaF29MCeYMdJ6ZypmjogsM6bgx3ssCZyRyT4JYqPZcSkEQtKx6ag1FHnirP8tz9VNAn7cuJhBKf63ijyw1FPg2Po36TcuX725Mom1X"), true);
            equal(isXPublicKeyValid("tpubD6NzVbkrYhZ4YcS4zgyPcMzewmEkQ7CLs47HxSvAQ8AbH5wuJakFpxHwNyXDSmSDzNQmkKx2unk3xTDNN716cAKbgr6CyPm3hsAW4CqPVK2"), true);
            equal(isXPublicKeyValid("ypub6TZ8XHFAAptgVqYk8TMc2rqJrqVYYJwYnyinkpsLSJviSfRfztaSx1kihDCsndWJYY6xEqmLaHFraTwDok8knAgrG1ipNwuwtdakQibcvzB"), true);
            equal(isXPublicKeyValid("upub57Wa4MvRPNyAivfs3RdRnBNn6jhkarina5xLFiBMvCH4NVqWUPQUpKeh5KZfvYXDyYXStKeUzhrMcQt4p9upL1pW2EFdY8eMJjPA8UKuxaL"), true);
            equal(isXPublicKeyValid("zpub6nPPpwv5KWSAM8jrxp9EEwvp2odzUvw3i6F1YDmDpKJbVmEuFYk1a5QriRATnYADxBDkzKMu2wcQTkYnXSYmaQNT8MRExrjSAMePoDv2d2R"), true);
            equal(isXPublicKeyValid("vpub5SLqN2bLY4WeaDrysnR3zGUHGhrCXUiHVCUZ375FJCewRbejj3a3SPJq6XXFvTB9PBeFdoF3TNCuVhVdXrKq8FW6tZx483TqaTSoWx3U88j"), true);
            equal(isXPublicKeyValid("qpub5SLqN2bLY4WeaDrysnR3zGUHGhrCXUiHVCUZ375FJCewRbejj3a3SPJq6XXFvTB9PBeFdoF3TNCuVhVdXrKq8FW6tZx483TqaTSoWx3U88j"), false);
            equal(isXPublicKeyValid(""), false);
            equal(isXPublicKeyValid("1212qsdbfnn,i;p/"), false);
        });

        it('pathXKeyTo_BIP32_XKey', () => {
            equal(pathXKeyTo_BIP32_XKey("xpub68isDcaF29MCeYMdJ6ZypmjogsM6bgx3ssCZyRyT4JYqPZcSkEQtKx6ag1FHnirP8tz9VNAn7cuJhBKf63ijyw1FPg2Po36TcuX725Mom1X"),
                "xpub68isDcaF29MCeYMdJ6ZypmjogsM6bgx3ssCZyRyT4JYqPZcSkEQtKx6ag1FHnirP8tz9VNAn7cuJhBKf63ijyw1FPg2Po36TcuX725Mom1X");
            equal(pathXKeyTo_BIP32_XKey("tpubD6NzVbkrYhZ4YcS4zgyPcMzewmEkQ7CLs47HxSvAQ8AbH5wuJakFpxHwNyXDSmSDzNQmkKx2unk3xTDNN716cAKbgr6CyPm3hsAW4CqPVK2"),
                "tpubD6NzVbkrYhZ4YcS4zgyPcMzewmEkQ7CLs47HxSvAQ8AbH5wuJakFpxHwNyXDSmSDzNQmkKx2unk3xTDNN716cAKbgr6CyPm3hsAW4CqPVK2");
            equal(pathXKeyTo_BIP32_XKey("ypub6TZ8XHFAAptgVqYk8TMc2rqJrqVYYJwYnyinkpsLSJviSfRfztaSx1kihDCsndWJYY6xEqmLaHFraTwDok8knAgrG1ipNwuwtdakQibcvzB"),
                "xpub68isDcaF29MCeYMdJ6ZypmjogsM6bgx3ssCZyRyT4JYqPZcSkEQtKx6ag1FHnirP8tz9VNAn7cuJhBKf63ijyw1FPg2Po36TcuX725Mom1X");
            equal(pathXKeyTo_BIP32_XKey("upub57Wa4MvRPNyAivfs3RdRnBNn6jhkarina5xLFiBMvCH4NVqWUPQUpKeh5KZfvYXDyYXStKeUzhrMcQt4p9upL1pW2EFdY8eMJjPA8UKuxaL"),
                "tpubD6NzVbkrYhZ4YcS4zgyPcMzewmEkQ7CLs47HxSvAQ8AbH5wuJakFpxHwNyXDSmSDzNQmkKx2unk3xTDNN716cAKbgr6CyPm3hsAW4CqPVK2");
            equal(pathXKeyTo_BIP32_XKey("zpub6nPPpwv5KWSAM8jrxp9EEwvp2odzUvw3i6F1YDmDpKJbVmEuFYk1a5QriRATnYADxBDkzKMu2wcQTkYnXSYmaQNT8MRExrjSAMePoDv2d2R"),
                "xpub68isDcaF29MCeYMdJ6ZypmjogsM6bgx3ssCZyRyT4JYqPZcSkEQtKx6ag1FHnirP8tz9VNAn7cuJhBKf63ijyw1FPg2Po36TcuX725Mom1X");
            equal(pathXKeyTo_BIP32_XKey("vpub5SLqN2bLY4WeaDrysnR3zGUHGhrCXUiHVCUZ375FJCewRbejj3a3SPJq6XXFvTB9PBeFdoF3TNCuVhVdXrKq8FW6tZx483TqaTSoWx3U88j"),
                "tpubD6NzVbkrYhZ4YcS4zgyPcMzewmEkQ7CLs47HxSvAQ8AbH5wuJakFpxHwNyXDSmSDzNQmkKx2unk3xTDNN716cAKbgr6CyPm3hsAW4CqPVK2");

            equal(pathXKeyTo_BIP32_XKey("xprv9xPgprbtHAtyKqFegHcy7WoUJ7tTsrL3D36Zf4LcXCCNEWfszpQReMWMdSpjE9qosHonUirqo418nd6vG46yi34nbHQ8wvWjLLjzMBFKNqM"),
                "xprv9xPgprbtHAtyKqFegHcy7WoUJ7tTsrL3D36Zf4LcXCCNEWfszpQReMWMdSpjE9qosHonUirqo418nd6vG46yi34nbHQ8wvWjLLjzMBFKNqM");
            equal(pathXKeyTo_BIP32_XKey("tprv8ZgxMBicQKsPf9QH73JoCxLYNjipEn1SHkWWfvsryrNCSbh8gBvfeTg5CrqqTpsEQZFBUxH8NuQ5EJz8EDHC261tgtvnfBNze2Jteoxhi47"),
                "tprv8ZgxMBicQKsPf9QH73JoCxLYNjipEn1SHkWWfvsryrNCSbh8gBvfeTg5CrqqTpsEQZFBUxH8NuQ5EJz8EDHC261tgtvnfBNze2Jteoxhi47");
            equal(pathXKeyTo_BIP32_XKey("yprvAJXHiBz6oBHZouVo25rgayS7ss1FGAkAsPMrtpTX7DrAHqocTrusQmMNuA2VoJyxJ9jsfAQFRFoRrDFKAhNoVgvhLYSZ5LWqQJy7fYUzRW8"),
                "xprv9yh2QXKBeVk5xcJgBj54NtLchtroKYkfxGqe7RZdjDUHEjzPDCkJnhhEsx4uoQL2tWd4ugogxbSsxvdkSzxnhTF6UCk8VRhM8auUGwuyZMC");
            equal(pathXKeyTo_BIP32_XKey("uprv8tXDerPXZ1QsWSbPwQ6RR3S3YhsGBPzwCs2jTKmkMrk5VhWMvr6EGXLDE4oRTjX9pCMzERsgqZkd7bbgwuhCpKhVZEdDF6CUukNY3RLytkD"),
                "tprv8ZgxMBicQKsPf9QH73JoCxLYNjipEn1SHkWWfvsryrNCSbh8gBvfeTg5CrqqTpsEQZFBUxH8NuQ5EJz8EDHC261tgtvnfBNze2Jteoxhi47");
            equal(pathXKeyTo_BIP32_XKey("zprvAc4DSBwiaXyw2RdtM1CDXgzUe4BMm6K33G91Dr8PHCx8LiJLW8jYtUpdfrjuDy9ega3Pyg3xiNiEZCL3hSw1JWRzKxnz7k9hsnsH8R1Ckwk"),
                "xprv9xPgprbtHAtyKqFegHcy7WoUJ7tTsrL3D36Zf4LcXCCNEWfszpQReMWMdSpjE9qosHonUirqo418nd6vG46yi34nbHQ8wvWjLLjzMBFKNqM");
            equal(pathXKeyTo_BIP32_XKey("vprv9DMUxX4ShgxMMjnWmkt3d8XYig1i81zS7yYxEifdjs7xYoKbBWFntazMFGm1TeB5DqUnyuUFJE7AztDFfc7DcZP6RaKdq11yBUSBRvwZLXe"),
                "tprv8ZgxMBicQKsPf9QH73JoCxLYNjipEn1SHkWWfvsryrNCSbh8gBvfeTg5CrqqTpsEQZFBUxH8NuQ5EJz8EDHC261tgtvnfBNze2Jteoxhi47");
            expect(() => pathXKeyTo_BIP32_XKey("qprv8ZgxMBicQKsPf9QH73JoCxLYNjipEn1SHkWWfvsryrNCSbh8gBvfeTg5CrqqTpsEQZFBUxH8NuQ5EJz8EDHC261tgtvnfBNze2Jteoxhi47")).to.throw('invalid');

            equal(encodeBase58(pathXKeyTo_BIP32_XKey("vprv9DMUxX4ShgxMMjnWmkt3d8XYig1i81zS7yYxEifdjs7xYoKbBWFntazMFGm1TeB5DqUnyuUFJE7AztDFfc7DcZP6RaKdq11yBUSBRvwZLXe",
                {base58: false}), {checkSum: true}),
                "tprv8ZgxMBicQKsPf9QH73JoCxLYNjipEn1SHkWWfvsryrNCSbh8gBvfeTg5CrqqTpsEQZFBUxH8NuQ5EJz8EDHC261tgtvnfBNze2Jteoxhi47");

        });

        it('pathXKeyTo_BIP32_XKey', () => {
            equal(BIP32_XKeyToPathXKey("xpub68isDcaF29MCeYMdJ6ZypmjogsM6bgx3ssCZyRyT4JYqPZcSkEQtKx6ag1FHnirP8tz9VNAn7cuJhBKf63ijyw1FPg2Po36TcuX725Mom1X", "BIP44"),
                "xpub68isDcaF29MCeYMdJ6ZypmjogsM6bgx3ssCZyRyT4JYqPZcSkEQtKx6ag1FHnirP8tz9VNAn7cuJhBKf63ijyw1FPg2Po36TcuX725Mom1X");
            equal(BIP32_XKeyToPathXKey("tpubD6NzVbkrYhZ4YcS4zgyPcMzewmEkQ7CLs47HxSvAQ8AbH5wuJakFpxHwNyXDSmSDzNQmkKx2unk3xTDNN716cAKbgr6CyPm3hsAW4CqPVK2", "BIP44"),
                "tpubD6NzVbkrYhZ4YcS4zgyPcMzewmEkQ7CLs47HxSvAQ8AbH5wuJakFpxHwNyXDSmSDzNQmkKx2unk3xTDNN716cAKbgr6CyPm3hsAW4CqPVK2");
            equal(BIP32_XKeyToPathXKey("xpub68isDcaF29MCeYMdJ6ZypmjogsM6bgx3ssCZyRyT4JYqPZcSkEQtKx6ag1FHnirP8tz9VNAn7cuJhBKf63ijyw1FPg2Po36TcuX725Mom1X", "BIP49"),
                "ypub6TZ8XHFAAptgVqYk8TMc2rqJrqVYYJwYnyinkpsLSJviSfRfztaSx1kihDCsndWJYY6xEqmLaHFraTwDok8knAgrG1ipNwuwtdakQibcvzB");
            equal(BIP32_XKeyToPathXKey("tpubD6NzVbkrYhZ4YcS4zgyPcMzewmEkQ7CLs47HxSvAQ8AbH5wuJakFpxHwNyXDSmSDzNQmkKx2unk3xTDNN716cAKbgr6CyPm3hsAW4CqPVK2", "BIP49"),
                "upub57Wa4MvRPNyAivfs3RdRnBNn6jhkarina5xLFiBMvCH4NVqWUPQUpKeh5KZfvYXDyYXStKeUzhrMcQt4p9upL1pW2EFdY8eMJjPA8UKuxaL");
            equal(BIP32_XKeyToPathXKey("xpub68isDcaF29MCeYMdJ6ZypmjogsM6bgx3ssCZyRyT4JYqPZcSkEQtKx6ag1FHnirP8tz9VNAn7cuJhBKf63ijyw1FPg2Po36TcuX725Mom1X", "BIP84"),
                "zpub6nPPpwv5KWSAM8jrxp9EEwvp2odzUvw3i6F1YDmDpKJbVmEuFYk1a5QriRATnYADxBDkzKMu2wcQTkYnXSYmaQNT8MRExrjSAMePoDv2d2R");
            equal(BIP32_XKeyToPathXKey("tpubD6NzVbkrYhZ4YcS4zgyPcMzewmEkQ7CLs47HxSvAQ8AbH5wuJakFpxHwNyXDSmSDzNQmkKx2unk3xTDNN716cAKbgr6CyPm3hsAW4CqPVK2", "BIP84"),
                "vpub5SLqN2bLY4WeaDrysnR3zGUHGhrCXUiHVCUZ375FJCewRbejj3a3SPJq6XXFvTB9PBeFdoF3TNCuVhVdXrKq8FW6tZx483TqaTSoWx3U88j");


            equal(BIP32_XKeyToPathXKey("xprv9xPgprbtHAtyKqFegHcy7WoUJ7tTsrL3D36Zf4LcXCCNEWfszpQReMWMdSpjE9qosHonUirqo418nd6vG46yi34nbHQ8wvWjLLjzMBFKNqM", "BIP44"),
                "xprv9xPgprbtHAtyKqFegHcy7WoUJ7tTsrL3D36Zf4LcXCCNEWfszpQReMWMdSpjE9qosHonUirqo418nd6vG46yi34nbHQ8wvWjLLjzMBFKNqM");
            equal(BIP32_XKeyToPathXKey("tprv8ZgxMBicQKsPf9QH73JoCxLYNjipEn1SHkWWfvsryrNCSbh8gBvfeTg5CrqqTpsEQZFBUxH8NuQ5EJz8EDHC261tgtvnfBNze2Jteoxhi47", "BIP44"),
                "tprv8ZgxMBicQKsPf9QH73JoCxLYNjipEn1SHkWWfvsryrNCSbh8gBvfeTg5CrqqTpsEQZFBUxH8NuQ5EJz8EDHC261tgtvnfBNze2Jteoxhi47");

            equal(BIP32_XKeyToPathXKey("xprv9xPgprbtHAtyKqFegHcy7WoUJ7tTsrL3D36Zf4LcXCCNEWfszpQReMWMdSpjE9qosHonUirqo418nd6vG46yi34nbHQ8wvWjLLjzMBFKNqM", "BIP49"),
                "yprvAHDx8XGoRrSTB8SmWeQbKbtyU62upUKY89cnSTEVuCaFHcV7FUZzGRAVeenKE4VjGvvbECTQFiMgfuiUykWzWGkPTd6ZXqLDc4odjkNZA2Z");
            equal(BIP32_XKeyToPathXKey("tprv8ZgxMBicQKsPf9QH73JoCxLYNjipEn1SHkWWfvsryrNCSbh8gBvfeTg5CrqqTpsEQZFBUxH8NuQ5EJz8EDHC261tgtvnfBNze2Jteoxhi47", "BIP49"),
                "uprv8tXDerPXZ1QsWSbPwQ6RR3S3YhsGBPzwCs2jTKmkMrk5VhWMvr6EGXLDE4oRTjX9pCMzERsgqZkd7bbgwuhCpKhVZEdDF6CUukNY3RLytkD");

            equal(BIP32_XKeyToPathXKey("xprv9xPgprbtHAtyKqFegHcy7WoUJ7tTsrL3D36Zf4LcXCCNEWfszpQReMWMdSpjE9qosHonUirqo418nd6vG46yi34nbHQ8wvWjLLjzMBFKNqM", "BIP84"),
                "zprvAc4DSBwiaXyw2RdtM1CDXgzUe4BMm6K33G91Dr8PHCx8LiJLW8jYtUpdfrjuDy9ega3Pyg3xiNiEZCL3hSw1JWRzKxnz7k9hsnsH8R1Ckwk");
            equal(encodeBase58(BIP32_XKeyToPathXKey("tprv8ZgxMBicQKsPf9QH73JoCxLYNjipEn1SHkWWfvsryrNCSbh8gBvfeTg5CrqqTpsEQZFBUxH8NuQ5EJz8EDHC261tgtvnfBNze2Jteoxhi47", "BIP84", {base58: false}), {checkSum: true}),
                "vprv9DMUxX4ShgxMMjnWmkt3d8XYig1i81zS7yYxEifdjs7xYoKbBWFntazMFGm1TeB5DqUnyuUFJE7AztDFfc7DcZP6RaKdq11yBUSBRvwZLXe");

            expect(() => BIP32_XKeyToPathXKey("tpubD6NzVbkrYhZ4YcS4zgyPcMzewmEkQ7CLs47HxSvAQ8AbH5wuJakFpxHwNyXDSmSDzNQmkKx2unk3xTDNN716cAKbgr6CyPm3hsAW4CqPVK2", "BIP384")).to.throw('unsupported');
            expect(() => BIP32_XKeyToPathXKey("kpubD6NzVbkrYhZ4YcS4zgyPcMzewmEkQ7CLs47HxSvAQ8AbH5wuJakFpxHwNyXDSmSDzNQmkKx2unk3xTDNN716cAKbgr6CyPm3hsAW4CqPVK2", "BIP84")).to.throw('invalid');

        });

    });

    describe("Shamir secret sharing functions:", function () {

        it('GF256 field math', () => {
            for (let i = 1; i < 256; i++) equal(1, __GF256_mul(i, __GF256_inverse(i)));

            for (let i = 1; i < 256; i++)
                for (let j = 1; j < 256; j++) {
                    let a = __GF256_div(i, j);
                    let b = __GF256_mul(a, j);
                    equal(i, b);
                    a = __GF256_add(i, j);
                    b = __GF256_sub(a, j);
                    equal(i, b);
                }

            let k = 2;
            for (let i = 2; i < 256; i++) {
                let a = __GF256_pow(k, i);
                let b = k;
                for (let j = 0; j < i-1; j++) b = __GF256_mul(b, k);
                equal(b, a);
            }

        });

        it('Secret splitting', () => {
            let secret = Buffer.from("w", 'utf8');
            for (let i = 0 ; i < 1000; i++) {
                let shares = __split_secret(5, 5, secret);
                let s = __restore_secret(shares);
                equal(s.toString('utf8'), secret.toString('utf8'));
            }
            secret = Buffer.from("w36575hrhgdivgsidyufgiuhgvsufgoyirsgfiusgrf", 'utf8');
            for (let i = 0 ; i < 1000; i++) {
                let shares = __split_secret(5, 5, secret);
                let s = __restore_secret(shares);
                equal(s.toString('utf8'), secret.toString('utf8'));
            }
            secret = Buffer.from("Super puper secret for splitting test", 'utf8');
            for (let i = 2; i < 30; i++) {
                let t =  Math.floor(Math.random() * (30 - i )) + i;
                let shares = __split_secret(i, t, secret);
                let r = __restore_secret(shares);
                equal(r.toString('utf8'), secret.toString('utf8'));
            }

            for (let i = 2; i < 30; i++) {
                let t =  Math.floor(Math.random() * (30 - i )) + i;
                let shares = __split_secret(i, t, secret);
                let s = {};
                let keys = []
                for (let k in shares) keys.push(k);
                do {
                    let i = keys[Math.floor(Math.random() * (Object.keys(shares).length))];
                    s[i] = shares[i];
                } while (Object.keys(s).length < i);
                let r = __restore_secret(s);
                equal(r.toString('utf8'), secret.toString('utf8'));

            }

            for (let i = 2; i < 30; i++) {
                let t =  Math.floor(Math.random() * (30 - i )) + i;
                let shares = __split_secret(i, t, secret);
                let s = {};
                let keys = [];
                for (let k in shares) keys.push(k);
                do {
                    let i = keys[Math.floor(Math.random() * (Object.keys(shares).length) )];

                    s[i] = shares[i];
                } while (Object.keys(s).length < i);
                let r = __restore_secret(s);
                equal(r.toString('utf8'), secret.toString('utf8'));

            }
        }).timeout(14000);
    });

    describe("Private/Public key functions:", function () {
        it('privateKeyToWif', () => {
            equal(privateKeyToWif("ceda1ae4286015d45ec5147fe3f63e9377ccd6d4e98bcf0847df9937da1944a4"),
                'L49obCXV7fGz2YRzLCSJgeZBYmGeBbKPT7xiehUeYX2S4URkPFZX');
            equal(privateKeyToWif("ceda1ae4286015d45ec5147fe3f63e9377ccd6d4e98bcf0847df9937da1944a4",
                {compressed: true, testnet: false}),
                'L49obCXV7fGz2YRzLCSJgeZBYmGeBbKPT7xiehUeYX2S4URkPFZX');
            equal(privateKeyToWif("ceda1ae4286015d45ec5147fe3f63e9377ccd6d4e98bcf0847df9937da1944a4",
                {compressed: false, testnet: false}),
                '5KPPLXhtga99qqMceRo4Z6LXV3Kx6a9hRx3ez2U7EwP5KZfy2Wf');
            equal(privateKeyToWif("ceda1ae4286015d45ec5147fe3f63e9377ccd6d4e98bcf0847df9937da1944a4",
                {compressed: true, testnet: true}),
                'cUWo47XLYiyFByuFicFS3y4FAza3r3R5XA7Bm7wA3dgSKDYox7h6');
            equal(privateKeyToWif("ceda1ae4286015d45ec5147fe3f63e9377ccd6d4e98bcf0847df9937da1944a4",
                {compressed: false, testnet: true}),
                '93A1vGXSGoDHotruGmgyRgtV8hgfFjgtmtuc4epcag886W9d44L');
            let m = Buffer.from("ceda1ae4286015d45ec5147fe3f63e9377ccd6d4e98bcf0847df9937da1944a4", 'hex');
            equal(privateKeyToWif(m, {compressed: false, testnet: true}),
                '93A1vGXSGoDHotruGmgyRgtV8hgfFjgtmtuc4epcag886W9d44L');
        });

        it('createPrivateKey + wifToPrivateKey', () => {
            let wk = createPrivateKey();
            let k = wifToPrivateKey(wk);
            equal(privateKeyToWif(k), wk);
            wk = createPrivateKey({testnet: 1});
            k = wifToPrivateKey(wk);
            equal(privateKeyToWif(k, {testnet: 1}), wk);
            wk = createPrivateKey({compressed: 0});
            k = wifToPrivateKey(wk);
            equal(privateKeyToWif(k, {compressed: 0}), wk);
            wk = createPrivateKey({compressed: 0, testnet: 1});
            k = wifToPrivateKey(wk);
            equal(privateKeyToWif(k, {compressed: 0, testnet: 1}), wk);
            wk = createPrivateKey({compressed: 0, testnet: 1, wif: 0});
            equal((wk instanceof Buffer), true);
        });

        it('isWifValid', () => {
            equal(isWifValid("L49obCXV7fGz2YRzLCSJgeZBYmGeBbKPT7xiehUeYX2S4URkPFZX"), true);
            equal(isWifValid("5KPPLXhtga99qqMceRo4Z6LXV3Kx6a9hRx3ez2U7EwP5KZfy2Wf"), true);
            equal(isWifValid("5KPPLXhtga99qqMcWRo4Z6LXV3Kx6a9hRx3ez2U7EwP5KZfy2Wf"), false);
            equal(isWifValid("93A1vGXSGoDHotruGmgyRgtV8hgfFjgtmtuc4epcag886W9d44L"), true);
            equal(isWifValid("cUWo47XLYiyFByuFicFS3y4FAza3r3R5XA7Bm7wA3dgSKDYox7h6"), true);
            equal(isWifValid("cUWo47XLYiyFByuFicFS3y4FAza3r3R5XA7Bm7wA3dgSKDYox7h6"), true);
            equal(isWifValid("cUWo47X@YiyByuFicFS3y4FAza3r3R5XA7Bm7wA3dgSKDYox7h6"), false);
            equal(isWifValid("cUWo47XLYiyFByuFicFS3y4FAza3r3R5XA7Bm7wA3dgSKDYox7h9"), false);
            equal(isWifValid(44), false);
        });

        it('privateToPublicKey', () => {
            let priv = "ceda1ae4286015d45ec5147fe3f63e9377ccd6d4e98bcf0847df9937da1944a4";
            let pu = "04b635dbdc16dbdf4bb9cf5b55e7d03e514fb04dcef34208155c7d3ec88e9045f4c8cbe28702911260f2a1da099a338bed4ee98f66bb8dba8031a76ab537ff6663";
            let pk = "03b635dbdc16dbdf4bb9cf5b55e7d03e514fb04dcef34208155c7d3ec88e9045f4";
            equal(privateToPublicKey(priv), pk);
            equal(privateToPublicKey(priv, {hex: true}), pk);
            equal(privateToPublicKey(priv, {hex: false}).equals(Buffer.from(pk, 'hex')), true);
            equal(privateToPublicKey(priv, {compressed: false}), pu);
            equal(privateToPublicKey("L49obCXV7fGz2YRzLCSJgeZBYmGeBbKPT7xiehUeYX2S4URkPFZX"), pk);
            equal(privateToPublicKey("5KPPLXhtga99qqMceRo4Z6LXV3Kx6a9hRx3ez2U7EwP5KZfy2Wf"), pu);
            equal(privateToPublicKey("93A1vGXSGoDHotruGmgyRgtV8hgfFjgtmtuc4epcag886W9d44L"), pu);
            expect(() => privateToPublicKey(45)).to.throw('invalid');


        });

        it('isPublicKeyValid', () => {
            let pu = "04b635dbdc16dbdf4bb9cf5b55e7d03e514fb04dcef34208155c7d3ec88e9045f4c8cbe28702911260f2a1da099a338bed4ee98f66bb8dba8031a76ab537ff6663";
            let pk = "03b635dbdc16dbdf4bb9cf5b55e7d03e514fb04dcef34208155c7d3ec88e9045f4";
            equal(isPublicKeyValid(pu), true);
            equal(isPublicKeyValid(pk), true);
            equal(isPublicKeyValid(Buffer.from(pu, 'hex')), true);
            equal(isPublicKeyValid(Buffer.from(pk, 'hex')), true);
            pu = "63qdbdc16dbdf4bb9cf45b55e7d03e514fb04dcef34208155c7d3ec88e9045f4c8cbe28702911260f2a1da099a338bed4ee98f66bb8dba8031a76ab537ff6663";
            pk = "02b635dbdc16dbdf455bb9cf5b55e7d03e514fb04dcef34208155c7d3ec88e9045f4";
            equal(isPublicKeyValid(pu), false);
            equal(isPublicKeyValid(pk), false);
            equal(isPublicKeyValid("8798"), false);
        });

        it('publicKeyAdd', () => {
            let p = "035347c6b364a977a5a41814459c2107bd64271e4923a94615855aa8d6a5b14d1f";
            let tweak = "21db3d0c73b6923e1594651bdbccea4891d5c0e0b25329a4b26a920d528bc77c";
            equal("0394b69f5ba9ca08614b3197e2bf10a44e51544cb6cf20c6125dfd0b693e91b667", publicKeyAdd(p,tweak));
            p = "04102e8f5e416cc8c6eea0e65581b9d2a2d0980a9189f9650391218f0c9c149e799717b1cf812e3a72f09b023ef62785f55a7f4f314b6f76908ab0fe4618dfa74d";
            tweak = "21db3d0c73b6923e1594651bdbccea4891d5c0e0b25329a4b26a920d528bc77c";
            equal("031de63c13ca530d77cc9ede1a8315e5358d461a86dcd0f3daa6454ec6409aa558", publicKeyAdd(p,tweak));
            equal("041de63c13ca530d77cc9ede1a8315e5358d461a86dcd0f3daa6454ec6409aa5580dd0318c7e809022de26d0f6d59f66d0b10176e243d479a34cbca5b0f2ab51cf",
                publicKeyAdd(p,tweak, {compressed: false}));
        });
    });

    describe("Address functions:", function () {
        it('hashToAddress', () => {
            let OP = OPCODE;
            let B = Buffer.from

            let pc = "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798";
            let s = Buffer.concat([B([pc.length / 2]), B(pc, 'hex'), B([OP.OP_CHECKSIG])])
            let h = hash160(pc);
            equal(hashToAddress(h), "bgl1qw508d6qejxtdg4y5r3zarvary0c5xw7k0fy5a3");
            equal(hashToAddress(h, {testnet: true}), "tbgl1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx");
            let pk = "03b635dbdc16dbdf4bb9cf5b55e7d03e514fb04dcef34208155c7d3ec88e9045f4";
            h = hash160(pk);
            equal(hashToAddress(h, {witnessVersion: null}), "1Fs2Xqrk4P2XADaJeZWykaGXJ4HEb6RyT1");
            equal(hashToAddress(h, {
                witnessVersion: null,
                testnet: true
            }), "mvNyptwisQTmwL3vN8VMaVUrA3swVCX83c");
            equal(hashToAddress(h, {
                witnessVersion: null,
                testnet: true,
                scriptHash: true
            }), "2N87FX8HDDjrFTAuHSnoSo9cievn7uAM8rV");
            expect(() => hashToAddress(h.hex() + "00")).to.throw('length incorrect');
            expect(() => hashToAddress(h.hex() + "00", {witnessVersion: null})).to.throw('length incorrect');

            equal(hashToAddress(h, {
                testnet: true,
                witnessVersion: null
            }), "mvNyptwisQTmwL3vN8VMaVUrA3swVCX83c");
            let p = "L32a8Mo1LgvjrVDbzcc3NkuUfkpoLsf2Y2oEWkV4t1KpQdFzuyff";
            pk = privateToPublicKey(p, {hex: false});
            let script = Buffer.concat([Buffer.from([0, 20]), hash160(pk)]);
            let scriptHash = hash160(script);
            equal(hashToAddress(scriptHash, {testnet: false, scriptHash: true, witnessVersion: null}),
                "33am12q3Bncnn3BfvLYHczyv23Sq2Wbwjw");
            expect(() => hashToAddress("test non hex input")).to.throw('encoding required');

            let test = false;
            try {
                hashToAddress("test non hex input", {testnet: false, scriptHash: true, witnessVersion: null})

            } catch (e) {
                test = true;
            }
            equal(true, test);
            equal(hashToAddress(scriptHash.hex(), {
                    testnet: false,
                    scriptHash: true,
                    witnessVersion: null
                }),
                "33am12q3Bncnn3BfvLYHczyv23Sq2Wbwjw");

        });

        it('addressToHash', () => {
            let h = "751e76e8199196d454941c45d1b3a323f1433bd6";
            equal(addressToHash("bgl1qw508d6qejxtdg4y5r3zarvary0c5xw7k0fy5a3", {hex: true}), h);
            equal(addressToHash("tbgl1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx", {hex: true}), h);
            // todo test p2wsh
            // h = "1863143c14c5166804bd19203356da136c985678cd4d27a1b8c6329604903262";
            // equal(addressToHash("bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3", {hex: true}), h);
            h = "a307d67484911deee457779b17505cedd20e1fe9";
            equal(addressToHash("1Fs2Xqrk4P2XADaJeZWykaGXJ4HEb6RyT1", {hex: true}), h);
            equal(addressToHash("mvNyptwisQTmwL3vN8VMaVUrA3swVCX83c", {hex: true}), h);
            h = "14c14c8d26acbea970757b78e6429ad05a6ac6bb";
            equal(addressToHash("33am12q3Bncnn3BfvLYHczyv23Sq2Wbwjw", {hex: true}), h);
            equal(addressToHash("2Mu8y4mm4oF88yppDbUAAEwyBEPezrx7CLh", {hex: true}), h);

            expect(() => addressToHash(90)).to.throw('invalid');
            equal(addressToHash("QM1u8y4mm4oF88yppDbUAAEwyBEPezrx7CLh"), null);
        });

        it('publicKeyToAddress', () => {
            let cpub = "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798";
            expect(() => publicKeyToAddress("02qqbe667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798")).to.throw('encoding required');
            equal(publicKeyToAddress(cpub), "bgl1qw508d6qejxtdg4y5r3zarvary0c5xw7k0fy5a3");
            equal(publicKeyToAddress(cpub, {testnet: true}), "tbgl1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx");
            equal(publicKeyToAddress(Buffer.from(cpub, 'hex'), {testnet: true}), "tbgl1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx");
            cpub = "03b635dbdc16dbdf4bb9cf5b55e7d03e514fb04dcef34208155c7d3ec88e9045f4";
            equal(publicKeyToAddress(cpub, {witnessVersion: null}), "1Fs2Xqrk4P2XADaJeZWykaGXJ4HEb6RyT1");
            equal(publicKeyToAddress(cpub, {
                witnessVersion: null,
                testnet: true
            }), "mvNyptwisQTmwL3vN8VMaVUrA3swVCX83c");
            let priv = "L32a8Mo1LgvjrVDbzcc3NkuUfkpoLsf2Y2oEWkV4t1KpQdFzuyff";
            equal(publicKeyToAddress(privateToPublicKey(priv), {
                p2sh_p2wpkh: true,
                witnessVersion: null
            }), "33am12q3Bncnn3BfvLYHczyv23Sq2Wbwjw");
            expect(() => publicKeyToAddress(privateToPublicKey(priv, {compressed: false}), {p2sh_p2wpkh: true})).to.throw('length invalid');
            expect(() => publicKeyToAddress(privateToPublicKey(priv, {compressed: false}), {
                p2sh_p2wpkh: false,
                witnessVersion: 0
            })).to.throw('length invalid');
            expect(() => publicKeyToAddress(privateToPublicKey(cpub + "00", {compressed: false}))).to.throw('length invalid');
            priv = "5HrHm3Q2jUnvZPPKKDNkSSLoCqh5QyP7nvFGzHNxgw27ffPJjce";
            equal(publicKeyToAddress(privateToPublicKey(priv), {witnessVersion: null}), "1HMkFegHBraqmvvX3FP9q2Q9CymB9T9y8g");

        });

        it('addressType', () => {
            equal(addressType("bgl1qw508d6qejxtdg4y5r3zarvary0c5xw7k0fy5a3"), 'P2WPKH');
            equal(addressType("tbgl1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx"), 'P2WPKH');
            // equal(addressType("bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3"), 'P2WSH');
            // equal(addressType("tb1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sl5k7"), 'P2WSH');
            equal(addressType("1Fs2Xqrk4P2XADaJeZWykaGXJ4HEb6RyT1"), 'P2PKH');
            equal(addressType("mvNyptwisQTmwL3vN8VMaVUrA3swVCX83c"), 'P2PKH');
            equal(addressType("33am12q3Bncnn3BfvLYHczyv23Sq2Wbwjw"), 'P2SH');
            equal(addressType("2Mu8y4mm4oF88yppDbUAAEwyBEPezrx7CLh"), 'P2SH');
            equal(addressType("rMu8y4mm4oF88yppDbUAAEwyBEPezrx7CLh"), 'NON_STANDARD');
            let C = SCRIPT_TYPES;
            // equal(addressType("bgl1qw508d6qejxtdg4y5r3zarvary0c5xw7k0fy5a3", {num: true}), C['P2WPKH']);
            // equal(addressType("tbgl1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx", {num: true}), C['P2WPKH']);
            // equal(addressType("bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3", {num: true}), C['P2WSH']);
            // equal(addressType("tb1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sl5k7", {num: true}), C['P2WSH']);

            equal(addressType("1Fs2Xqrk4P2XADaJeZWykaGXJ4HEb6RyT1", {num: true}), C['P2PKH']);
            equal(addressType("mvNyptwisQTmwL3vN8VMaVUrA3swVCX83c", {num: true}), C['P2PKH']);
            equal(addressType("33am12q3Bncnn3BfvLYHczyv23Sq2Wbwjw", {num: true}), C['P2SH']);
            equal(addressType("2Mu8y4mm4oF88yppDbUAAEwyBEPezrx7CLh", {num: true}), C['P2SH']);
            equal(addressType("rMu8y4mm4oF88yppDbUAAEwyBEPezrx7CLh", {num: true}), C['NON_STANDARD']);
        });

        it('addressNetType', () => {
            equal(addressNetType("bgl1qw508d6qejxtdg4y5r3zarvary0c5xw7k0fy5a3"), 'mainnet');
            equal(addressNetType("tbgl1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx"), 'testnet');
            // equal(addressNetType("bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3"), 'mainnet');
            // equal(addressNetType("tb1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sl5k7"), 'testnet');
            equal(addressNetType("1Fs2Xqrk4P2XADaJeZWykaGXJ4HEb6RyT1"), 'mainnet');
            equal(addressNetType("mvNyptwisQTmwL3vN8VMaVUrA3swVCX83c"), 'testnet');
            equal(addressNetType("33am12q3Bncnn3BfvLYHczyv23Sq2Wbwjw"), 'mainnet');
            equal(addressNetType("2Mu8y4mm4oF88yppDbUAAEwyBEPezrx7CLh"), 'testnet');
            equal(addressNetType("rMu8y4mm4oF88yppDbUAAEwyBEPezrx7CLh"), null);
        });

        it('addressToScript', () => {
            equal(addressToScript("17rPqUf4Hqu6Lvpgfsavt1CzRy2GL19GD3", {'hex': true}),
                '76a9144b2832feeda5692c96c0594a6314136a998f515788ac');
            equal(addressToScript("33RYUa9jT541UNPsKdV7V1DmwMiQHpVfD3", {'hex': true}),
                'a914130319921ecbcfa33fec2a8503c4ae1c86e4419387');
            equal(addressToScript("bgl1qw508d6qejxtdg4y5r3zarvary0c5xw7k0fy5a3", {'hex': true}),
                '0014751e76e8199196d454941c45d1b3a323f1433bd6');
            equal(addressToScript("17rPqUf4Hqu6Lvpgfsavt1CzRy2GL19GD3").hex(),
                '76a9144b2832feeda5692c96c0594a6314136a998f515788ac');
            equal(addressToScript("33RYUa9jT541UNPsKdV7V1DmwMiQHpVfD3").hex(),
                'a914130319921ecbcfa33fec2a8503c4ae1c86e4419387');
            equal(addressToScript("bgl1qw508d6qejxtdg4y5r3zarvary0c5xw7k0fy5a3").hex(),
                '0014751e76e8199196d454941c45d1b3a323f1433bd6');
            expect(() => addressToScript("bd6qejxtdg4y5r3zarvary0c5xw7kv8f3t4").hex()).to.throw('address invalid');
            expect(() => addressToScript(45)).to.throw('address invalid');

        });

        it('getWitnessVersion', () => {
            equal(getWitnessVersion("bgl1qw508d6qejxtdg4y5r3zarvary0c5xw7k0fy5a3"), 0);
        });

        it('isAddressValid', () => {
            equal(isAddressValid("bgl1qw508d6qejxtdg4y5r3zarvary0c5xw7k0fy5a3"), true);
            equal(isAddressValid("tbgl1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx", {testnet: true}), true);
            equal(isAddressValid("tbgl1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx"), false);
            // equal(isAddressValid("bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3"), true);
            // equal(isAddressValid("tb1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sl5k7", {testnet: true}), true);
            equal(isAddressValid("1Fs2Xqrk4P2XADaJeZWykaGXJ4HEb6RyT1"), true);
            equal(isAddressValid("mvNyptwisQTmwL3vN8VMaVUrA3swVCX83c", {testnet: true}), true);
            equal(isAddressValid("33am12q3Bncnn3BfvLYHczyv23Sq2Wbwjw"), true);
            equal(isAddressValid(54), false);
            equal(isAddressValid("33am12q3Bncnn3BfvLYHczyv23Sq2WWbwjw"), false);
            equal(isAddressValid("2Mu8y4mm4oF88yppDbUAAEwyBEPezrx7CLh", {testnet: true}), true);
            equal(isAddressValid("2Mu8y4mm4oF89yppDbUAAEwyBEPezrx7CLh"), false);
            equal(isAddressValid("2Mu8y4mm4oF89yppDbUAAEwyBEPezrx7CCLh"), false);
            equal(isAddressValid("bgl1qw508d6qejxtdg4y5r3zarvary0c5xw7k0fy5a3", {testnet: true}), false);
            equal(isAddressValid("tb1qw508d6qejxtdg4W5r3zarvary0c5xw7kxpjzsx", {testnet: true}), false);
            equal(isAddressValid("bc1qrp33g0q5c5txsp8arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3"), false);
            equal(isAddressValid("TB1QRP23G0Q5C5TXSP9ARYSRX4K6ZDKFS4NCE4XJ0GDCCCEFVPYSXF3Q0SL5K7", {testnet: true}), false);
            equal(isAddressValid("TB1QRP23G0Q5C5TXSP9ARYSRX4K6ZDKFS4NCE4XJ0GDCCCEFVPYSXF3Q0sL5K7", {testnet: true}), false);
            equal(isAddressValid("tb1", {testnet: true}), false);
            equal(isAddressValid("tbqqrp23g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sl5k7", {testnet: true}), false);
            equal(isAddressValid("1Fs2Xqrk4P2XADaJeZWykaGXJ2HEb6RyT1"), false);
            equal(isAddressValid("mvNyptwisQTkwL3vN8VMaVUrA3swVCX83c", {testnet: true}), false);
            equal(isAddressValid("33am12q3Bncmn3BfvLYHczyv23Sq2Wbwjw", {testnet: true}), false);
            equal(isAddressValid("33am12q3Bncmn3BfvLYHczyv23Sq2Wbwjw"), false);
            equal(isAddressValid("73am12q3Bncmn3BfvLYHczyv23Sq2Wbwjw"), false);
            equal(isAddressValid("2Mu8y4mm4oF78yppDbUAAEwyBEPezrx7CLh", {testnet: true}), false);
        });
    });

    describe("Script functions:", function () {
        it('hashToScript', () => {
            let h = "751e76e8199196d454941c45d1b3a323f1433bd6";
            equal(hashToScript(h, 0, {'hex': true}), '76a914751e76e8199196d454941c45d1b3a323f1433bd688ac');
            equal(hashToScript(h, 1, {'hex': true}), 'a914751e76e8199196d454941c45d1b3a323f1433bd687');
            equal(hashToScript(h, 5, {'hex': true}), '0014751e76e8199196d454941c45d1b3a323f1433bd6');
            equal(hashToScript(h, 6, {'hex': true}), '0014751e76e8199196d454941c45d1b3a323f1433bd6');
            equal(hashToScript(h, 6).toString("hex"), '0014751e76e8199196d454941c45d1b3a323f1433bd6');
            equal(hashToScript(h, "P2PKH", {'hex': true}), '76a914751e76e8199196d454941c45d1b3a323f1433bd688ac');
            equal(hashToScript(h, "P2SH", {'hex': true}), 'a914751e76e8199196d454941c45d1b3a323f1433bd687');
            equal(hashToScript(h, "P2WPKH", {'hex': true}), '0014751e76e8199196d454941c45d1b3a323f1433bd6');
            expect(() => hashToScript(h, 90)).to.throw('unsupported script type');

        });
        it('publicKeyTo_P2SH_P2WPKH_Script', () => {
            let p = "0003b635dbdc16dbdf4bb9cf5b55e7d03e514fb04dcef34208155c7d3ec88e9045f4";
            expect(() => publicKeyTo_P2SH_P2WPKH_Script(p)).to.throw('public key len invalid');
            p = "03b635dbdc16dbdf4bb9cf5b55e7d03e514fb04dcef34208155c7d3ec88e9045f4";
            equal(publicKeyTo_P2SH_P2WPKH_Script(p, {hex: true}), "0014a307d67484911deee457779b17505cedd20e1fe9");
            equal(publicKeyTo_P2SH_P2WPKH_Script(p).hex(), "0014a307d67484911deee457779b17505cedd20e1fe9");
        });
        it('publicKeyTo_PUBKEY_Script', () => {
            let p = "0338f42586b2d10fe2ad08c170750c9317a01e59563b9e322a943b8043c7f59380";
            let s = "210338f42586b2d10fe2ad08c170750c9317a01e59563b9e322a943b8043c7f59380ac";
            equal(publicKeyTo_PUBKEY_Script(p, {hex: true}), s);
        });
        it('parseScript', () => {
            let O = OPCODE;
            let H = hexToBytes;
            let f = parseScript
            equal(f([O.OP_RETURN, 0x00]).type, "NULL_DATA");
            equal(f([O.OP_RETURN, 0x00]).data.hex(), "");
            equal(f([O.OP_RETURN].concat(H('203132333435363738393031323334353637383930313233343536373839303132'))).type,
                "NULL_DATA");
            equal(f([O.OP_RETURN].concat(H('203132333435363738393031323334353637383930313233343536373839303132'))).data.hex(),
                "3132333435363738393031323334353637383930313233343536373839303132");
            equal(f([O.OP_RETURN].concat(H('2031323334353637383930313233343536373839303132333435363738393031323131'))).type,
                "NULL_DATA_NON_STANDARD");
            equal(f([O.OP_RETURN, O.OP_PUSHDATA1, 0x00]).type, "NULL_DATA");
            equal(f([O.OP_RETURN, O.OP_PUSHDATA1, 0x00]).data.hex(), "");
            let k = H("203132333435363738393031323334353637383930313233343536373839303132");
            let r = "3132333435363738393031323334353637383930313233343536373839303132";
            equal(f([O.OP_RETURN, O.OP_PUSHDATA1].concat(k)).type, "NULL_DATA");
            equal(f([O.OP_RETURN, O.OP_PUSHDATA1].concat(k)).data.hex(), r);
            k = H('2031323334353637383930313233343536373839303132333435363738393031323131');
            equal(f([O.OP_RETURN, O.OP_PUSHDATA1].concat(k)).type, "NULL_DATA_NON_STANDARD");
            k = H('503132333435363738393031323334353637383930313233343536373839303132333435363738393031323334353637383930313233343536373839303132333435363738393031323334353637383930');
            r = '3132333435363738393031323334353637383930313233343536373839303132333435363738393031323334353637383930313233343536373839303132333435363738393031323334353637383930';
            equal(f([O.OP_RETURN, O.OP_PUSHDATA1].concat(k)).type, "NULL_DATA");
            equal(f([O.OP_RETURN, O.OP_PUSHDATA1].concat(k)).data.hex(), r);
            k = H('51313233343536373839303132333435363738393031323334353637383930313233343536373839303132333435363738393031323334353637383930313233343536373839303132333435363738393031');
            equal(f([O.OP_RETURN, O.OP_PUSHDATA1].concat(k)).type, "NULL_DATA_NON_STANDARD");
            let s = Buffer.from("a914546fbecb877edbe5777bc0ce4c8be6989d8edd9387", 'hex');
            equal(f(s).type, "P2SH");
            s = "a914546fbecb877edbe5777bc0ce4c8be6989d8edd9387";
            equal(f(s).nType, 1);
            equal(f(s).addressHash.hex(), '546fbecb877edbe5777bc0ce4c8be6989d8edd93');
            equal(f(s).reqSigs, null);
            s = "76a9143053ef41e2106fb5fea261c8ee3fd44f007b5ee688ac";
            equal(f(s).type, "P2PKH");
            equal(f(s).nType, 0);
            equal(f(s).reqSigs, 1);
            equal(f(s).addressHash.hex(), '3053ef41e2106fb5fea261c8ee3fd44f007b5ee6');
            s = "410496b538e853519c726a2c91e61ec11600ae1390813a627c66fb8be7947be63c52da7589379515d4e0a604f8141781e62294721166bf621e73a82cbf2342c858eeac";
            equal(f(s).type, "PUBKEY");
            equal(f(s).nType, 2);
            equal(f(s).reqSigs, 1);
            equal(f(s).addressHash.hex(), '119b098e2e980a229e139a9ed01a469e518e6f26');
            s = "00142ac50173769ba101bb2a2e7b32f158eb8c77d8a4";
            equal(f(s).type, "P2WPKH");
            equal(f(s).nType, 5);
            equal(f(s).reqSigs, 1);
            equal(f(s).addressHash.hex(), '2ac50173769ba101bb2a2e7b32f158eb8c77d8a4');
            s = "0020701a8d401c84fb13e6baf169d59684e17abd9fa216c8cc5b9fc63d622ff8c58d";
            equal(f(s).type, "P2WSH");
            equal(f(s).nType, 6);
            equal(f(s).reqSigs, null);
            equal(f(s).addressHash.hex(), '701a8d401c84fb13e6baf169d59684e17abd9fa216c8cc5b9fc63d622ff8c58d')

            s = "512102953397b893148acec2a9da8341159e9e7fb3d32987c3563e8bdf22116213623";
            s += "441048da561da64584fb1457e906bc2840a1f963b401b632ab98761d12d74dd795bbf";
            s += "410c7b6d6fd39acf9d870cb9726578eaf8ba430bb296eac24957f3fb3395b8b042060";
            s += "466616fb675310aeb024f957b4387298dc28305bc7276bf1f7f662a6764bcdffb6a97";
            s += "40de596f89ad8000f8fa6741d65ff1338f53eb39e98179dd18c6e6be8e3953ae";
            equal(f(s).type, "MULTISIG");
            equal(f(s).nType, 4);
            equal(f(s).reqSigs, 1);

            s = "5f210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c";
            s += "71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c";
            s += "71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c";
            s += "71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c";
            s += "71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c";
            s += "71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c";
            s += "71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c";
            s += "71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c";
            s += "71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c";
            s += "71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c";
            s += "71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c";
            s += "71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c";
            s += "71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c";
            s += "71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c";
            s += "71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c";
            s += "715fae";
            equal(f(s).type, "MULTISIG");
            equal(f(s).nType, 4);
            equal(f(s).reqSigs, 15);
            s = "0114410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc34550114ae";

            equal(f(s).type, "NON_STANDARD");
            equal(f(s).nType, 7);
            equal(f(s).reqSigs, 20);
        });
        it('scriptToAddress', () => {
            equal(scriptToAddress("76a914f18e5346e6efe17246306ce82f11ca53542fe00388ac"),
                "1P2EMAeiSJEfCrtjC6ovdWaGWW1Mb6azpX");
            equal(scriptToAddress("a9143f4eecba122ad73039d481c8d37f99cb4f887cd887"),
                "37Tm3Qz8Zw2VJrheUUhArDAoq58S6YrS3g");
            equal(scriptToAddress("76a914a307d67484911deee457779b17505cedd20e1fe988ac", {testnet: true}),
                "mvNyptwisQTmwL3vN8VMaVUrA3swVCX83c");
            equal(scriptToAddress("0014751e76e8199196d454941c45d1b3a323f1433bd6"),
                "bgl1qw508d6qejxtdg4y5r3zarvary0c5xw7k0fy5a3");
            equal(scriptToAddress("0020701a8d401c84fb13e6baf169d59684e17abd9fa216c8cc5b9fc63d622ff8c58d"),
                "bgl1qwqdg6squsna38e46795at95yu9atm8azzmyvckulcc7kytlcckxsczae2r");
        });
        it('decodeScript', () => {
            equal(decodeScript('76a9143520dd524f6ca66f63182bb23efff6cc8ee3ee6388ac'),
                "OP_DUP OP_HASH160 [20] OP_EQUALVERIFY OP_CHECKSIG");
            equal(decodeScript('76a9143520dd524f6ca66f63182bb23efff6cc8ee3ee6388ac', {asm: true}),
                "OP_DUP OP_HASH160 OP_PUSHBYTES[20] 3520dd524f6ca66f63182bb23efff6cc8ee3ee63 OP_EQUALVERIFY OP_CHECKSIG");
            equal(decodeScript('a91469f37572ab1b69f304f987b119e2450e0b71bf5c87'),
                "OP_HASH160 [20] OP_EQUAL");
            equal(decodeScript('a91469f37572ab1b69f304f987b119e2450e0b71bf5c87', {asm: true}),
                "OP_HASH160 OP_PUSHBYTES[20] 69f37572ab1b69f304f987b119e2450e0b71bf5c OP_EQUAL");

            equal(decodeScript('6a144279b52d6ee8393a9a755e8c6f633b5dd034bd67'),
                "OP_RETURN [20]");
            equal(decodeScript('6a144279b52d6ee8393a9a755e8c6f633b5dd034bd67', {asm: true}),
                "OP_RETURN OP_PUSHBYTES[20] 4279b52d6ee8393a9a755e8c6f633b5dd034bd67");
            let s = "6a4c51000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
            equal(decodeScript(s,), "OP_RETURN OP_PUSHDATA1 [81]");
            equal(decodeScript(s, {asm: true}), "OP_RETURN OP_PUSHDATA1[81] 000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
            s = "5f210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c715fae"
            equal(decodeScript(s,), "OP_15 [33] [33] [33] [33] [33] [33] [33] [33] [33] [33] [33] [33] [33] [33] [33] OP_15 OP_CHECKMULTISIG");
            equal(decodeScript(s, {asm: true}), 'OP_15 OP_PUSHBYTES[33] 0378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71 OP_PUSHBYTES[33] 0378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71 OP_PUSHBYTES[33] 0378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71 OP_PUSHBYTES[33] 0378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71 OP_PUSHBYTES[33] 0378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71 OP_PUSHBYTES[33] 0378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71 OP_PUSHBYTES[33] 0378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71 OP_PUSHBYTES[33] 0378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71 OP_PUSHBYTES[33] 0378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71 OP_PUSHBYTES[33] 0378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71 OP_PUSHBYTES[33] 0378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71 OP_PUSHBYTES[33] 0378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71 OP_PUSHBYTES[33] 0378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71 OP_PUSHBYTES[33] 0378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71 OP_PUSHBYTES[33] 0378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71 OP_15 OP_CHECKMULTISIG');
            equal(decodeScript('00144160bb1870159a08724557f75c7bb665a3a132e0',), "OP_0 [20]");
            equal(decodeScript('0020cdbf909e935c855d3e8d1b61aeb9c5e3c03ae8021b286839b1a72f2e48fdba70',), "OP_0 [32]");

        });
        it('signMessage', () => {
            let s = "3044022047ac8e878352d3ebbde1c94ce3a10d057c24175747116f8288e5d794d12d482f0220217f36a485cae903c713331d877c1f64677e3622ad4010726870540656fe9dcb";
            equal(signMessage("64f3b0f4dd2bb3aa1ce8566d220cc74dda9df97d8490cc81d89d735c92e59fb6",
                "eb696a065ef48a2192da5b28b694f87544b30fae8327c4510137a922f32c6dcf", {hex: true}).signature, s);
            equal(signMessage("64f3b0f4dd2bb3aa1ce8566d220cc74dda9df97d8490cc81d89d735c92e59fb6",
                "eb696a065ef48a2192da5b28b694f87544b30fae8327c4510137a922f32c6dcf", {hex: true}).recId, 0);

        });
        it('verifySignature', () => {
            let p = "eb696a065ef48a2192da5b28b694f87544b30fae8327c4510137a922f32c6dcf";
            let s = "3044022047ac8e878352d3ebbde1c94ce3a10d057c24175747116f8288e5d794d12d482f0220217f36a485cae903c713331d877c1f64677e3622ad4010726870540656fe9dcb";
            let msg = "64f3b0f4dd2bb3aa1ce8566d220cc74dda9df97d8490cc81d89d735c92e59fb6";
            equal(verifySignature(s, privateToPublicKey(p), msg), true);

            let priv = "7b56e2b7bd189f4491d43a1d209e6268046df1741f61b6397349d7aa54978e76";

            s = signMessage(msg, priv, {hex: true}).signature;
            equal(s, "304402202c843bd163b57910bff132cf84ef32c65b4ea1abefa8810accb6f1ace677078b0220338fe888b4165a187cbb7f882b6b099e63d99e25e0a6bdf2917665f9f66ea77f");
            equal(verifySignature(s, privateToPublicKey(priv), msg), true);
        });
        it('publicKeyRecovery', () => {
            let s = "3044022047ac8e878352d3ebbde1c94ce3a10d057c24175747116f8288e5d794d12d482f0220217f36a485cae903c713331d877c1f64677e3622ad4010726870540656fe9dcb";
            equal(signMessage("64f3b0f4dd2bb3aa1ce8566d220cc74dda9df97d8490cc81d89d735c92e59fb6",
                "eb696a065ef48a2192da5b28b694f87544b30fae8327c4510137a922f32c6dcf", {hex: true}).signature, s);


            let p = "eb696a065ef48a2192da5b28b694f87544b30fae8327c4510137a922f32c6dcf";
            s = "3044022047ac8e878352d3ebbde1c94ce3a10d057c24175747116f8288e5d794d12d482f0220217f36a485cae903c713331d877c1f64677e3622ad4010726870540656fe9dcb";
            let msg = "64f3b0f4dd2bb3aa1ce8566d220cc74dda9df97d8490cc81d89d735c92e59fb6";
            let r = signMessage("64f3b0f4dd2bb3aa1ce8566d220cc74dda9df97d8490cc81d89d735c92e59fb6",
                "eb696a065ef48a2192da5b28b694f87544b30fae8327c4510137a922f32c6dcf", {hex: true}).recId;
            equal(publicKeyRecovery(s, msg, r, {hex: true}), privateToPublicKey(p, {hex: true}));
        });

        it('Delete from script', () => {
            let BF = Buffer.from, O = OPCODE;
            let s = BF([O.OP_FALSE, O.OP_1]);
            let d = BF([]);
            equal(deleteFromScript(s,d).hex(), s.hex());

            s = BF([O.OP_1, O.OP_2, O.OP_3]);
            d = BF([O.OP_2]);
            let e =  BF([O.OP_1, O.OP_3]);
            equal(deleteFromScript(s,d).hex(), e.hex());

            s = BF([O.OP_3, O.OP_1, O.OP_3, O.OP_3, O.OP_4, O.OP_3]);
            d = BF([O.OP_3]);
            e =  BF([O.OP_1, O.OP_4]);
            equal(deleteFromScript(s,d).hex(), e.hex());

            s = "0302ff03";
            d = "0302ff03";
            e = "";
            equal(deleteFromScript(s,d).hex(), e);

            s = "0302ff030302ff03";
            d = "0302ff03";
            e = "";
            equal(deleteFromScript(s,d).hex(), e);

            s = "0302ff030302ff03";
            d = "02";
            equal(deleteFromScript(s,d).hex(), s);

            s = "0302ff030302ff03";
            d = "ff";
            equal(deleteFromScript(s,d).hex(), s);

            s = "0302ff030302ff03";
            d = "03";
            e = "02ff0302ff03";
            equal(deleteFromScript(s,d).hex(), e);

            s = "02feed5169";
            d = "feed51";
            e = s;
            equal(deleteFromScript(s,d).hex(), e);

            s = "02feed5169";
            d = "02feed51";
            e = "69";
            equal(deleteFromScript(s,d).hex(), e);

            s = "516902feed5169";
            d = "feed51";
            e = s;
            equal(deleteFromScript(s,d).hex(), e);

            s = "516902feed5169";
            d = "02feed51";
            e = "516969";
            equal(deleteFromScript(s,d).hex(), e);

            s = "0003feed";
            d = "03feed";
            e = "00";
            equal(deleteFromScript(s,d).hex(), e);

            s = "0003feed";
            d = "00";
            e = "03feed";
            equal(deleteFromScript(s,d).hex(), e);

            s = BF([O.OP_0, O.OP_0, O.OP_1, O.OP_1]);
            d = BF([O.OP_0, O.OP_1]);
            e = d;
            equal(deleteFromScript(s,d).hex(), e.hex());

            s = BF([O.OP_0, O.OP_0, O.OP_1, O.OP_0, O.OP_1, O.OP_1]);
            d = BF([O.OP_0, O.OP_1]);
            e = d;
            equal(deleteFromScript(s,d).hex(), e.hex());
        });

        it('bitcoinMessage', () => {
            let s = "ee5e7a356fdfff83d3635fe977e826d2d7964a9af94e772921e5521c06c9577c";
            equal(bitcoinMessage('test message www').hex(), s);
            s = signBitcoinMessage('test message www', "KyTZwSK5ypXcozECtm69BXHg1PnKTyCxa8qv5uvzmwdp1eVGe4Ed");
            let sig = "H5Sj3kHPdoYQywVcs7JarMP9GaIkRebE6Ioj56l5F4vESaiBUERbXzh3Bgj7fqkGALdZf1onFhNpXpbXv6KjvOM=";
            equal(s, sig);
            let w = bitcoinSignedMessageAddresses('test message www', sig);
            equal(w[0], "bgl1qnr76ecc0lwadc3czch9wpdj26xc7gkzlhl72yf");
            equal(w[1], "1Ewwbq8XmfL4skiB7ERG8yX1Xc8auodZx1");
            equal(w[2], "35HqEmYKSPoJWcVSDH1szCccXWtBJ7kcBm");
            s = "H5Sj3kHPdoYQywVcs7JarMP9GaIkRebE6Ioj56l5F4vESaiBUERbXzh3Bgj7fqkGALdZf1onFhNpXpbXv6KjvOM=";
            equal(verifyBitcoinMessage('test message www', s, "bgl1qnr76ecc0lwadc3czch9wpdj26xc7gkzlhl72yf"), true);
            equal(verifyBitcoinMessage('test message www', s, "1Ewwbq8XmfL4skiB7ERG8yX1Xc8auodZx1"), true);
            equal(verifyBitcoinMessage('test message www', s, "35HqEmYKSPoJWcVSDH1szCccXWtBJ7kcBm"), true);
            equal(verifyBitcoinMessage('test message www2', s, "bgl1qnr76ecc0lwadc3czch9wpdj26xc7gkzlhl72yf"), false);
            s = signBitcoinMessage('test message www', "5JGpXumZnRq16qJ1RcjGbiippFScmAc1fw3nGqqKgTvBrMQk7XF");
            equal(verifyBitcoinMessage('test message www', s, "1bVp115hvcWCKf3JRMhcWFRrxZFZJ2VQA"), true);

        });
    });

    describe("Address classes:", function () {
        it('PrivateKey', () => {
            let h = "7B56E2B7BD189F4491D43A1D209E6268046DF1741F61B6397349D7AA54978E76";
            equal(new PrivateKey(h, {'compressed': true, testnet: false}).wif,
                'L1MU1jUjUwZ6Fd1L2HDZ8qH4oSWxct5boCQ4C87YvoSZbTW41hg4');

            equal(new PrivateKey(h, {'compressed': false, testnet: false}).wif,
                '5Jkc7xqsrqA5pGQdwDHSQXRV3pUBLTXVjBjqJUSVz3pUmyuAFwP');
            equal(new PrivateKey('5Jkc7xqsrqA5pGQdwDHSQXRV3pUBLTXVjBjqJUSVz3pUmyuAFwP').compressed, false);
            equal(new PrivateKey(h, {'compressed': true, testnet: true}).wif,
                'cRiTUeUav1FMR4UbQh2gW9n8RfpNHLBHsEYXJYa4Rv6ZrCdTPGqv');

            equal(new PrivateKey(h, {'compressed': false, testnet: true}).wif,
                '92XEhhfRT4EDnKuvZZBMH7yShUptVd4h58bnP6o1KnZXYzkVa55');

            equal(new PrivateKey("L1MU1jUjUwZ6Fd1L2HDZ8qH4oSWxct5boCQ4C87YvoSZbTW41hg4",
                {'compressed': false, testnet: true}).wif,
                'L1MU1jUjUwZ6Fd1L2HDZ8qH4oSWxct5boCQ4C87YvoSZbTW41hg4');
        });

        it('PublicKey', () => {
            let cpk = "02a8fb85e98c99b79150df12fde488639d8445c57babef83d53c66c1e5c818eeb4";
            let ucpk = "04a8fb85e98c99b79150df12fde488639d8445c57babef83d53c66c1e5c818eeb43bbd96a641808e5f34eb568e804fe679de82de419e2512736ea09013a82324a6";
            equal(new PublicKey("7b56e2b7bd189f4491d43a1d209e6268046df1741f61b6397349d7aa54978e76", {'compressed': false}).hex, ucpk);
            equal(new PublicKey("7b56e2b7bd189f4491d43a1d209e6268046df1741f61b6397349d7aa54978e76", {'compressed': false}).key.hex(), ucpk);
            equal(new PublicKey("7b56e2b7bd189f4491d43a1d209e6268046df1741f61b6397349d7aa54978e76", {'compressed': false}).compressed, false);
            equal(new PublicKey("7b56e2b7bd189f4491d43a1d209e6268046df1741f61b6397349d7aa54978e76", {'compressed': false}).testnet, false);
            equal(new PublicKey(Buffer.from("7b56e2b7bd189f4491d43a1d209e6268046df1741f61b6397349d7aa54978e76", 'hex'), {'compressed': false}).compressed, false);
            equal(new PublicKey("L1MU1jUjUwZ6Fd1L2HDZ8qH4oSWxct5boCQ4C87YvoSZbTW41hg4", {'compressed': true}).hex, cpk);
            equal(new PublicKey("L1MU1jUjUwZ6Fd1L2HDZ8qH4oSWxct5boCQ4C87YvoSZbTW41hg4", {'compressed': false}).hex, cpk);
            equal(new PublicKey(new PrivateKey("L1MU1jUjUwZ6Fd1L2HDZ8qH4oSWxct5boCQ4C87YvoSZbTW41hg4")).hex, cpk);
            equal(new PublicKey(ucpk).key.hex(), ucpk);
            equal(new PublicKey(cpk).key.hex(), cpk);
            equal(new PublicKey(ucpk, {compressed: true}).key.hex(), ucpk);

        });

        it('Address', () => {
            let p = new PrivateKey("7b56e2b7bd189f4491d43a1d209e6268046df1741f61b6397349d7aa54978e76", {compressed: false});
            let pub = new PublicKey(p);
            equal(new Address(p, {addressType: "P2PKH"}).address, '17suVjHXyWF9KiGkpRRQW4ysiEqdDkRqo1');
            equal(new Address(p, {addressType: "PUBKEY"}).address, '17suVjHXyWF9KiGkpRRQW4ysiEqdDkRqo1');
            equal(new Address("5JGpXumZnRq16qJ1RcjGbiippFScmAc1fw3nGqqKgTvBrMQk7XF").address,
                  '1bVp115hvcWCKf3JRMhcWFRrxZFZJ2VQA');

            // from public key
            p = new PublicKey('02a8fb85e98c99b79150df12fde488639d8445c57babef83d53c66c1e5c818eeb4');
            equal(new Address(p).address, 'bgl1qxsms4rt5axt9674du2az7vq3pvephu3khufnjr');
            equal(new Address(p, {addressType: "P2PKH"}).address, '15m65JmFohJiioQbzMWhqFeCS3ZL1KVaNh');
            equal(new Address(p, {addressType: "PUBKEY"}).address, '15m65JmFohJiioQbzMWhqFeCS3ZL1KVaNh');
            equal(new Address(p, {addressType: "P2SH_P2WPKH"}).redeemScriptHex, '001434370a8d74e9965d7aade2ba2f30110b321bf236');
            equal(new Address(p, {addressType: "P2SH_P2WPKH"}).publicKey.hex, '02a8fb85e98c99b79150df12fde488639d8445c57babef83d53c66c1e5c818eeb4');

            // from uncompressed public key
            p = new PublicKey('04a8fb85e98c99b79150df12fde488639d8445c57babef83d53c66c1e5c818eeb43bbd96a641808e5f34eb568e804fe679de82de419e2512736ea09013a82324a6');
            equal(new Address(p, {addressType: "P2PKH"}).address, '17suVjHXyWF9KiGkpRRQW4ysiEqdDkRqo1');
            equal(new Address(p, {addressType: "PUBKEY"}).address, '17suVjHXyWF9KiGkpRRQW4ysiEqdDkRqo1');

            let redeem = "5221032bfc25cf7cccc278b26473e2967b8fd403b4b544b836e71abdfebb08d8c96d6921032bfc25cf7cccc278b26473e2967b8fd403b4b544b836e71abdfebb08d8c96d6921032bfc25cf7cccc278b26473e2967b8fd403b4b544b836e71abdfebb08d8c96d6953ae"
            equal(new ScriptAddress(redeem, {witnessVersion: null}).address, '3KCqqS6eznp3ucVPxtNkiYcVg6kQKNX9sg');
            let k = new Address("02a8fb85e98c99b79150df12fde488639d8445c57babef83d53c66c1e5c818eeb4")
            equal(k.address, 'bgl1qxsms4rt5axt9674du2az7vq3pvephu3khufnjr');
        });


    });

    describe("Transactions classes:", function () {
        it('Transaction', () => {


            // let t = "020000000140d43a99926d43eb0e619bf0b3d83b4a31f60c176beecfb9d35bf45e54d0f7420100000017160014a4b4ca48de0b3fffc15404a1acdc8dbaae226955ffffffff0100e1f5050000000017a9144a1154d50b03292b3024370901711946cb7cccc38700000000";
            // let j = {
            //     "format": "decoded",
            //     "testnet": false,
            //     "segwit": false,
            //     "txId": "c586389e5e4b3acb9d6c8be1c19ae8ab2795397633176f5a6442a261bbdefc3a",
            //     "hash": "c586389e5e4b3acb9d6c8be1c19ae8ab2795397633176f5a6442a261bbdefc3a",
            //     "version": '2',
            //     "size": 106,
            //     "vSize": 106,
            //     "bSize": 106,
            //     "lockTime": '0',
            //     "vIn": {
            //         "0": {
            //             "txId": "42f7d0545ef45bd3b9cfee6b170cf6314a3bd8b3f09b610eeb436d92993ad440",
            //             "vOut": 1,
            //             "scriptSig": "160014a4b4ca48de0b3fffc15404a1acdc8dbaae226955",
            //             "sequence": '4294967295',
            //             "scriptSigOpcodes": "[22]",
            //             "scriptSigAsm": "OP_PUSHBYTES[22] 0014a4b4ca48de0b3fffc15404a1acdc8dbaae226955"
            //         }
            //     },
            //     "vOut": {
            //         "0": {
            //             "value": '100000000',
            //             "scriptPubKey": "a9144a1154d50b03292b3024370901711946cb7cccc387",
            //             "nType": 1,
            //             "type": "P2SH",
            //             "addressHash": "4a1154d50b03292b3024370901711946cb7cccc3",
            //             "reqSigs": null,
            //             "address": "38Segwituno6sUoEkh57ycM6K7ej5gvJhM",
            //             "scriptPubKeyOpcodes": "OP_HASH160 [20] OP_EQUAL",
            //             "scriptPubKeyAsm": "OP_HASH160 OP_PUSHBYTES[20] 4a1154d50b03292b3024370901711946cb7cccc3 OP_EQUAL"
            //         }
            //     },
            //     "rawTx": null,
            //     "blockHash": null,
            //     "confirmations": null,
            //     "time": null,
            //     "blockTime": null,
            //     "blockIndex": null,
            //     "coinbase": false,
            //     "fee": null,
            //     "data": null,
            //     "amount": '100000000',
            //     "weight": 424
            // };


            // let tx = new Transaction({rawTx: t});
            // for (let q in j) {
            //     if (tx[q] instanceof Object) continue;
            //     equal(tx[q], j[q]);
            // }

            // for (let q in j.vIn) for (let z in j.vIn[q]) equal(tx.vIn[q][z], j.vIn[q][z]);
            // for (let q in j.vOut) for (let z in j.vOut[q]) equal(tx.vOut[q][z], j.vOut[q][z]);
            //
            // let t = '0200000000010140d43a99926d43eb0e619bf0b3d83b4a31f60c176beecfb9d35bf45e54d0f7420100000017160014a4b4ca48de0b3fffc15404a1acdc8dbaae226955ffffffff0100e1f5050000000017a9144a1154d50b03292b3024370901711946cb7cccc387024830450221008604ef8f6d8afa892dee0f31259b6ce02dd70c545cfcfed8148179971876c54a022076d771d6e91bed212783c9b06e0de600fab2d518fad6f15a2b191d7fbd262a3e0121039d25ab79f41f75ceaf882411fd41fa670a4c672c23ffaf0e361a969cde0692e800000000'
            // let j = {
            //     "format": "decoded",
            //     "testnet": false,
            //     "segwit": true,
            //     "txId": "c586389e5e4b3acb9d6c8be1c19ae8ab2795397633176f5a6442a261bbdefc3a",
            //     "hash": "b759d39a8596b70b3a46700b83e1edb247e17ba58df305421864fe7a9ac142ea",
            //     "version": 2,
            //     "size": 216,
            //     "vSize": 134,
            //     "bSize": 106,
            //     "lockTime": 0,
            //     "vIn": {
            //         "0": {
            //             "txId": "42f7d0545ef45bd3b9cfee6b170cf6314a3bd8b3f09b610eeb436d92993ad440",
            //             "vOut": 1,
            //             "scriptSig": "160014a4b4ca48de0b3fffc15404a1acdc8dbaae226955",
            //             "sequence": 4294967295,
            //             "txInWitness": ["30450221008604ef8f6d8afa892dee0f31259b6ce02dd70c545cfcfed8148179971876c54a022076d771d6e91bed212783c9b06e0de600fab2d518fad6f15a2b191d7fbd262a3e01", "039d25ab79f41f75ceaf882411fd41fa670a4c672c23ffaf0e361a969cde0692e8"],
            //             "scriptSigOpcodes": "[22]",
            //             "scriptSigAsm": "OP_PUSHBYTES[22] 0014a4b4ca48de0b3fffc15404a1acdc8dbaae226955"
            //         }
            //     },
            //     "vOut": {
            //         "0": {
            //             "value": '100000000',
            //             "scriptPubKey": "a9144a1154d50b03292b3024370901711946cb7cccc387",
            //             "nType": 1,
            //             "type": "P2SH",
            //             "addressHash": "4a1154d50b03292b3024370901711946cb7cccc3",
            //             "reqSigs": null,
            //             "address": "38Segwituno6sUoEkh57ycM6K7ej5gvJhM",
            //             "scriptPubKeyOpcodes": "OP_HASH160 [20] OP_EQUAL",
            //             "scriptPubKeyAsm": "OP_HASH160 OP_PUSHBYTES[20] 4a1154d50b03292b3024370901711946cb7cccc3 OP_EQUAL"
            //         }
            //     },
            //     "rawTx": null,
            //     "blockHash": null,
            //     "confirmations": null,
            //     "time": null,
            //     "blockTime": null,
            //     "blockIndex": null,
            //     "coinbase": false,
            //     "fee": null,
            //     "data": null,
            //     "amount": '100000000',
            //     "flag": "01",
            //     "weight": 534
            // };
            // let  tx = new Transaction({rawTx: t});
            // console.log(">>>>", tx.serialize({segwit:false}));
            // tx.encode();
            // tx.decode();
            // for (let q in j) {
            //     if (tx[q] instanceof Object) continue;
            //     equal(tx[q], j[q]);
            // }
            //
            // for (let q in j.vIn) for (let z in j.vIn[q]) {
            //     if (tx.vIn[q][z] instanceof Array) {
            //         for (let p in tx.vIn[q][z]) {
            //             equal(tx.vIn[q][z][p], j.vIn[q][z][p])
            //         }
            //     } else equal(tx.vIn[q][z], j.vIn[q][z]);
            // }
            // for (let q in j.vOut) for (let z in j.vOut[q]) equal(tx.vOut[q][z], j.vOut[q][z]);
            //
            // equal(tx.serialize(), t);


        });
        let rawBlock;

        // it('Download raw block mainnet 520667 size: 1,160,482 bytes - https://bitaps.com/520667', async () => {
        //     let r = await fetch('https://gist.githubusercontent.com/4tochka/ec827a60214fc46eaa3aae71c6ba28bd/raw/93e875692d2a1d21cc561824461f1cda92e25bf3/test%2520block');
        //     let b = await r.text();
        //     rawBlock = Buffer.from(b, 'hex');
        // }).timeout(16000);

        // it('Deserialize block[520667] 2 592 transactions in raw format', () => {
        //     rawBlock.seek(80);
        //     let c =  varIntToInt(rawBlock.readVarInt());
        //     for (let i=0; i<c; i++) new Transaction({rawTx: rawBlock, format: 'raw'});
        // });

        // it('Deserialize block[520667]  2 592 transactions in decoded human readable format', () => {
        //     rawBlock.seek(80);
        //     let c =  varIntToInt(rawBlock.readVarInt());
        //     for (let i=0; i<c; i++) new Transaction({rawTx: rawBlock, format: 'decoded'});
        // });

        // it('Deserialize <-> serialize test block[520667]  2 592 transactions decoded', () => {
        //     rawBlock.seek(80);
        //     let c =  varIntToInt(rawBlock.readVarInt());
        //     for (let i=0; i<c; i++) {
        //         let t = new Transaction({rawTx: rawBlock, format: 'decoded', keepRawTx:true});
        //         equal(t.serialize(), t.rawTx);
        //     }
        // });

        // it('Deserialize <-> serialize test block[520667]  2 592 transactions raw', () => {
        //     rawBlock.seek(80);
        //     let c =  varIntToInt(rawBlock.readVarInt());
        //     for (let i=0; i<c; i++) {
        //         let t = new Transaction({rawTx: rawBlock, format: 'raw', keepRawTx:true});
        //         equal(t.serialize(), t.rawTx.hex());
        //     }
        // });
        //
        // it('Transaction constructor', () => {
        //     let rt = "01000000017a5cd38b31ed002fa41380624d4a8c168a2ea71d8668a9b3fea1d571357d5d00000000006b" +
        //          "483045022100bf7c75ec4c40d2fd1072567c31079ea96666b03f00cb8573f9d81818fb2a612f02204db0" +
        //          "7e03825f2d8a123682b53afdd7671fa31e34e2689b591d667ec6cc8cd646012102ca63094dd002a53748" +
        //          "eae1319c91fd9583bb93a6441621c39085789b354569e1ffffffff02204e00000000000017a9143e6f15" +
        //          "908582f42917ec31e39bf8722fc9d5db3f87763d0900000000001976a914a52dc1cff692810dfe9a918f" +
        //          "6d2dbd3504fb3ffb88ac00000000";
        //     let tx = new Transaction({format:'raw'});
        //     tx.addInput({txId: "005d7d3571d5a1feb3a968861da72e8a168c4a4d628013a42f00ed318bd35c7a",
        //         scriptSig: "483045022100bf7c75ec4c40d2fd1072567c31079ea96666b03f00cb8573f9d81818fb" +
        //         "2a612f02204db07e03825f2d8a123682b53afdd7671fa31e34e2689b591d667ec6cc8c" +
        //         "d646012102ca63094dd002a53748eae1319c91fd9583bb93a6441621c39085789b354569e1"});
        //     tx.addOutput({value: 20000, address: "37P8thrtDXb6Di5E7f4FL3bpzum3fhUvT7"});
        //     tx.addOutput({value: 605558, address: "1G4PJum2iB4giFQFpQj8RqzfbKegvWEJXV"});
        //     equal(tx.serialize({segwit:false, hex:true}), rt);
        //     equal(tx.serialize({segwit:true, hex:true}), rt);
        //     equal(tx.txId.equals(tx.hash), true);
        //     equal(rh2s(tx.txId), "110e34e7cba0d579a32c19429683dad9c3b2d4b03edec85c63a69ef0f9e6a12a");
        //
        //     tx = new Transaction();
        //     tx.addInput({txId: "005d7d3571d5a1feb3a968861da72e8a168c4a4d628013a42f00ed318bd35c7a",
        //     scriptSig: "483045022100bf7c75ec4c40d2fd1072567c31079ea96666b03f00cb8573f9d81818fb" +
        //         "2a612f02204db07e03825f2d8a123682b53afdd7671fa31e34e2689b591d667ec6cc8c" +
        //         "d646012102ca63094dd002a53748eae1319c91fd9583bb93a6441621c39085789b354569e1"})
        //     tx.addOutput({value: 20000, address: "37P8thrtDXb6Di5E7f4FL3bpzum3fhUvT7"});
        //     tx.addOutput({value: 605558, address: "1G4PJum2iB4giFQFpQj8RqzfbKegvWEJXV"});
        //     equal(tx.serialize({segwit:false, hex:true}), rt);
        //     equal(tx.serialize({segwit:true, hex:true}), rt);
        //     equal(tx.txId, tx.hash);
        //     equal(tx.txId, "110e34e7cba0d579a32c19429683dad9c3b2d4b03edec85c63a69ef0f9e6a12a");
        //
        //     tx.encode();
        //     equal(tx.serialize({segwit:false, hex:true}), rt);
        //     equal(tx.serialize({segwit:true, hex:true}), rt);
        //     equal(tx.txId.equals(tx.hash), true);
        //     equal(rh2s(tx.txId), "110e34e7cba0d579a32c19429683dad9c3b2d4b03edec85c63a69ef0f9e6a12a");
        //
        //     tx.decode();
        //     equal(tx.serialize({segwit:false, hex:true}), rt);
        //     equal(tx.serialize({segwit:true, hex:true}), rt);
        //     equal(tx.txId, tx.hash);
        //     equal(tx.txId, "110e34e7cba0d579a32c19429683dad9c3b2d4b03edec85c63a69ef0f9e6a12a");
        //
        //     let rawSegwitView = "0100000000010131f81b1b36f3baf0df1c4825363a427c13fee246f5275ab19bd3d9691cab2f77010" +
        //                   "0000000ffffffff0428032f000000000017a91469f3772509d00c88afbdfd9a962573104c5572aa87" +
        //                   "20a10700000000001976a914b97d5f71eac6f1b9b893815ee2d393cee5b939fc88ac166b060000000" +
        //                   "00017a9148130201b6b9b07e34bae2f1a03ab470b1f6bddf08711df090000000000220020701a8d40" +
        //                   "1c84fb13e6baf169d59684e17abd9fa216c8cc5b9fc63d622ff8c58d040047304402206bc09c33588" +
        //                   "b92f245e18d70538c0eb350bfe3861cec518be85e4268eb1740b602207300db75d81f4a2de93b7c37" +
        //                   "faa0e32a176ca444b24509553e342f70002e44ec014830450221009947103bd40e25b8a54b95624cf" +
        //                   "77199ef674aab4ba53da47280f9208811cdd002207f9dbca0804be6f7c206953971af2a5e538d4b64" +
        //                   "0ba8041264d24bb40e8542ee016952210375e00eb72e29da82b89367947f29ef34afb75e8654f6ea3" +
        //                   "68e0acdfd92976b7c2103a1b26313f430c4b15bb1fdce663207659d8cac749a0e53d70eff01874496" +
        //                   "feff2103c96d495bfdd5ba4145e3e046fee45e84a8a48ad05bd8dbb395c011a32cf9f88053ae00000000";
        //     let rawNonSegwitView = "010000000131f81b1b36f3baf0df1c4825363a427c13fee246f5275ab19bd3d9691cab2f77010" +
        //                       "0000000ffffffff0428032f000000000017a91469f3772509d00c88afbdfd9a962573104c5572" +
        //                       "aa8720a10700000000001976a914b97d5f71eac6f1b9b893815ee2d393cee5b939fc88ac166b0" +
        //                       "6000000000017a9148130201b6b9b07e34bae2f1a03ab470b1f6bddf08711df09000000000022" +
        //                       "0020701a8d401c84fb13e6baf169d59684e17abd9fa216c8cc5b9fc63d622ff8c58d00000000";
        //     tx = new Transaction();
        //     tx.addInput({txId: "772fab1c69d9d39bb15a27f546e2fe137c423a3625481cdff0baf3361b1bf831",
        //         vOut: 1, txInWitness: ["",
        //             "304402206bc09c33588b92f245e18d70538c0eb350bfe3861cec518be85e4268eb1740b" +
        //             "602207300db75d81f4a2de93b7c37faa0e32a176ca444b24509553e342f70002e44ec01",
        //             "30450221009947103bd40e25b8a54b95624cf77199ef674aab4ba53da47280f9208811c" +
        //             "dd002207f9dbca0804be6f7c206953971af2a5e538d4b640ba8041264d24bb40e8542ee01",
        //             "52210375e00eb72e29da82b89367947f29ef34afb75e8654f6ea368e0acdfd92976b7c2" +
        //             "103a1b26313f430c4b15bb1fdce663207659d8cac749a0e53d70eff01874496feff2103" +
        //             "c96d495bfdd5ba4145e3e046fee45e84a8a48ad05bd8dbb395c011a32cf9f88053ae"]});
        //     tx.addOutput({value: 3081000, address: "3BMEXxajhZYe3xijDp4R9axzJ6Avywupwk"});
        //     tx.addOutput({value: 500000, address: "1HunCYemQiLVPMbqY1QdarDKPiVq2Y86aR"});
        //     tx.addOutput({value: 420630, address: "3DU6k6uJBaeSJqkjTYLHixKycrfAZQQ5pP"});
        //     tx.addOutput({value: 646929, address: "bgl1qwqdg6squsna38e46795at95yu9atm8azzmyvckulcc7kytlcckxsczae2r"});
        //
        //     equal(tx.serialize({segwit:false, hex:true}), rawNonSegwitView);
        //     equal(tx.serialize({segwit:true, hex:true}), rawSegwitView);
        //     equal(tx.txId, "4e3895de573305e08b09926f410836ae30e9e3e909b92beea6a4dd7eb096609e");
        //     equal(tx.hash, "56a3ad9e259676b347d7a90d4cf65a3a60c29e0b49dbad0831846bcaad7d5db2");
        //     equal(tx.vOut[3].address, "bgl1qwqdg6squsna38e46795at95yu9atm8azzmyvckulcc7kytlcckxsczae2r");
        //     // from raw
        //     tx = new Transaction({format: 'raw'});
        //     tx.addInput({txId: "772fab1c69d9d39bb15a27f546e2fe137c423a3625481cdff0baf3361b1bf831",
        //         vOut: 1, txInWitness: ["",
        //             "304402206bc09c33588b92f245e18d70538c0eb350bfe3861cec518be85e4268eb1740b" +
        //             "602207300db75d81f4a2de93b7c37faa0e32a176ca444b24509553e342f70002e44ec01",
        //             "30450221009947103bd40e25b8a54b95624cf77199ef674aab4ba53da47280f9208811c" +
        //             "dd002207f9dbca0804be6f7c206953971af2a5e538d4b640ba8041264d24bb40e8542ee01",
        //             "52210375e00eb72e29da82b89367947f29ef34afb75e8654f6ea368e0acdfd92976b7c2" +
        //             "103a1b26313f430c4b15bb1fdce663207659d8cac749a0e53d70eff01874496feff2103" +
        //             "c96d495bfdd5ba4145e3e046fee45e84a8a48ad05bd8dbb395c011a32cf9f88053ae"]});
        //     tx.addOutput({value: 3081000, address: "3BMEXxajhZYe3xijDp4R9axzJ6Avywupwk"});
        //     tx.addOutput({value: 500000, address: "1HunCYemQiLVPMbqY1QdarDKPiVq2Y86aR"});
        //     tx.addOutput({value: 420630, address: "3DU6k6uJBaeSJqkjTYLHixKycrfAZQQ5pP"});
        //     tx.addOutput({value: 646929, address: "bgl1qwqdg6squsna38e46795at95yu9atm8azzmyvckulcc7kytlcckxsczae2r"});
        //
        //     equal(tx.serialize({segwit:false, hex:true}), rawNonSegwitView);
        //     equal(tx.serialize({segwit:true, hex:true}), rawSegwitView);
        //     equal(rh2s(tx.txId), "4e3895de573305e08b09926f410836ae30e9e3e909b92beea6a4dd7eb096609e");
        //     equal(rh2s(tx.hash), "56a3ad9e259676b347d7a90d4cf65a3a60c29e0b49dbad0831846bcaad7d5db2");
        //     equal(tx.decode().vOut[3].address, "bgl1qwqdg6squsna38e46795at95yu9atm8azzmyvckulcc7kytlcckxsczae2r");
        //     tx.encode();
        //     // remove 2 last outs and add using script
        //     tx.delOutput().delOutput();
        //     tx.addOutput({value: 420630, scriptPubKey: "a9148130201b6b9b07e34bae2f1a03ab470b1f6bddf087"});
        //     tx.addOutput({value: 646929, scriptPubKey: "0020701a8d401c84fb13e6baf169d59684e17abd9fa216c8cc5b9fc63d622ff8c58d"});
        //     equal(tx.serialize({segwit:false, hex:true}), rawNonSegwitView);
        //     equal(tx.serialize({segwit:true, hex:true}), rawSegwitView);
        //     equal(rh2s(tx.txId), "4e3895de573305e08b09926f410836ae30e9e3e909b92beea6a4dd7eb096609e");
        //     equal(rh2s(tx.hash), "56a3ad9e259676b347d7a90d4cf65a3a60c29e0b49dbad0831846bcaad7d5db2");
        //     equal(tx.decode().vOut[3].address, "bgl1qwqdg6squsna38e46795at95yu9atm8azzmyvckulcc7kytlcckxsczae2r");
        //     // segwit inside p2sh 883f786b3a823b143227e67e47001c11eadf0264ee9149bd5283a6f87a3dcdea
        //     tx = new Transaction();
        //     tx.addInput({txId: "376c1ed1c7d3108d17f80f3daa6c4e8eda5c83c7420d5ebf220bec723f17eccd",
        //         scriptSig: "160014bed11faa92d17d45905c41ba984d1a9107cead5f",
        //         txInWitness: ["3045022100ec7467e47c94a2c33b13cee8a07a5893a9e312fd3cb59a3633315468c171c7" +
        //             "550220014f1be125744137ebb93c120c0e51c6a190e8fd148bf637345412343efbb3fd01",
        //             "023170589b32f242682d1f69f67c9838be0afb557cbb9c42516780e60cdce5d005"]})
        //     tx.addOutput({value: 16760, address: "1BviYPm6tjmAU3JzK7JgW4GcG1NPDwpcJA"});
        //     equal(tx.txId, "883f786b3a823b143227e67e47001c11eadf0264ee9149bd5283a6f87a3dcdea");
        //     equal(tx.hash, "5052d63f0e94dfb811287ae7f1bce9689773fdb236a48d2a266aa9016190015a");
        //     equal(tx.size, 218);
        //     equal(tx.vSize, 136);
        //     equal(tx.weight, 542);
        //     equal(tx.bSize, 108);
        //     // coinbase transaction e94469dd87ac25ad9c4fe46f9bf51dbd587be0655bca87499d6faf35c432af46
        //     tx = new Transaction();
        //     tx.addInput({scriptSig: "03f5a407172f5669614254432f4d696e6564206279206a6e3734312f2cfabe6d6d978decb415" +
        //         "6738d7e170b52ba6d79129afb443cd1444215621f1b2fa0912389c01000000000000001095bc" +
        //         "4e04f95c206d2f9a5abc64050060",
        //         txInWitness: ["0000000000000000000000000000000000000000000000000000000000000000"]});
        //     tx.addOutput({value: 2018213798, address: "18cBEMRxXHqzWWCxZNtU91F5sbUNKhL5PX"});
        //     tx.addOutput({value:0, scriptPubKey: "6a24aa21a9edc00d472fceafe0fc49747df90d75f7324e3c83214b1a1308f3eda376848df481"});
        //     equal(tx.hash, "906221165b1c5f236a787ba5dbd8c9d590c52d30a39ee557a504c5c64e70e920");
        //     equal(tx.txId, "e94469dd87ac25ad9c4fe46f9bf51dbd587be0655bca87499d6faf35c432af46");
        //     equal(tx.size, 258);
        //     equal(tx.vSize, 231);
        //     equal(tx.weight, 924);
        //     equal(tx.bSize, 222);
        // });
        //

        //
        // it('sigHashSegwit', () => {
        //     // Native P2WPKH
        //     let rawTx = "0100000002fff7f7881a8099afa6940d42d1e7f6362bec38171ea3edf433541db4e4ad969f0000000000eeffffffef51e1b804cc89d182d279655c3aa89e815b1b309fe287d9b2b55d57b90ec68a0100000000ffffffff02202cb206000000001976a9148280b37df378db99f66f85c95a783a76ac7a6d5988ac9093510d000000001976a9143bde42dbee7e4dbe6a21b2d50ce2f0167faa815988ac11000000";
        //     equal(new Transaction({rawTx: rawTx}).sigHashSegwit(1, {value: 600000000,
        //         scriptPubKey: "1976a9141d0f172a0ecb48aee1be1f2687d2963ae33f71a188ac",
        //         sigHashType: SIGHASH_ALL}), "c37af31116d1b27caf68aae9e3ac82f1477929014d5b917657d0eb49478cb670");
        //     // P2SH-P2WPKH
        //     rawTx = "0100000001db6b1b20aa0fd7b23880be2ecbd4a98130974cf4748fb66092ac4d3ceb1a54770100000000feffffff02b8b4eb0b000000001976a914a457b684d7f0d539a46a45bbc043f35b59d0d96388ac0008af2f000000001976a914fd270b1ee6abcaea97fea7ad0402e8bd8ad6d77c88ac92040000";
        //     equal(new Transaction({rawTx: rawTx}).sigHashSegwit(0, {value: 1000000000,
        //         scriptPubKey: "1976a91479091972186c449eb1ded22b78e40d009bdf008988ac",
        //         sigHashType: SIGHASH_ALL}), "64f3b0f4dd2bb3aa1ce8566d220cc74dda9df97d8490cc81d89d735c92e59fb6");
        //     // Native P2WSH
        //     rawTx = "0100000002fe3dc9208094f3ffd12645477b3dc56f60ec4fa8e6f5d67c565d1c6b9216b36e0000000000ffffffff0815cf020f013ed6cf91d29f4202e8a58726b1ac6c79da47c23d1bee0a6925f80000000000ffffffff0100f2052a010000001976a914a30741f8145e5acadf23f751864167f32e0963f788ac00000000";
        //     equal(new Transaction({rawTx: rawTx}).sigHashSegwit(1, {value: 4900000000,
        //         scriptPubKey: "23210255a9626aebf5e29c0e6538428ba0d1dcf6ca98ffdf086aa8ced5e0d0215ea465ac",
        //         sigHashType: SIGHASH_SINGLE}), "fef7bd749cce710c5c052bd796df1af0d935e59cea63736268bcbe2d2134fc47");
        //     rawTx = "010000000136641869ca081e70f394c6948e8af409e18b619df2ed74aa106c1ca29787b96e0100000000ffffffff0200e9a435000000001976a914389ffce9cd9ae88dcc0631e88a821ffdbe9bfe2688acc0832f05000000001976a9147480a33f950689af511e6e84c138dbbd3c3ee41588ac00000000";
        //
        //     // P2SH-P2WSH SIGHASH_ALL
        //     equal(new Transaction({rawTx: rawTx}).sigHashSegwit(0, {value: 987654321,
        //         scriptPubKey: "cf56210307b8ae49ac90a048e9b53357a2354b3334e9c8bee813ecb98e99a7e07e8c3ba32103b28f0c28bfab54554ae8c658ac5c3e0ce6e79ad336331f78c428dd43eea8449b21034b8113d703413d57761b8b9781957b8c0ac1dfe69f492580ca4195f50376ba4a21033400f6afecb833092a9a21cfdf1ed1376e58c5d1f47de74683123987e967a8f42103a6d48b1131e94ba04d9737d61acdaa1322008af9602b3b14862c07a1789aac162102d8b661b0b3302ee2f162b09e07a55ad5dfbe673a9f01d9f0c19617681024306b56ae",
        //         sigHashType: SIGHASH_ALL}), "185c0be5263dce5b4bb50a047973c1b6272bfbd0103a89444597dc40b248ee7c");
        //     // P2SH-P2WSH SIGHASH_NONE
        //     equal(new Transaction({rawTx: rawTx}).sigHashSegwit(0, {value: 987654321,
        //         scriptPubKey: "cf56210307b8ae49ac90a048e9b53357a2354b3334e9c8bee813ecb98e99a7e07e8c3ba32103b28f0c28bfab54554ae8c658ac5c3e0ce6e79ad336331f78c428dd43eea8449b21034b8113d703413d57761b8b9781957b8c0ac1dfe69f492580ca4195f50376ba4a21033400f6afecb833092a9a21cfdf1ed1376e58c5d1f47de74683123987e967a8f42103a6d48b1131e94ba04d9737d61acdaa1322008af9602b3b14862c07a1789aac162102d8b661b0b3302ee2f162b09e07a55ad5dfbe673a9f01d9f0c19617681024306b56ae",
        //         sigHashType: SIGHASH_NONE}), "e9733bc60ea13c95c6527066bb975a2ff29a925e80aa14c213f686cbae5d2f36");
        //
        //     // P2SH-P2WSH SIGHASH_SINGLE
        //     equal(new Transaction({rawTx: rawTx}).sigHashSegwit(0, {value: 987654321,
        //         scriptPubKey: "cf56210307b8ae49ac90a048e9b53357a2354b3334e9c8bee813ecb98e99a7e07e8c3ba32103b28f0c28bfab54554ae8c658ac5c3e0ce6e79ad336331f78c428dd43eea8449b21034b8113d703413d57761b8b9781957b8c0ac1dfe69f492580ca4195f50376ba4a21033400f6afecb833092a9a21cfdf1ed1376e58c5d1f47de74683123987e967a8f42103a6d48b1131e94ba04d9737d61acdaa1322008af9602b3b14862c07a1789aac162102d8b661b0b3302ee2f162b09e07a55ad5dfbe673a9f01d9f0c19617681024306b56ae",
        //         sigHashType: SIGHASH_SINGLE}), "1e1f1c303dc025bd664acb72e583e933fae4cff9148bf78c157d1e8f78530aea");
        //
        //     // P2SH-P2WSH SIGHASH_ALL + SIGHASH_ANYONECANPAY
        //     equal(new Transaction({rawTx: rawTx}).sigHashSegwit(0, {value: 987654321,
        //         scriptPubKey: "cf56210307b8ae49ac90a048e9b53357a2354b3334e9c8bee813ecb98e99a7e07e8c3ba32103b28f0c28bfab54554ae8c658ac5c3e0ce6e79ad336331f78c428dd43eea8449b21034b8113d703413d57761b8b9781957b8c0ac1dfe69f492580ca4195f50376ba4a21033400f6afecb833092a9a21cfdf1ed1376e58c5d1f47de74683123987e967a8f42103a6d48b1131e94ba04d9737d61acdaa1322008af9602b3b14862c07a1789aac162102d8b661b0b3302ee2f162b09e07a55ad5dfbe673a9f01d9f0c19617681024306b56ae",
        //         sigHashType: SIGHASH_ALL + SIGHASH_ANYONECANPAY}),
        //         "2a67f03e63a6a422125878b40b82da593be8d4efaafe88ee528af6e5a9955c6e");
        //
        //     // P2SH-P2WSH SIGHASH_SINGLE + SIGHASH_ANYONECANPAY
        //     equal(new Transaction({rawTx: rawTx}).sigHashSegwit(0, {value: 987654321,
        //             scriptPubKey: "cf56210307b8ae49ac90a048e9b53357a2354b3334e9c8bee813ecb98e99a7e07e8c3ba32103b28f0c28bfab54554ae8c658ac5c3e0ce6e79ad336331f78c428dd43eea8449b21034b8113d703413d57761b8b9781957b8c0ac1dfe69f492580ca4195f50376ba4a21033400f6afecb833092a9a21cfdf1ed1376e58c5d1f47de74683123987e967a8f42103a6d48b1131e94ba04d9737d61acdaa1322008af9602b3b14862c07a1789aac162102d8b661b0b3302ee2f162b09e07a55ad5dfbe673a9f01d9f0c19617681024306b56ae",
        //             sigHashType: SIGHASH_SINGLE + SIGHASH_ANYONECANPAY}),
        //         "511e8e52ed574121fc1b654970395502128263f62662e076dc6baf05c2e6a99b");
        // });

        // it('sign PUBKEY input', () => {
        //     let t = "0100000001729e7f0a0d7c680c274b76310d46ccbf2f2a05bd76d07f0556450e20b68465d700000000494830450221008655a5" +
        //     "a16f6563ebef7e9d085a62cdac99329b47ec9d5537de3f455b2a2da3ce02207ab34a1e223245d727a0e639ec8b0ec75ac04827" +
        //     "4f102598fd0a50e7854eff1301ffffffff01c005d901000000001976a91475a31c60acaf594e48a0955c2ec6396c2f7873cb88" +
        //     "ac00000000";
        //     let tx = new Transaction({testnet: true});
        //     tx.addInput({txId: "d76584b6200e4556057fd076bd052a2fbfcc460d31764b270c687c0d0a7f9e72"});
        //     tx.addOutput({value: 31000000, address: "mrExkdzwj7y5CW2BYSgFDPfJ8oWm2v49L2"});
        //     tx.signInput(0, {privateKey: "bb127228ddcb9209d7fd6f36b02f7dfa6252af40bb2f1cbc7a557da8027ff866",
        //         scriptPubKey: "2103bc85b4247004744d3e96f861802ec49ea4c64902ded840509879130356b4a0feac"});
        //     equal(t, tx.serialize());
        // });

        // it('sign P2PKH input', () => {
        //     let t = "0100000001858a386d766fc546a68f454142d5912634988c9a192c725ade3a0e38f96ed137010000006a47304402201c26" +
        //          "cbc45d001eeae3c49628dde4520a673c3b29728764356184ade9c31b36a40220691677e7344ba11266e5872db6b5946834" +
        //          "33b864f2c187a0dc3ea33739d2dd6f012102a8fb85e98c99b79150df12fde488639d8445c57babef83d53c66c1e5c818ee" +
        //          "b4ffffffff01702a290a000000001976a9145bfbbcfef367417bd85a5d51ae68a0221da3b45f88ac00000000";
        //     let a = new Address(new PrivateKey("7b56e2b7bd189f4491d43a1d209e6268046df1741f61b6397349d7aa54978e76", {testnet: true}),
        //         {addressType: "P2PKH"});
        //     let tx = new Transaction({testnet: true});
        //     tx.addInput({txId: "37d16ef9380e3ade5a722c199a8c98342691d54241458fa646c56f766d388a85",
        //         vOut: 1, address: a});
        //     tx.addOutput({value: 170470000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
        //     tx.signInput(0, {privateKey: "cRiTUeUav1FMR4UbQh2gW9n8RfpNHLBHsEYXJYa4Rv6ZrCdTPGqv"});
        //     equal(tx.serialize(), t);
        //
        //     t = "01000000029d05abe190f4a75455aa5ec940a0d524607ecd336e6dcc69c4c22f7ee817964a000000006b4830450221008" +
        //          "bac636fc13239b016363c362d561837b82a0a0860f3da70dfa1dbebe6ee73a00220077b738b9965dc00b0a7e649e7fda2" +
        //          "9615b456323cf2f6aae944ebed1c68e71a012102a8fb85e98c99b79150df12fde488639d8445c57babef83d53c66c1e5c" +
        //          "818eeb4ffffffffee535abe379c7535872f1a76cd84aa7f334bf3ee21696632049d339a17df89f8000000006b48304502" +
        //          "2100eace9a85848b8ed98b5b26fe42c8ced3d8e4a6cf7779d2275f1c7966b4f0f6700220189adf1333ae7fc6be5fe3fd8" +
        //          "4cb168e55ea4983c86145030b88ba25ddf916ee012103b5963945667335cda443ba88b6257a15d033a20b60eb2cc393e4" +
        //          "b4d9dc78cd5dffffffff0180b2e60e000000001976a9145bfbbcfef367417bd85a5d51ae68a0221da3b45f88ac00000000";
        //
        //     tx = new Transaction({testnet: true});
        //     tx.addInput({txId: "4a9617e87e2fc2c469cc6d6e33cd7e6024d5a040c95eaa5554a7f490e1ab059d",
        //         address: "mkH3NMrEcijyVutDhvV5fArXJ3A2sxspX9"});
        //     tx.addInput({txId: "f889df179a339d0432666921eef34b337faa84cd761a2f8735759c37be5a53ee",
        //         address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
        //     tx.addOutput({value: 250000000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
        //     tx.signInput(0, {privateKey: "cRiTUeUav1FMR4UbQh2gW9n8RfpNHLBHsEYXJYa4Rv6ZrCdTPGqv"});
        //     tx.signInput(1, {privateKey: "cSimowS3sa1eD762ZtRJUmQ7f9EqpqJa8qieXs4hKjkao2nipoTq"});
        //     equal(tx.serialize(), t);
        //
        //     t = "01000000019c5287d981ac92491a4555a0d135748c06fbc36ffe80b2806ce719d39262cc23000000006a47304402201b" +
        //          "db3fd4964b1e200e4167a5721bf4c141fa97177a0719ace9a508c24c923feb0220063f353306bcdf756f4d2c117fb185" +
        //          "035c14f841b8462091637451eba2c1d77c032103b5963945667335cda443ba88b6257a15d033a20b60eb2cc393e4b4d9" +
        //          "dc78cd5dffffffff014062b007000000001976a9145bfbbcfef367417bd85a5d51ae68a0221da3b45f88ac00000000";
        //
        //     tx = new Transaction({testnet: true});
        //     tx.addInput({txId: "23cc6292d319e76c80b280fe6fc3fb068c7435d1a055451a4992ac81d987529c",
        //         address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
        //     tx.addOutput({value: 129000000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
        //     tx.signInput(0, {privateKey: "cSimowS3sa1eD762ZtRJUmQ7f9EqpqJa8qieXs4hKjkao2nipoTq",
        //         sigHashType: SIGHASH_SINGLE});
        //     equal(tx.serialize(), t);
        //
        //     t = "010000000252dc328cba19ac25711ea56755fe9e866e24feeab97fa9b31b2030c86f40a9b3000000006a4730440220" +
        //          "142022a671ebc2a51760920b5938f61f5f79a41db69380115a6d4c2765b444540220309fa9b0bd347561473cdce1a1" +
        //          "adc1b19fcfa07b7709c6ec115d11bb76f0d5fd012103b5963945667335cda443ba88b6257a15d033a20b60eb2cc393" +
        //          "e4b4d9dc78cd5dffffffffe28966244d618bada9429fc56ce8843b18ce039cecbb86ff03695a92fd34969200000000" +
        //          "6a473044022043e021bcb037a2c756fb2a3e49ecbcf9a9de74b04ab30252155587c2ef4fd0670220718b96ee51b611" +
        //          "2825be87e016ff4985188d70c7661af29dd558b4485ec034e9032102a8fb85e98c99b79150df12fde488639d8445c5" +
        //          "7babef83d53c66c1e5c818eeb4ffffffff0200e1f505000000001976a9145bfbbcfef367417bd85a5d51ae68a0221d" +
        //          "a3b45f88ac40084e05000000001976a9145bfbbcfef367417bd85a5d51ae68a0221da3b45f88ac00000000";
        //
        //     tx = new Transaction({testnet: true});
        //     tx.addInput({"txId": "b3a9406fc830201bb3a97fb9eafe246e869efe5567a51e7125ac19ba8c32dc52",
        //         address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
        //     tx.addInput({"txId": "929634fd925a6903ff86bbec9c03ce183b84e86cc59f42a9ad8b614d246689e2",
        //         address: "mkH3NMrEcijyVutDhvV5fArXJ3A2sxspX9"});
        //     tx.addOutput({value: 100000000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
        //     tx.addOutput({value: 89000000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
        //     tx.signInput(1, {privateKey: "cRiTUeUav1FMR4UbQh2gW9n8RfpNHLBHsEYXJYa4Rv6ZrCdTPGqv",
        //         sigHashType: SIGHASH_SINGLE});
        //     tx.signInput(0, {privateKey: "cSimowS3sa1eD762ZtRJUmQ7f9EqpqJa8qieXs4hKjkao2nipoTq",
        //         sigHashType: SIGHASH_ALL});
        //     equal(tx.serialize(), t);
        //
        //     t = new Transaction();
        //     t.addInput({txId:"42361048a18b9e619f3dfe16f8f5032f0912cbc8f535c233731e83064c81bfe3",
        //         address:"1Bitapsw1aT8hkLXFtXwZQfHgNwNJEyJJ1"});
        //     t.addOutput({value: 100000000, address: "1Bitapsw1aT8hkLXFtXwZQfHgNwNJEyJJ1"});
        //     t.signInput(0, {privateKey:"5JEBR43smtENF37sib2fUM2skB5PKFBGbqoQaKyTr8vvqW28HxP"});
        //     equal(t.vIn[0].scriptSigOpcodes === "[72] [33]", false);
        //
        //     t = "010000000278be2e22c8880c01fe9d9d8e4a2f42f0f89d6b6d3f0f2dee79fd4b3be4ff9307000000006b483045022" +
        //          "100a45cab68bff1ef79b463ebffa3a3c546cd467e6aabb051c87c0116c968a5e2e602202b21d93705f768533b5a3e" +
        //          "0e17871ae4d8a61dfde213096cdf5e38abbf8ba0e7032103b5963945667335cda443ba88b6257a15d033a20b60eb2" +
        //          "cc393e4b4d9dc78cd5dffffffff8ae976106659e8bec5ef09fc84f989c7bab6035be984648bd1ea7b29981613cb00" +
        //          "0000006b483045022100a376f93ed693558f8c99bcb3adbb262aff585f240e897c82478178b6ad60f3ad0220546f2" +
        //          "376b72f2f07d16f6e0e2f71181bc3e134ff60336c733dda01e555300f2a032103b5963945667335cda443ba88b625" +
        //          "7a15d033a20b60eb2cc393e4b4d9dc78cd5dffffffff0100e1f505000000001976a9145bfbbcfef367417bd85a5d5" +
        //          "1ae68a0221da3b45f88ac00000000";
        //
        //     tx = new Transaction({testnet: true});
        //     tx.addInput({txId: "0793ffe43b4bfd79ee2d0f3f6d6b9df8f0422f4a8e9d9dfe010c88c8222ebe78",
        //         address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
        //     tx.addInput({txId: "cb131698297bead18b6484e95b03b6bac789f984fc09efc5bee859661076e98a",
        //         address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
        //     tx.addOutput({value: 100000000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
        //     tx.signInput(1, {privateKey: "cSimowS3sa1eD762ZtRJUmQ7f9EqpqJa8qieXs4hKjkao2nipoTq",
        //         sigHashType: SIGHASH_SINGLE});
        //     tx.signInput(0, {privateKey: "cSimowS3sa1eD762ZtRJUmQ7f9EqpqJa8qieXs4hKjkao2nipoTq",
        //         sigHashType: SIGHASH_SINGLE});
        //     equal(tx.serialize(), t);
        //
        //     t = "0100000000010ae86eef67d8c6a4fa42c8d1ba56095cfd580675f5e23d4c3eb4e0cd94f749e76e0d00000023220020836874e10" +
        //     "976a55b3797305458e5062f610ef36d965ae90a2a6e1cf2b82196d6ffffffff490f6350a3dea457086e34431c9376f810d2cc13" +
        //     "45d80b6ca13774336b4a6d430c000000232200205f074989fce0d834b6d5f0f7458fd784c3fef6edf220d286f609572b351af54" +
        //     "4ffffffffb9d80c9a4c46950ca456a99ba8f332072ca8fc77283896bc515315ee3659b0b40000000023220020f0ebbea7b0628d" +
        //     "9deb464f8dff4a13ab600a9d152babd55397b935a15e69c6eaffffffff5e17c16acf59553c4f12e155b0c2ed890bc30305eea51" +
        //     "7e95b96aa56602e1e2d0100000023220020d41098b592f0444588603f6317fa221071a431488a43412e1947d17fd8cf08e7ffff" +
        //     "ffffe6bb632279123095c9c20cfa475dedc652ed9a145df8dbb97629713d5ea9360b14000000232200209e2cfbe506e1f4069d8" +
        //     "a210065977d5084942736620237689a505c00af3b0be5fffffffff6fabc0398da61b54655a5570c636c195cb7b430629c654806" +
        //     "64c247772a81a5a500000023220020eff46382a9e523f43b486fd9bcdca1b05283ffd821b942eb84eda4a6c9049c77ffffffffe" +
        //     "b7f7d50ee09fa1de8a9ad94e20a35afd568b724bda5e88bd95b9293c1d092200400000023220020aad3f8ee6f95dd7c3b18df80" +
        //     "aa0ce15cbd95119805460c5f2087af68b0576cb6ffffffff413956ecb16eb70a611a87af4308487b66ec2b24914fececb31cdd2" +
        //     "65629490c00000000232200203acbfd4896a9d6f1e80e0baceec00ca9053ebb0b414a431863e86bea40bcb8d7ffffffffbb81e5" +
        //     "985a904055bdd5056b94716595d64e7c557a19f7e210173134923582720100000023220020af64a9d1f1faf501dd97d934aae2a" +
        //     "a3463750dc7ffc843433392d61173447b1affffffff4d0b29f52473088a0877a5d324639d11be4292e8ae7869803f57494b7e25" +
        //     "5083c002000023220020c07933f89277461f4aa8292c82f90f51d5c08efaf85ee0a128862ee1c1f964a0ffffffff12b0ba677d0" +
        //     "00000001976a9142b94a5696f8414810804910a53e0d42d469cc68888acb0693001000000001976a91449c8bc27c91b6da00814" +
        //     "2d59b391b71241241fe188ac4059940e0000000017a914fa671ec312a6acd9a890bfc9b8e42e6d379dd26687509731000000000" +
        //     "017a9140476a4bb4062634cc88efec6faa8f67367c8517687001d10000000000017a914aec4c31d0266ab952f8e333f47572419" +
        //     "9c1b20c08768051f000000000017a91490348215c703df48a8b5f27b6edf4e7328a8eb8f87281f54000000000017a914ed11adb" +
        //     "24433a7bbeb86add7b305e00a461c7060877053f0000000000017a9145c82025b4aedd1e5c1ffb9787fbee925b2b23e4e87506b" +
        //     "6200000000001976a9147293926f5d57e79d2fb23e45150e00f9011716b888ace86df4050000000017a914129506924b8ee99bd" +
        //     "fafe905f6dc8aefd5582f0387a0db5b00000000001976a9145d608186223ef77bfda8ef29eb7c118a5c49be8788ac7007bb0400" +
        //     "00000017a914a14e4df199b84dc7bb2e1512c2b53bb9ccc3d6ad873847bc00000000001976a9143b10f41f5bb8123f388838cac" +
        //     "ac30e25a1335cbb88ac20a58f05000000001976a914aa6f6e369c0ece0fa308afe230b8a090cf3dc22988ac7098940300000000" +
        //     "17a91428725337b726536e770d9e2ff9c42e28aa3c183e8718f55c09000000001976a914ca7369dc4f594d93b71f98e8272d41a" +
        //     "e4db24d3988ac90ebba00000000001976a9143981663e21bd94c88b5c1c762fb7bae44af1449b88acd1c051b80000000017a914" +
        //     "ac6f85e29c73fe144e9cb4df66c3918a00d03c73870400473044022061ddd2863acb41f754067891991ffa8166391156b1a179a" +
        //     "c2c96f03c6868224102205be713dfdf859bf73f0e298066e2b4cea8a921eae048953e4f9b08216f4f348401463043021f32be97" +
        //     "e483265a3cea779a3e7b418c366c87ed19c0eea0687f24f83075bc58022048a9c9264077a48b9c5e869dd483b9682cc19743ec9" +
        //     "0538d6be4990412729ac90169522102bf32cdf437f8af4ec8705ff9bd9d394d95dbc17d4b0801d38167a32b5af59db721027de8" +
        //     "616c9e0a52189ab52411b098610a996531f40b6369d066f809a0427e9bb8210268d5f41dba5d8fa19a1fde213d902f31f3513ba" +
        //     "56502810ba8192d33c87b1c5d53ae040047304402206c11e7f30f743d4db157cb626afbf9f22d9e87926b006ca03f1122db5a7d" +
        //     "a4b8022053df5a6641dee8f1513bc27a702e4c64995ed297a034a8700a5ff4f9716a383e014830450221008cb3903927db38377" +
        //     "ade7eae0c496084616f59ed7e0ac40df101bf2137d7368802201aa96ca4c6feba0257a780250be3addf789ed59cd772da26a680" +
        //     "d481386d288b0169522102127eaf8c2ffc2fcab5342b9670cd7f81fe5909a6a68e5ec48f2a4526bb055c492102ba49de2128d2a" +
        //     "a98525ac45183c1c9b1d4cb5b490ca2c814de2ca9e1606e9f3e21020d9cd35f18382a88e0784900763bf2bdadc54ce972a1bace" +
        //     "934aa366e1fde6b353ae0400483045022100ee01fec412c5fc8df06b0f7eb13666b8fd209021a14a6514b57006fca31e0dfe022" +
        //     "00842c2689ec7fa86428a92408bf2a10174d3611cd2b0af104b36dbc453e05a860147304402204a5c38d17e4e3e3cb4c738f983" +
        //     "ecc7e7ab9f8640bda8b2ae563b44d487d6fd19022025d9f523c0b6879ba06dcac11f466d345670573f016b85d550b4960ab8b7f" +
        //     "124016952210338e8b783d0d6d1d8b30adbd214eb0549c5f06349dad0ce1e962c25630a025b7e21029ff6bff81992bc7ee875aa" +
        //     "380c6d7e246c7650c2e0cb27f92e1caaa6eb362be12103e5f2e69b19cc9ffce3f466982075a9a7ff521b10ab3b7be4c55d55851" +
        //     "341fa7153ae040047304402206fc8313bf245c5f670b1269e6db62304715a9ea8a0eb58cb8fd0beec4a2c966102204512f61e66" +
        //     "46634498d74fd5ed58b25d9accc961f307888a7d3ed2366d3b46b101483045022100cc5ed821dde97f29afbad747cbef27f30d2" +
        //     "9d2bdf5cf6ff5bfb08964ec042487022052429189e819e1096c7a8a6a00af3b5c3d11104ff98382164bc86ed02aa2b46d016952" +
        //     "2102497d2370e03cef2f476c4ed98475d45d35a4ba2c6d0999d7b47af0b897fff19b210283044c82fbda2789d06b1a70afab9a4" +
        //     "7b8b0a6be4ffc86c778ce55400e169a48210356d36f4a13c143e122ea76b586d7d8d79ec9ef65b092471b7d1d78acefa2fb5d53" +
        //     "ae0400483045022100ee66c86ece64814ea61bcbbd429047361c9d4f7653e36d3f558afc088808dd4402203d96a1a87b6fe65a9" +
        //     "443ae2b6601531f24b7cf54058ac84273bdbbc26b60c50a014830450221008e68ad34519549184aaa549a356bb8be7bd82b9594" +
        //     "eda0094124c0712d262a76022040129a89f28e9656f1496b8d1ef1510ca8819133f2959d7f4eb5433fb2d024ac0169522102d58" +
        //     "09edd69535048caefafb7e1bbfc31dd3a8119fa027c06ac4fff7c47cc5c992102e843efa57b829404c090ec568630e04956fb70" +
        //     "4491433092f2e5cbe5c6ea443d2102d6ea08ba5bf4756d8926f186e8ef47ebcbf41a115b068789401aa4de0c64644953ae04004" +
        //     "7304402202aac4fd3456f838d62dc050066937a8627a2e7c05bc6c82713f315f3ab63c94602201477eb1ac5e54a77c3a54890f2" +
        //     "9728ed65d205edd376041a6ab0fdd22a37ba1b01473044022028ce2682c1abe60b1256d6fd1b76f18f39a5046d2caf2d2c8f559" +
        //     "d399810f71202205c3d3ec147bb4a42f945f19548fcaa4668d4c7a9b12a00724243cb2e24b9daa901695221029904a08ded0330" +
        //     "3a3f88d260d4c22ac71f246da63458cb6e7a5441cc9b194c6a21027dc59859ba222701fd1a582e6e58cc35d3229effc72d3f98b" +
        //     "9832364ac20ca13210221d250c0b6c7dad36e6af341091be754bebadaed5a5f024e5b4bbd3cf08c46e053ae0400483045022100" +
        //     "b2bd905daef9777adecbf52a73b64eca6475401bf1a5e9a392b1858315a09897022053f44b586eaba0c58b6629e6ff047e237b3" +
        //     "38483c13980bc3caf9e3ed69b14e001483045022100dcdc4edf79acacdda43ffbc3f585572013ab331b237bf04798874b4cca4e" +
        //     "4801022042fb1b77e48acb3c7047ba020443e611d760d2b6cc544bf721d3dabf2e3fa3d201695221036bcd992017b6613195d33" +
        //     "ad328d9ea158b3f55a21f1fffffe31b31771f75f3f12103244b19fb816b23fa2292eb552f2e9877c0f409386d34fa93c11e9cf7" +
        //     "c9f70308210292a9db72e379443012a33e832c89dbe34dfa521686466451ce3d320885ce8f4153ae04004830450221009987ece" +
        //     "026511cf9afdd46d1de4bde25d55c2b4c82a761cedfce656cc6fc55f9022038e99c9607b131110c25363a366ce3724a796b2df2" +
        //     "01ba71d74b3debef7062c301483045022100ed38faf5ab45cde2621f63bc08670dc4e4c33cb8117a488764fd77ab45a2c485022" +
        //     "0792b72f562c0d21d5f697f760267410e3e41203455faef3c73519b32abd26e7401695221023c4ea281bbf7d5edbda342ef63a2" +
        //     "10bd4f29491d4132850233b84b8e8d00d12521021f69d49af87b294f22dc1093f4b83dc640e5731f8e4cea2788e9f610eb86c31" +
        //     "c21023e1110e93cb0f47e22be40fedbcc0a44411f1167817cde6c55c8dc21c039ed1e53ae0400463043021f689bb6058b3e2b5d" +
        //     "b0f83c53291e090dbd653ad64c7dc967fd3b88fed201ef022010db0c1741b9dcd8da21fce909e2753125b96e43da5fa6c3e4aba" +
        //     "b4834648c3a0147304402206dd1c33cfa870f865bf62690cb99ac059171c59753942b47c64989df0fd9f52d022001e057a08bc5" +
        //     "aa22260508424f1b3fa67fad3e365b67c27aeb8c592946b671930169522102add3216135f7e64cf4f391b3930bf36a18ae63cdb" +
        //     "7d2df49caaf1454975c757621036f5fcbd63200e086629e21f2e22cadcb4164a4cc3c889ed575a5ca7530c21a622102df9a83c1" +
        //     "5a3cd69a2f1787cbbfc41da8557268dec6e37d0647838ed4fde79adf53ae04004730440220389b3a4b11682a43524d10623e870" +
        //     "7303533dd772f063e39cc07660e0b31472c02206732c70619ee40f0af5fb7add47a3aa8b7cc7aa9d6df5344803c8d48e1cfc2bb" +
        //     "01483045022100df530268f3c9f243a89e22ef6f24bc80ae6642b483598d7ee0a6b4b79f2a8b9a02207fb4ec71b84df08d97fd0" +
        //     "87b8e15e8107cf7c9e63f1961ec96c9aa33a88c43910169522102a8c6438e2f6ec0c5702b55c5f1ea54f9356dc999a9c035c0f0" +
        //     "443a54d124c3262103e06283c613593286b3bffae9a3d5b890fe225617481d7e6572fadfc38513345b2103cd7fcf98e0640739a" +
        //     "298165e72bad79cbb3434d74649ab3a064d8631cf93f96c53ae00000000";
        //
        //     tx = new Transaction({rawTx: t});
        //     equal(t, tx.serialize());
        // });

        // it('sign P2SH_MULTISIG 1 of 2', () => {
        //     let a1 = new Address("cQMtVcE77xqLAAJGPxoQX4ZxnvBxBitBMMQQr5RMBYh4K8kZDswn", {testnet: true});
        //     let a2 = new Address("cR3oXD6J1tDr2LhT6mKJYJc9qT2iv1dtpFLKkfR7qKnTC3P85w5T", {testnet: 1});
        //     let a = ScriptAddress.multisig(1, 2, [a1, a2], {testnet: true, witnessVersion: null});
        //     equal(a.address, "2MtBHb92gNV93Wd6wAiyrV4bBQbbnZspvUA");
        //     equal(a.scriptHex, "51210399179539f1ebedc809887a48fe802093a74435052ab7fb83d5861fca2f4582e22103d595ee4ba8" +
        //         "1f9863ffdc06ea551467a49e290760d47ed547ea71544a9b8d10ad52ae");
        //     let tx = new Transaction({testnet: true});
        //     tx.addInput({txId: "6bff4e558bdfb9cf12ac1865a2895ea270b64e836520a7404aedab1478d4b85f", vOut: 0,
        //         address: "2MtBHb92gNV93Wd6wAiyrV4bBQbbnZspvUA", redeemScript: a.script});
        //     tx.addOutput({value: 120000000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
        //     tx.signInput(0, {privateKey: "cQMtVcE77xqLAAJGPxoQX4ZxnvBxBitBMMQQr5RMBYh4K8kZDswn",
        //         sigHashType: SIGHASH_ALL});
        //     let t = "01000000015fb8d47814abed4a40a72065834eb670a25e89a26518ac12cfb9df8b554eff6b00000000920048304502210" +
        //     "08e7edc6f3fec3d2eb029e68f9340ad0549e24cd6e50e99b33a8f64bae42e44bd02207189c4f1088466754766b76ad731" +
        //     "3d96b34989769268c4b8cf461f4a6022bf44014751210399179539f1ebedc809887a48fe802093a74435052ab7fb83d58" +
        //     "61fca2f4582e22103d595ee4ba81f9863ffdc06ea551467a49e290760d47ed547ea71544a9b8d10ad52aeffffffff0100" +
        //     "0e2707000000001976a9145bfbbcfef367417bd85a5d51ae68a0221da3b45f88ac00000000";
        //     equal(t, tx.serialize());
        // });

        // it('sign P2SH_MULTISIG 2 of 2', () => {
        //     let a1 = new Address("cQMtVcE77xqLAAJGPxoQX4ZxnvBxBitBMMQQr5RMBYh4K8kZDswn", {testnet: true});
        //     let a2 = new Address("cR3oXD6J1tDr2LhT6mKJYJc9qT2iv1dtpFLKkfR7qKnTC3P85w5T", {testnet: 1});
        //     let a =  ScriptAddress.multisig(2, 2, [a1, a2], {testnet: true, witnessVersion: null});
        //     equal(a.address, "2MxgNabrhi6kGzNCapEwnk7GYkNmDZGHr25");
        //     equal(a.scriptHex, "52210399179539f1ebedc809887a48fe802093a74435052ab7fb83d5861fca2f4582e22103d595ee4ba81f9863ff" +
        //         "dc06ea551467a49e290760d47ed547ea71544a9b8d10ad52ae");
        //     let tx = new Transaction({testnet: true});
        //     tx.addInput({txId: "cf43acc2202074d3bf3f5a8936ef0157e6e292e1e53dd3eb6f5644de237b5d89", vOut: 0,
        //         address: "2MxgNabrhi6kGzNCapEwnk7GYkNmDZGHr25", redeemScript: a.script});
        //     tx.addOutput({value: 120000000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
        //     tx.signInput(0, {privateKey: [a1.privateKey, a2.privateKey]});
        //     let t = "0100000001895d7b23de44566febd33de5e192e2e65701ef36895a3fbfd3742020c2ac43cf00000000db00483045022100" +
        //         "a52f86f21a4b189cd172b2c6267149f15d9c02c7ac7cf72eb31d3c5fa475465e02203293d8683376c1574125f7fd36b75d" +
        //         "770c5c2930d148221aee3123f9c9fd158c01483045022100c1e19c1da2776cea4d57fe0221f34ec3a38719260633cdce96" +
        //         "def65eb79d6554022050738953714493d18e155750ffd9f2697381b618e74a1b82b5bf0e8c58a6b13f0147522103991795" +
        //         "39f1ebedc809887a48fe802093a74435052ab7fb83d5861fca2f4582e22103d595ee4ba81f9863ffdc06ea551467a49e29" +
        //         "0760d47ed547ea71544a9b8d10ad52aeffffffff01000e2707000000001976a9145bfbbcfef367417bd85a5d51ae68a022" +
        //         "1da3b45f88ac00000000";
        //     equal(t, tx.serialize());
        //
        //     t = "0100000001762a9a00d64c693795013b5ea5246e5407f37f4d5477f7839c857cea92e7f6d600000000da00483045022100" +
        //     "8da9cfb8b89c0374f9db6f5066115bc2a8cba54de67486bc09aaa5fdda92b559022057456f63dac1a9ede532e7e7659518" +
        //     "d0447229533470e0647baf1cab99b7986e01473044022042aefa2ff6c682e0a88ef421540a0b38422c45b182a9660d253c" +
        //     "9167dcaedea702202e4b2c2dba6d603b7d2024f0c4cbdeb8fe2f457c70c423d98f4f091ff48e6417014752210399179539" +
        //     "f1ebedc809887a48fe802093a74435052ab7fb83d5861fca2f4582e22103d595ee4ba81f9863ffdc06ea551467a49e2907" +
        //     "60d47ed547ea71544a9b8d10ad52aeffffffff010090d003000000001976a9145bfbbcfef367417bd85a5d51ae68a0221d" +
        //     "a3b45f88ac00000000";
        //
        //     tx = new Transaction({testnet: true});
        //     tx.addInput({txId: "d6f6e792ea7c859c83f777544d7ff307546e24a55e3b019537694cd6009a2a76",
        //         address: "2MxgNabrhi6kGzNCapEwnk7GYkNmDZGHr25", redeemScript: a.script});
        //     tx.addOutput({value: 64000000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
        //     tx.signInput(0, {privateKey: [a1.privateKey, a2.privateKey]});
        //     equal(t, tx.serialize());
        //
        //     // swap key order
        //     tx = new Transaction({testnet: true});
        //     tx.addInput({txId: "d6f6e792ea7c859c83f777544d7ff307546e24a55e3b019537694cd6009a2a76",
        //         address: "2MxgNabrhi6kGzNCapEwnk7GYkNmDZGHr25", redeemScript: a.script});
        //     tx.addOutput({value: 64000000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
        //     tx.signInput(0, {privateKey: [a2.privateKey, a1.privateKey]});
        //     equal(t, tx.serialize());
        //
        //     // sign Alice and Bob
        //
        //     t = "0100000001b280dd126d2cafe8aa0e26b7360d5c6c51446b82e934c0b98f9e77318711243c00000000d9004730440220157" +
        //     "1a0d54361d7d6838c95263f6a4a8ee1f7315c0c2c57a7bf095716535d040602203ae9be582f6112eb45ac1b7388316b740e" +
        //     "2a6f0de24c640f5d00bda131c471a20147304402205758aa63e4ff3c5fdb4a4d32ddde90f851dfd3ff889e77c9ecb9af3cd" +
        //     "345360202207443b94ddddfc337a8b4812267a29b489e53c8a76f28158a70ed4d71c60039bb014752210399179539f1ebed" +
        //     "c809887a48fe802093a74435052ab7fb83d5861fca2f4582e22103d595ee4ba81f9863ffdc06ea551467a49e290760d47ed" +
        //     "547ea71544a9b8d10ad52aeffffffff01000e2707000000001976a9145bfbbcfef367417bd85a5d51ae68a0221da3b45f88" +
        //     "ac00000000";
        //
        //     tx = new Transaction({testnet: true});
        //     tx.addInput({txId: "3c24118731779e8fb9c034e9826b44516c5c0d36b7260eaae8af2c6d12dd80b2",
        //         address: "2MxgNabrhi6kGzNCapEwnk7GYkNmDZGHr25", redeemScript: a.script});
        //     tx.addOutput({value: 120000000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
        //
        //     // Alice sign first
        //     tx.signInput(0, {privateKey: [a1.privateKey]});
        //     let rtx = tx.serialize();
        //     // Alice send half signed tx to Bob
        //     // Bob in play
        //     tx = new Transaction({rawTx: rtx, testnet: true});
        //     tx.signInput(0, {privateKey: [a2.privateKey], address: a.address, redeemScript: a.script});
        //     equal(t, tx.serialize());
        //
        //
        //     tx = new Transaction({testnet: true});
        //     tx.addInput({txId: "3c24118731779e8fb9c034e9826b44516c5c0d36b7260eaae8af2c6d12dd80b2",
        //         address: "2MxgNabrhi6kGzNCapEwnk7GYkNmDZGHr25", redeemScript: a.script});
        //     tx.addOutput({value: 120000000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
        //
        //     // Bob sign first
        //     tx.signInput(0, {privateKey: a2.privateKey});
        //     rtx = tx.serialize();
        //     // Bob send half signed tx to Alice
        //     // Alice in play
        //     tx = new Transaction({rawTx: rtx, testnet: true});
        //     tx.signInput(0, {privateKey: a1.privateKey, address: a.address, redeemScript: a.script});
        //     equal(t, tx.serialize());
        // });
        //
        // it('sign P2SH_MULTISIG 4-10 of 15 step by step', () => {
        //     let t  = "01000000011c5dbac1a4028badbe2ec11db09682dbd9869e97cb9f9d4e83e5e169c25b1fcd00000000fd280300483045" +
        //          "0221008f649de02eb599f1c6b24a4719e85961f0c8b7b1e5fed544ea9afc03ff55f0410220494e49c7d7193ef7845475" +
        //          "92917005ab7bfa947f7c29bdfe869296d603ca1ba20147304402200ec9f3cb352a94a6df1227ff9c1b4236cf1a718d21" +
        //          "89591001935142d2a02bf5022069f48bcdbd2b9f9ecf0ce4170231aeb485264c7bfca86dd937c5840be7613a7d014830" +
        //          "45022100cb28f2d1ee5d1776d9f36dd07e7b76e86225ecc35088b02937cc7cf091cc10e402202617d6cb66a977dc2ee8" +
        //          "c58d3efd941dce595a7acc9ff9fdf374838a291b745b014830450221008d6e0f1d328e79ee93de4c31ffded81ecdbbe7" +
        //          "aa5c9a92949de91ef192a3e085022079de8336edf917d44030dc6428a4b6dc6d7991cc0b7844df01e38973eb16d68a01" +
        //          "4d0102542103b4603330291721c0a8e9cae65124a7099ecf0df3b46921d0e30c4220597702cb2102b2ec7de7e811c05a" +
        //          "af8443e3810483d5dbcf671512d9999f9c9772b0ce9da47a2102c711ad61c9fbd3600716b981d101cf0a000ab3524525" +
        //          "235c42f2cbcd8c17c6da21022388ccac4ff254b83e58f5013f86162fab940e4718d3bfede2622eb1aaa76ec721032d60" +
        //          "0f6d14d9d0014122ecb5ccba862da9842b68f71905652087138226a2b37921031963d545c640fed2400c6af7332ba9fd" +
        //          "06cdee09b72ae5fbff61a450340918492103bfebbdc81e1fd9ef1f1f04e53bd484298fb7381211cacb0dc46b33453102" +
        //          "4a7e210356399488ae0f1e13e8eef8b88b291e51f89041d9bf00acbaa5dfda4894f3c3952102c40b66c4671bc5ee03fc" +
        //          "22e84922ac7f2f8e063ee45628d28bb68ca38dc583d121023997c4745467ce88b747849191404b4fdb27323bbbc6e7e5" +
        //          "1cf63d22ba87015e21033add032f5d77c74c19d8dbe89c611917e263844974b13bc518817bc36f60afaf2102cfc901fd" +
        //          "07b9e187fea1842c68eb0ce319aea7fa4807abea7b7d3239a2dd64702102e94f4d60ee1912af627fdb5cf5650210af97" +
        //          "3c573a136e873da4816828fffcc02102576df3e588f34f592239a4b86d59e4cc0116b8f1b102cf36edf631a09c0ca963" +
        //          "2103b4bc5d45ed8219248cf1b62210b6c0ce71d86bb95b35d2e2a3cf456c483bac425faeffffffff01000e2707000000" +
        //          "001976a9145bfbbcfef367417bd85a5d51ae68a0221da3b45f88ac00000000";
        //
        //     let a1 = new Address("cPBuqn4ZsddXunx6EEev6khbfUzFnh3xxdEUPCrm5uy9qGcmbBEt", {addressType: "P2PKH", testnet: true});
        //     let a2 = new Address("cVgShyj2q4YKFX8VzCffuQcrJVYhp522NFozNi7ih2KgNVbnysKX", {addressType: "P2PKH", testnet: true});
        //     let a3 = new Address("cQWBhFENcN8bKEBsUHvpCyCfWVHDLfn1M65Gd6nenQkpEqL4DNUH", {addressType: "P2PKH", testnet: true});
        //     let a4 = new Address("cU6Av8QXbHH9diQJ63tSsrtPehQqCcJY6kEHF5UgrsSURChfiXq4", {addressType: "P2PKH", testnet: true});
        //     let a5 = new Address("cT35A2N2m1UPSGXuAHm4xZPhfYMUREVqyKe6f1jJvugk2wsMefoi", {addressType: "P2PKH", testnet: true});
        //     let a6 = new Address("cSGyUSV57VtJVRsobrG1nAmZpg9xZQ5eUcQnVvEmDH4VLwq4XwxX", {addressType: "P2PKH", testnet: true});
        //     let a7 = new Address("cNhEs9VxjbxKuvfunmhnQPNSgTLCzwT339iP75r9UmhLNriL3R2i", {addressType: "P2PKH", testnet: true});
        //     let a8 = new Address("cNEaZTTsHcVUYdrE8cRtqLJGdkGk3oghE9ZS6Zeb9y1T92rggKiT", {addressType: "P2PKH", testnet: true});
        //     let a9 = new Address("cUwC2prwKErK7VB7VW1wybE4cjvvyPvUDXFGtNQeinM2sKmGxpGX", {addressType: "P2PKH", testnet: true});
        //     let a10 = new Address("cVb6Jm2WJGWh9GDbRxtQ7KSsavqvGujhLYn29e6YQH12TaB49eXN", {addressType: "P2PKH", testnet: true});
        //     let a11 = new Address("cV8tWtYmaxqoqZnYFthA5xizAK7AM4Tm2dnnFBRHLhTw4TA2QfJb", {addressType: "P2PKH", testnet: true});
        //     let a12 = new Address("cP3zQV2ozq2pEUtFRapnPyhwTisbCug8QjwcuWMTdPLDAM5J4nMH", {addressType: "P2PKH", testnet: true});
        //     let a13 = new Address("cPyKxfC98PhMjsSS43B43YqHmcUv18XeMyfeUNdy3iPokzW9T911", {addressType: "P2PKH", testnet: true});
        //     let a14 = new Address("cUpMmtD81KTB9hHZ4YzGkMtghMh3pQxfKXTrApAyD6nVZWPHwE46", {addressType: "P2PKH", testnet: true});
        //     let a15 = new Address("cRh1T62pjkUGh6NKEEsKJ87Korbp1rw2GNxdzwmcPk5dUzn36aRy", {addressType: "P2PKH", testnet: true});
        //
        //     let a = ScriptAddress.multisig(4, 15, [a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15],
        //         {testnet: true, witnessVersion: null});
        //     equal(a.address, "2Mz8kUcHia2SYBe4dNYF7uKZcDWy7DHU3pZ");
        //
        //     let tx = new Transaction({testnet: true});
        //     tx.addInput({txId: "cd1f5bc269e1e5834e9d9fcb979e86d9db8296b01dc12ebead8b02a4c1ba5d1c"});
        //     tx.addOutput({value: 120000000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
        //     tx.signInput(0, {privateKey: [a1.privateKey, a9.privateKey], redeemScript: a.script, witnessVersion: null});
        //
        //     let rtx = tx.serialize();
        //
        //     tx = new Transaction({rawTx: rtx, testnet: true});
        //     tx.signInput(0, {privateKey: a3.privateKey, redeemScript: a.script, witnessVersion: null});
        //     rtx = tx.serialize();
        //
        //     tx = new Transaction({rawTx: rtx, testnet: true});
        //     tx.signInput(0, {privateKey: a15.privateKey, redeemScript: a.script, witnessVersion: null});
        //     equal(t, tx.serialize());
        //
        //     t = "0100000001967232c948bafa80eafc9459b2b7c2738cc87d14d7a1a3c980696389897da69700000000fd430600473044" +
        //          "0220696ad6a6ba02a3b0db932249c4e37d0462da11b3978b305c7af47e8f3af79dc5022049c14881f912502243028498" +
        //          "1ef1ba5b4e27cd4bc93767acb89e6329be7d0ddf0147304402200aae39bfa42043cfde4994610d5e193ff356a127ccba" +
        //          "317c3f25ef00c47ee5e602200f58ead8e69cfb5642924a891452eb8e166d868aa93fedc62d005b6f04bd1e9a01473044" +
        //          "02200a2953e9eec39d147f013d63320bf9ae272536794fba8719dd0dcb7b1efaa49102203ee41f5264737352727bccd7" +
        //          "6a32fecf3f56f66962dfa690d742361a327331db01483045022100ac93a6dcf823ea67489b58483618a5c878a8e18f08" +
        //          "9bd4ed9c0cf416207e855a022018f4dfafa887581bd466a0bb4cf6fa0ae984c7f3451c2bfc12673a9e5151df1a014830" +
        //          "45022100f3f42ac1e0384d317447cc34c5583f1ac56b3e18b057b2e971e9736ad389dc7e022042fc92864136bd37f26c" +
        //          "7e9e1f96b7ac79d4ac98ab9250a03e97cb0843b1b03701483045022100f6f420c77fae5e6eb7830727886e861596d755" +
        //          "97db5ea7351c0926b512f4402502204eb1c1958d627dbe7733f4ff6a1f3a5d531841db5ec9c955f414ec665b4c894101" +
        //          "47304402205004b556afb3ec48081938ef62b9b1c97bf71320c235a5d39d1aab3adb79545502203da05cbddab322c555" +
        //          "d8664dbf552adbac2fb59a0dc58f26cd080d64d2864a4a0147304402203da589e72cd1e7b1855ef9a545928c68b4ac1d" +
        //          "8bc05a5d25c60a29e1ed790ae702201400f3adcb3ac6dd45ba2002c1966cb14268d80afadb231b20eafdfeecf0bcbf01" +
        //          "483045022100fedb21c44371aa838c293596716399de122d03100ef2e828cfee5c1b8d841ab0022008cdf3d89abc5fef" +
        //          "2eaf88f96bedeac27df352f4e03db2fbcb247d642a9bd60e0147304402202b0872bfd3b28a7b0fc87e6d929b46efde32" +
        //          "d97d0029f66f93d2a5bbe287bcd60220131e082881fa1dc7c83c715ea936f03fefe2d5b87b630f5b818049aecdb9a1bb" +
        //          "01483045022100c1d9c33a0df2caa7ace6293e35dc91d9c863ae0dc7ccc315ca0a1fc33151981802203ca9c47e70c92b" +
        //          "1ef9fdcc28321ec96ccf18feec60bd2054ad4510d5872a6af7014730440220168e5b03e8f55bb46fb3329420c5c8aa55" +
        //          "1c1b77f1c23c585a3ea4127c2e508d022062c7745f038c83cad56f0c97afac0a7aabb56403e22b35fe45cad31227d149" +
        //          "e50148304502210088bac04a079105467d1fe38da55b1b116f586af87d09dc227024b4da0089d2b902204fd087024da0" +
        //          "a731a9f0f03ada61634670511de9b093d312d30c5627a4dcde44014730440220354ea1d887596083196bdcde56a0de99" +
        //          "d9d927802c6723544b219134809a1e2502202104071d382689bf0b75549f90ba65d28b1f733c38e783d977a17a107d81" +
        //          "365e0147304402202916e12169c5487dc650d5ed774568623e366ab278ccffd860ce9b18a6a6d7a1022047ceee8dd9ff" +
        //          "dd1f16ceae2574113adbbcdbb228699079762b44ad427fd68864014d01025f2103b4603330291721c0a8e9cae65124a7" +
        //          "099ecf0df3b46921d0e30c4220597702cb2102b2ec7de7e811c05aaf8443e3810483d5dbcf671512d9999f9c9772b0ce" +
        //          "9da47a2102c711ad61c9fbd3600716b981d101cf0a000ab3524525235c42f2cbcd8c17c6da21022388ccac4ff254b83e" +
        //          "58f5013f86162fab940e4718d3bfede2622eb1aaa76ec721032d600f6d14d9d0014122ecb5ccba862da9842b68f71905" +
        //          "652087138226a2b37921031963d545c640fed2400c6af7332ba9fd06cdee09b72ae5fbff61a450340918492103bfebbd" +
        //          "c81e1fd9ef1f1f04e53bd484298fb7381211cacb0dc46b334531024a7e210356399488ae0f1e13e8eef8b88b291e51f8" +
        //          "9041d9bf00acbaa5dfda4894f3c3952102c40b66c4671bc5ee03fc22e84922ac7f2f8e063ee45628d28bb68ca38dc583" +
        //          "d121023997c4745467ce88b747849191404b4fdb27323bbbc6e7e51cf63d22ba87015e21033add032f5d77c74c19d8db" +
        //          "e89c611917e263844974b13bc518817bc36f60afaf2102cfc901fd07b9e187fea1842c68eb0ce319aea7fa4807abea7b" +
        //          "7d3239a2dd64702102e94f4d60ee1912af627fdb5cf5650210af973c573a136e873da4816828fffcc02102576df3e588" +
        //          "f34f592239a4b86d59e4cc0116b8f1b102cf36edf631a09c0ca9632103b4bc5d45ed8219248cf1b62210b6c0ce71d86b" +
        //          "b95b35d2e2a3cf456c483bac425faeffffffff01000e2707000000001976a9145bfbbcfef367417bd85a5d51ae68a022" +
        //          "1da3b45f88ac00000000";
        //
        //     a = ScriptAddress.multisig(15, 15, [a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15],
        //         {testnet: true, witnessVersion: null});
        //
        //     equal(a.address, "2N5Z12YFKCzmk8jJKxRQG48ZeAo9fdMFXt6");
        //     tx = new Transaction({testnet: 1});
        //     tx.addInput({txId: "97a67d8989636980c9a3a1d7147dc88c73c2b7b25994fcea80faba48c9327296"});
        //     tx.addOutput({value: 120000000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
        //     tx.signInput(0, {privateKey: [a1.privateKey, a2.privateKey, a3.privateKey],
        //         redeemScript: a.script, witnessVersion: null});
        //     rtx = tx.serialize();
        //
        //     tx = new Transaction({rawTx: rtx, testnet: 1});
        //     tx.signInput(0, {privateKey: a4.privateKey, redeemScript: a.script, witnessVersion: null});
        //     rtx = tx.serialize();
        //     tx = new Transaction({rawTx: rtx, testnet: 1});
        //     tx.signInput(0, {privateKey: a5.privateKey, redeemScript: a.script, witnessVersion: null});
        //     rtx = tx.serialize();
        //     tx = new Transaction({rawTx: rtx, testnet: 1});
        //     tx.signInput(0, {privateKey: a6.privateKey, redeemScript: a.script, witnessVersion: null});
        //     rtx = tx.serialize();
        //     tx = new Transaction({rawTx: rtx, testnet: 1});
        //     tx.signInput(0, {privateKey: a7.privateKey, redeemScript: a.script, witnessVersion: null});
        //     rtx = tx.serialize();
        //     tx = new Transaction({rawTx: rtx, testnet: 1});
        //     tx.signInput(0, {privateKey: a8.privateKey, redeemScript: a.script, witnessVersion: null});
        //     rtx = tx.serialize();
        //     tx = new Transaction({rawTx: rtx, testnet: 1});
        //     tx.signInput(0, {privateKey: a9.privateKey, redeemScript: a.script, witnessVersion: null});
        //     rtx = tx.serialize();
        //     tx = new Transaction({rawTx: rtx, testnet: 1});
        //     tx.signInput(0, {privateKey: a10.privateKey, redeemScript: a.script, witnessVersion: null});
        //     rtx = tx.serialize();
        //     tx = new Transaction({rawTx: rtx, testnet: 1});
        //     tx.signInput(0, {privateKey: a11.privateKey, redeemScript: a.script, witnessVersion: null});
        //     rtx = tx.serialize();
        //     tx = new Transaction({rawTx: rtx, testnet: 1});
        //     tx.signInput(0, {privateKey: a12.privateKey, redeemScript: a.script, witnessVersion: null});
        //     rtx = tx.serialize();
        //     tx = new Transaction({rawTx: rtx, testnet: 1});
        //     tx.signInput(0, {privateKey: a13.privateKey, redeemScript: a.script, witnessVersion: null});
        //     rtx = tx.serialize();
        //     tx = new Transaction({rawTx: rtx, testnet: 1});
        //     tx.signInput(0, {privateKey: a14.privateKey, redeemScript: a.script, witnessVersion: null});
        //     rtx = tx.serialize();
        //     tx = new Transaction({rawTx: rtx, testnet: 1});
        //     tx.signInput(0, {privateKey: a15.privateKey, redeemScript: a.script, witnessVersion: null});
        //     equal(t, tx.serialize());
        //
        //     // same tx random sign order
        //     tx = new Transaction({testnet: 1});
        //     tx.addInput({txId: "97a67d8989636980c9a3a1d7147dc88c73c2b7b25994fcea80faba48c9327296"});
        //     tx.addOutput({value: 120000000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
        //     tx.signInput(0, {privateKey: [a8.privateKey, a2.privateKey, a13.privateKey],
        //         redeemScript: a.script, witnessVersion: null});
        //     rtx = tx.serialize();
        //     tx = new Transaction({rawTx: rtx, testnet: 1});
        //     tx.signInput(0, {privateKey: a1.privateKey, redeemScript: a.script, witnessVersion: null});
        //     rtx = tx.serialize();
        //     tx = new Transaction({rawTx: rtx, testnet: 1});
        //     tx.signInput(0, {privateKey: a5.privateKey, redeemScript: a.script, witnessVersion: null});
        //     rtx = tx.serialize();
        //     tx = new Transaction({rawTx: rtx, testnet: 1});
        //     tx.signInput(0, {privateKey: a15.privateKey, redeemScript: a.script, witnessVersion: null});
        //     rtx = tx.serialize();
        //     tx = new Transaction({rawTx: rtx, testnet: 1});
        //     tx.signInput(0, {privateKey: a7.privateKey, redeemScript: a.script, witnessVersion: null});
        //     rtx = tx.serialize();
        //     tx = new Transaction({rawTx: rtx, testnet: 1});
        //     tx.signInput(0, {privateKey: a10.privateKey, redeemScript: a.script, witnessVersion: null});
        //     rtx = tx.serialize();
        //     tx = new Transaction({rawTx: rtx, testnet: 1});
        //     tx.signInput(0, {privateKey: a9.privateKey, redeemScript: a.script, witnessVersion: null});
        //     rtx = tx.serialize();
        //     tx = new Transaction({rawTx: rtx, testnet: 1});
        //     tx.signInput(0, {privateKey: a12.privateKey, redeemScript: a.script, witnessVersion: null});
        //     rtx = tx.serialize();
        //     tx = new Transaction({rawTx: rtx, testnet: 1});
        //     tx.signInput(0, {privateKey: a11.privateKey, redeemScript: a.script, witnessVersion: null});
        //     rtx = tx.serialize();
        //     tx = new Transaction({rawTx: rtx, testnet: 1});
        //     tx.signInput(0, {privateKey: a14.privateKey, redeemScript: a.script, witnessVersion: null});
        //     rtx = tx.serialize();
        //     tx = new Transaction({rawTx: rtx, testnet: 1});
        //     tx.signInput(0, {privateKey: a3.privateKey, redeemScript: a.script, witnessVersion: null});
        //     rtx = tx.serialize();
        //     tx = new Transaction({rawTx: rtx, testnet: 1});
        //     tx.signInput(0, {privateKey: a6.privateKey, redeemScript: a.script, witnessVersion: null});
        //     rtx = tx.serialize();
        //     tx = new Transaction({rawTx: rtx, testnet: 1});
        //     tx.signInput(0, {privateKey: a4.privateKey, redeemScript: a.script, witnessVersion: null});
        //     equal(t, tx.serialize());
        // });

        // it('sign P2SH_P2WPKH', () => {
        //     let rtx = "0100000001db6b1b20aa0fd7b23880be2ecbd4a98130974cf4748fb66092ac4d3ceb1a54770100000000feffffff02b8b4eb0" +
        //      "b000000001976a914a457b684d7f0d539a46a45bbc043f35b59d0d96388ac0008af2f000000001976a914fd270b1ee6abcaea" +
        //      "97fea7ad0402e8bd8ad6d77c88ac92040000";
        //     let tx = new Transaction({rawTx: rtx});
        //     tx.signInput(0, {privateKey: "eb696a065ef48a2192da5b28b694f87544b30fae8327c4510137a922f32c6dcf",
        //         redeemScript: "001479091972186c449eb1ded22b78e40d009bdf0089",
        //         value: 1000000000, witnessVersion: null});
        //     rtx = "01000000000101db6b1b20aa0fd7b23880be2ecbd4a98130974cf4748fb66092ac4d3ceb1a54770100000017160014790919721" +
        //     "86c449eb1ded22b78e40d009bdf0089feffffff02b8b4eb0b000000001976a914a457b684d7f0d539a46a45bbc043f35b59d0d9" +
        //     "6388ac0008af2f000000001976a914fd270b1ee6abcaea97fea7ad0402e8bd8ad6d77c88ac02473044022047ac8e878352d3ebb" +
        //     "de1c94ce3a10d057c24175747116f8288e5d794d12d482f0220217f36a485cae903c713331d877c1f64677e3622ad4010726870" +
        //     "540656fe9dcb012103ad1d8e89212f0b92c74d23bb710c00662ad1470198ac48c43f7d6f93a2a2687392040000";
        //     equal(rtx, tx.serialize());
        // });

        it('sign P2WPKH', () => {
            let rtx = "0200000000010151ab0ce41d17c55597011e798f6e634704cfd22d0debf0c4e0ee9c2c9cbb5f8e0000000000ffffffff0118ddf50500000000160014e0a5424502ad701c79ed7cb53f7ceabe9fd3b1e30247304402207b07de070579ec1c481ec858f339ea02b8269f554e70130e6f94f0dfe84dc45402202bfab5d7877ddcf57c7afd5dead1d708940382231007c166f83c31247d71c97d01210384fcc40094f0bdf493483dd5db6c7985d10122ef599e59be7436b59ca50de574c37e0000";




            //
            // let c = new Address("L1CSJUEiLXUm5WZpiz7EjhsZpZAzgFYWzQNX5Eheam8dbkDbk93X");
            // console.log("address ->", c.address);
            // let t = new Transaction({lockTime: 32423});
            // t.addInput({txId: "c313033d60c595aaeeed04c4c1343397219e17d6b8b6254b5b76242f4c49c47b",
            //     vOut: 1,
            //     sequence: 4294967293,
            //     address: "bgl1qrsy7t3wgdh68lf09xzqsd3v2zuga2gx9dhy40q"});
            // t.addOutput({value: 100000000, address: "bgl1qrujz90dzsd5cle8yy7lm546saregcjmzt4g4kl"});
            // t.addOutput({value: 1359992734, address: "bgl1quzj5y3gz44cpc70d0j6n7l82h60a8v0rwf0pjq"});
            // t.signInput(0, {privateKey: "L1CSJUEiLXUm5WZpiz7EjhsZpZAzgFYWzQNX5Eheam8dbkDbk93X",
            //     sigHashType: SIGHASH_ALL, value: 1459992875});
            // console.log(t.serialize({segwit:false}));
            // console.log(t);
            // console.log(t.vIn[0].txInWitness);




            let a = new Address("KyfrGSgiv9rSiXiXBhJnDyZz8DU8VJdKYcbMGPginJUhrx7VSvAY");
            console.log(a.address);
            let tx = new Transaction({lockTime: 32451});
            tx.addInput({txId: "8e5fbb9c2c9ceee0c4f0eb0d2dd2cf0447636e8f791e019755c5171de40cab51",
                vOut: 0,
                address: "bgl1qrujz90dzsd5cle8yy7lm546saregcjmzt4g4kl"});
            tx.addOutput({value: 99999000, address: "bgl1quzj5y3gz44cpc70d0j6n7l82h60a8v0rwf0pjq"});
            tx.signInput(0, {privateKey: "KyfrGSgiv9rSiXiXBhJnDyZz8DU8VJdKYcbMGPginJUhrx7VSvAY",
                sigHashType: SIGHASH_ALL, value: 100000000});
            // https://bgl.bitaps.com/78c5454deb539ca6712a548ecef6b84061d79318a3ff565ce9854f403c37cc59
            equal(rtx, tx.serialize());

        });

        //
        // it('sign P2WSH MULTISIG', () => {
        //     let rtx = "010000000001018aea147516fb825c06e26c4a0fe7cbfe6a280c3e5c215e616def5741970f45160000000000ffffffff01c0270" +
        //     "900000000001976a9145bfbbcfef367417bd85a5d51ae68a0221da3b45f88ac0300483045022100df55ebb3874fee1a5993162f" +
        //     "22ab8484faf278b32340f1ccc43cd4ef60926d64022029522a37d65968b6b80090abf6beaa2d5b6a416b8a5cdc9ceb13e6b6997" +
        //     "9ed9a0169512103b4603330291721c0a8e9cae65124a7099ecf0df3b46921d0e30c4220597702cb2102b2ec7de7e811c05aaf84" +
        //     "43e3810483d5dbcf671512d9999f9c9772b0ce9da47a2102c711ad61c9fbd3600716b981d101cf0a000ab3524525235c42f2cbc" +
        //     "d8c17c6da53ae00000000";
        //
        //     let a1 = new Address("cPBuqn4ZsddXunx6EEev6khbfUzFnh3xxdEUPCrm5uy9qGcmbBEt", {addressType: 'P2PKH', testnet: true});
        //     let a2 = new Address("cVgShyj2q4YKFX8VzCffuQcrJVYhp522NFozNi7ih2KgNVbnysKX", {addressType: 'P2PKH', testnet: true});
        //     let a3 = new Address("cQWBhFENcN8bKEBsUHvpCyCfWVHDLfn1M65Gd6nenQkpEqL4DNUH", {addressType: 'P2PKH', testnet: true});
        //     let a = ScriptAddress.multisig(1, 3, [a1, a2, a3], {testnet: true});
        //     equal(a.address, "tbgl1qcmdwjnv7yv6csp3ft8xw06jzvkzgl8xvjv5wdn85nefqpq3m29rst82pm2");
        //     let tx = new Transaction({testnet: true});
        //     tx.addInput({txId: "16450f974157ef6d615e215c3e0c286afecbe70f4a6ce2065c82fb167514ea8a"});
        //     tx.addOutput({value: 600000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
        //     tx.signInput(0, {privateKey: "cPBuqn4ZsddXunx6EEev6khbfUzFnh3xxdEUPCrm5uy9qGcmbBEt",
        //         redeemScript: a.script, value: 700000});
        //     equal(rtx, tx.serialize());
        //
        // });
        //
        // it('sign P2SH P2WSH MULTISIG', () => {
        //     let rtx = "010000000136641869ca081e70f394c6948e8af409e18b619df2ed74aa106c1ca29787b96e0100000000ffffffff0200e9a4350" +
        //     "00000001976a914389ffce9cd9ae88dcc0631e88a821ffdbe9bfe2688acc0832f05000000001976a9147480a33f950689af511e" +
        //     "6e84c138dbbd3c3ee41588ac00000000";
        //
        //     let redeem = "56210307b8ae49ac90a048e9b53357a2354b3334e9c8bee813ecb98e99a7e07e8c3ba32103b28f0c28bfab54554ae8c658" +
        //          "ac5c3e0ce6e79ad336331f78c428dd43eea8449b21034b8113d703413d57761b8b9781957b8c0ac1dfe69f492580ca4195" +
        //          "f50376ba4a21033400f6afecb833092a9a21cfdf1ed1376e58c5d1f47de74683123987e967a8f42103a6d48b1131e94ba0" +
        //          "4d9737d61acdaa1322008af9602b3b14862c07a1789aac162102d8b661b0b3302ee2f162b09e07a55ad5dfbe673a9f01d9" +
        //          "f0c19617681024306b56ae";
        //
        //     let tx = new Transaction({rawTx: rtx});
        //     tx.signInput(0, {privateKey: "730fff80e1413068a05b57d6a58261f07551163369787f349438ea38ca80fac6",
        //         redeemScript: redeem, value: 987654321, p2sh_p2wsh: true});
        //     tx.signInput(0, {privateKey: "11fa3d25a17cbc22b29c44a484ba552b5a53149d106d3d853e22fdd05a2d8bb3",
        //         redeemScript: redeem, value: 987654321, p2sh_p2wsh: true, sigHashType: SIGHASH_NONE});
        //     tx.signInput(0, {privateKey: "77bf4141a87d55bdd7f3cd0bdccf6e9e642935fec45f2f30047be7b799120661",
        //         redeemScript: redeem, value: 987654321, p2sh_p2wsh: true, sigHashType: SIGHASH_SINGLE});
        //     tx.signInput(0, {privateKey: "14af36970f5025ea3e8b5542c0f8ebe7763e674838d08808896b63c3351ffe49",
        //         redeemScript: redeem, value: 987654321, p2sh_p2wsh: true,
        //         sigHashType: SIGHASH_ALL | SIGHASH_ANYONECANPAY});
        //     tx.signInput(0, {privateKey: "fe9a95c19eef81dde2b95c1284ef39be497d128e2aa46916fb02d552485e0323",
        //         redeemScript: redeem, value: 987654321, p2sh_p2wsh: true,
        //         sigHashType: SIGHASH_NONE | SIGHASH_ANYONECANPAY});
        //     tx.signInput(0, {privateKey: "428a7aee9f0c2af0cd19af3cf1c78149951ea528726989b2e83e4778d2c3f890",
        //         redeemScript: redeem, value: 987654321, p2sh_p2wsh: true,
        //         sigHashType: SIGHASH_SINGLE | SIGHASH_ANYONECANPAY});
        //
        //     let r =  "0100000000010136641869ca081e70f394c6948e8af409e18b619df2ed74aa106c1ca29787b96e0100000023220020a16b5755f" +
        //     "7f6f96dbd65f5f0d6ab9418b89af4b1f14a1bb8a09062c35f0dcb54ffffffff0200e9a435000000001976a914389ffce9cd9ae8" +
        //     "8dcc0631e88a821ffdbe9bfe2688acc0832f05000000001976a9147480a33f950689af511e6e84c138dbbd3c3ee41588ac08004" +
        //     "7304402206ac44d672dac41f9b00e28f4df20c52eeb087207e8d758d76d92c6fab3b73e2b0220367750dbbe19290069cba53d09" +
        //     "6f44530e4f98acaa594810388cf7409a1870ce01473044022068c7946a43232757cbdf9176f009a928e1cd9a1a8c212f15c1e11" +
        //     "ac9f2925d9002205b75f937ff2f9f3c1246e547e54f62e027f64eefa2695578cc6432cdabce271502473044022059ebf56d9801" +
        //     "0a932cf8ecfec54c48e6139ed6adb0728c09cbe1e4fa0915302e022007cd986c8fa870ff5d2b3a89139c9fe7e499259875357e2" +
        //     "0fcbb15571c76795403483045022100fbefd94bd0a488d50b79102b5dad4ab6ced30c4069f1eaa69a4b5a763414067e02203156" +
        //     "c6a5c9cf88f91265f5a942e96213afae16d83321c8b31bb342142a14d16381483045022100a5263ea0553ba89221984bd7f0b13" +
        //     "613db16e7a70c549a86de0cc0444141a407022005c360ef0ae5a5d4f9f2f87a56c1546cc8268cab08c73501d6b3be2e1e1a8a08" +
        //     "824730440220525406a1482936d5a21888260dc165497a90a15669636d8edca6b9fe490d309c022032af0c646a34a44d1f4576b" +
        //     "f6a4a74b67940f8faa84c7df9abe12a01a11e2b4783cf56210307b8ae49ac90a048e9b53357a2354b3334e9c8bee813ecb98e99" +
        //     "a7e07e8c3ba32103b28f0c28bfab54554ae8c658ac5c3e0ce6e79ad336331f78c428dd43eea8449b21034b8113d703413d57761" +
        //     "b8b9781957b8c0ac1dfe69f492580ca4195f50376ba4a21033400f6afecb833092a9a21cfdf1ed1376e58c5d1f47de746831239" +
        //     "87e967a8f42103a6d48b1131e94ba04d9737d61acdaa1322008af9602b3b14862c07a1789aac162102d8b661b0b3302ee2f162b" +
        //     "09e07a55ad5dfbe673a9f01d9f0c19617681024306b56ae00000000";
        //     equal(r, tx.serialize());
        //
        //     // sign same P2SH-P2WSH-MULTISIG random sign order
        //     tx = new Transaction({rawTx: rtx});
        //     tx.signInput(0, {privateKey: "428a7aee9f0c2af0cd19af3cf1c78149951ea528726989b2e83e4778d2c3f890",
        //         redeemScript: redeem, value: 987654321, p2sh_p2wsh: true,
        //         sigHashType: SIGHASH_SINGLE | SIGHASH_ANYONECANPAY});
        //     tx.signInput(0, {privateKey: "730fff80e1413068a05b57d6a58261f07551163369787f349438ea38ca80fac6",
        //         redeemScript: redeem, value: 987654321, p2sh_p2wsh: true});
        //     tx.signInput(0, {privateKey: "fe9a95c19eef81dde2b95c1284ef39be497d128e2aa46916fb02d552485e0323",
        //         redeemScript: redeem, value: 987654321, p2sh_p2wsh: true,
        //         sigHashType: SIGHASH_NONE | SIGHASH_ANYONECANPAY});
        //     tx.signInput(0, {privateKey: "14af36970f5025ea3e8b5542c0f8ebe7763e674838d08808896b63c3351ffe49",
        //         redeemScript: redeem, value: 987654321, p2sh_p2wsh: true,
        //         sigHashType: SIGHASH_ALL | SIGHASH_ANYONECANPAY});
        //     tx.signInput(0, {privateKey: "11fa3d25a17cbc22b29c44a484ba552b5a53149d106d3d853e22fdd05a2d8bb3",
        //         redeemScript: redeem, value: 987654321, p2sh_p2wsh: true, sigHashType: SIGHASH_NONE});
        //     tx.signInput(0, {privateKey: "77bf4141a87d55bdd7f3cd0bdccf6e9e642935fec45f2f30047be7b799120661",
        //         redeemScript: redeem, value: 987654321, p2sh_p2wsh: true, sigHashType: SIGHASH_SINGLE});
        //     equal(r, tx.serialize());
        //
        //     //  sign same P2SH-P2WSH-MULTISIG random sign order with raw Transaction representation
        //     tx = new Transaction({rawTx: rtx, format: "raw"});
        //     tx.signInput(0, {privateKey: "428a7aee9f0c2af0cd19af3cf1c78149951ea528726989b2e83e4778d2c3f890",
        //         redeemScript: redeem, value: 987654321, p2sh_p2wsh: true,
        //         sigHashType: SIGHASH_SINGLE | SIGHASH_ANYONECANPAY});
        //     tx.signInput(0, {privateKey: "730fff80e1413068a05b57d6a58261f07551163369787f349438ea38ca80fac6",
        //         redeemScript: redeem, value: 987654321, p2sh_p2wsh: true});
        //     tx.signInput(0, {privateKey: "fe9a95c19eef81dde2b95c1284ef39be497d128e2aa46916fb02d552485e0323",
        //         redeemScript: redeem, value: 987654321, p2sh_p2wsh: true,
        //         sigHashType: SIGHASH_NONE | SIGHASH_ANYONECANPAY});
        //     tx.signInput(0, {privateKey: "14af36970f5025ea3e8b5542c0f8ebe7763e674838d08808896b63c3351ffe49",
        //         redeemScript: redeem, value: 987654321, p2sh_p2wsh: true,
        //         sigHashType: SIGHASH_ALL | SIGHASH_ANYONECANPAY});
        //     tx.signInput(0, {privateKey: "11fa3d25a17cbc22b29c44a484ba552b5a53149d106d3d853e22fdd05a2d8bb3",
        //         redeemScript: redeem, value: 987654321, p2sh_p2wsh: true, sigHashType: SIGHASH_NONE});
        //     tx.signInput(0, {privateKey: "77bf4141a87d55bdd7f3cd0bdccf6e9e642935fec45f2f30047be7b799120661",
        //         redeemScript: redeem, value: 987654321, p2sh_p2wsh: true, sigHashType: SIGHASH_SINGLE});
        // });
        //
        // it('sign BARE MULTISIG', () => {
        //     let a1 = new Address("cPBuqn4ZsddXunx6EEev6khbfUzFnh3xxdEUPCrm5uy9qGcmbBEt",
        //         {addressType: "P2PKH", testnet: true});
        //
        //     let a2 = new Address("cVgShyj2q4YKFX8VzCffuQcrJVYhp522NFozNi7ih2KgNVbnysKX",
        //         {addressType: "P2PKH", testnet: true});
        //     let a3 = new Address("cQWBhFENcN8bKEBsUHvpCyCfWVHDLfn1M65Gd6nenQkpEqL4DNUH",
        //         {addressType: "P2PKH", testnet: true});
        //     let script = Buffer.concat([Buffer.from([OPCODE.OP_2]),
        //                                 opPushData(a1.publicKey.key),
        //                                 opPushData(a2.publicKey.key),
        //                                 opPushData(a3.publicKey.key),
        //                                 Buffer.from([OPCODE.OP_3]),
        //                                 Buffer.from([OPCODE.OP_CHECKMULTISIG])]);
        //     equal(a1.address, "mwJMtn5hW54pJC748EExvhRm6FRVmUZXQt");
        //     // create funding transaction for bare multisig
        //     // https://tbtc.bitaps.com/cfe002d20590e2400a26b2dd9e2e6af2369cbb1f5442af286485841798590068
        //     let tx = new Transaction({testnet: true});
        //     tx.addInput({txId: "d791f8386516bc464e7702159775734559d884a3fd50e45191c6207cdedac8ae"});
        //     tx.addOutput({value: 64000000, scriptPubKey: script});
        //     tx.signInput(0, {privateKey: "cPBuqn4ZsddXunx6EEev6khbfUzFnh3xxdEUPCrm5uy9qGcmbBEt",
        //         address: "mwJMtn5hW54pJC748EExvhRm6FRVmUZXQt"});
        //     let rtx =  "0100000001aec8dade7c20c69151e450fda384d859457375971502774e46bc166538f891d7000000" +
        //                          "006a47304402200edb1ded443ea8015390c38afeb0564b52f6f9895c45952461f6ccfaf6639b8402" +
        //                          "206c0d3bfd2f7d8c68d5cc3c774a9403d843cd27e33148927e3f575607b91d05c2012103b4603330" +
        //                          "291721c0a8e9cae65124a7099ecf0df3b46921d0e30c4220597702cbffffffff010090d003000000" +
        //                          "0069522103b4603330291721c0a8e9cae65124a7099ecf0df3b46921d0e30c4220597702cb2102b2" +
        //                          "ec7de7e811c05aaf8443e3810483d5dbcf671512d9999f9c9772b0ce9da47a2102c711ad61c9fbd3" +
        //                          "600716b981d101cf0a000ab3524525235c42f2cbcd8c17c6da53ae00000000";
        //     equal(tx.serialize(), rtx);
        //
        //     tx = new Transaction({testnet: true});
        //     tx.addInput({txId: "cfe002d20590e2400a26b2dd9e2e6af2369cbb1f5442af286485841798590068"});
        //     tx.addOutput({value: 63000000, address: "mwJMtn5hW54pJC748EExvhRm6FRVmUZXQt"});
        //     tx.signInput(0, {privateKey: ["cPBuqn4ZsddXunx6EEev6khbfUzFnh3xxdEUPCrm5uy9qGcmbBEt",
        //             "cVgShyj2q4YKFX8VzCffuQcrJVYhp522NFozNi7ih2KgNVbnysKX"], scriptPubKey: script});
        //     let t = "0100000001680059981784856428af42541fbb9c36f26a2e9eddb2260a40e29005d202e" +
        //     "0cf000000009300483045022100a7383d84ee35fb965978144d9243ca0892a1be81ce70" +
        //     "058e70b2ba1ea5a762a7022058647d131fcec2e3a63e57fa475b779b94c81a95b5c164f" +
        //     "dfdbcee0124e3448c01483045022100b3945861a5a8a406bd575857e19accdb0f6385eb" +
        //     "f1c02938b35462cddeef400802205857f56d83e9ed7e98082d9127b8934262d3a046142" +
        //     "9747e865b06345bbf8f9e01ffffffff01c04dc103000000001976a914ad204de226b3d1" +
        //     "1a70dc53b4998f4603e138ff3f88ac00000000";
        //     equal(tx.serialize(), t);
        //
        //     tx = new Transaction({testnet: true});
        //     tx.addInput({txId: "cfe002d20590e2400a26b2dd9e2e6af2369cbb1f5442af286485841798590068"});
        //     tx.addOutput({value: 63000000, address: "mwJMtn5hW54pJC748EExvhRm6FRVmUZXQt"});
        //     tx.signInput(0, {privateKey: "cPBuqn4ZsddXunx6EEev6khbfUzFnh3xxdEUPCrm5uy9qGcmbBEt",
        //         scriptPubKey: script});
        //     tx.signInput(0, {privateKey: ["cVgShyj2q4YKFX8VzCffuQcrJVYhp522NFozNi7ih2KgNVbnysKX"],
        //         scriptPubKey: script});
        //     equal(tx.serialize(), t);
        //
        //     tx = new Transaction({testnet: true});
        //     tx.addInput({txId: "cfe002d20590e2400a26b2dd9e2e6af2369cbb1f5442af286485841798590068"});
        //     tx.addOutput({value: 63000000, address: "mwJMtn5hW54pJC748EExvhRm6FRVmUZXQt"});
        //     tx.signInput(0, {privateKey: ["cVgShyj2q4YKFX8VzCffuQcrJVYhp522NFozNi7ih2KgNVbnysKX"],
        //         scriptPubKey: script});
        //     tx.signInput(0, {privateKey: "cPBuqn4ZsddXunx6EEev6khbfUzFnh3xxdEUPCrm5uy9qGcmbBEt",
        //         scriptPubKey: script});
        //     equal(tx.serialize(), t);
        //
        // });
    });


    describe("Wallet class:", function () {
        it('Wallet from master xPriv key', async () => {
            let w = new Wallet({from: "xprv9s21ZrQH143K3V76RxiKKREaBYgPkxDtJk2JFZeKT5oUWM5odhxf6VVKWcWYsxkn8zthgTxaxZ4ao5MDuoQ3AxxkZErhAY86wNfkCGn9MTa",});
            equal(w.masterXPrivateKey, "xprv9s21ZrQH143K3V76RxiKKREaBYgPkxDtJk2JFZeKT5oUWM5odhxf6VVKWcWYsxkn8zthgTxaxZ4ao5MDuoQ3AxxkZErhAY86wNfkCGn9MTa");
            equal(w.accountXPrivateKey, "xprv9xy9pW6QriePuzgpsBLoRjSE5ZhzVpdkPNF4377deALRSQ4RJRfBDvfz2XuqHNYSHy175udJTUodKeYWusgqbK4sTuhb1EoB1mcWzKFQR4u");
            equal(w.accountXPublicKey, "xpub6BxWE1dJh6Ch8UmHyCsonsNxdbYUuHMbkbAeqVXFCVsQKCPZqxyRmizTsr6d6WvfJpNSnUQy2yi9d6jZVSR5NzgaXjYqn95J93yQC5PqkZk");
            equal(w.externalChainXPrivateKey, "xprvA1LwXrHHrvp1QRhKRBkG82YoUKZmsmn887gH7fhgWYSc135bSdDdU7rhe73pkc95S24kL88vTXdQyjyNzAETQWkU2SBXn7zqJQgZgAvosx1");
            equal(w.externalChainXPublicKey, "xpub6ELHwMpBhJNJcumnXDHGVAVY2MQGHEVyVLbsv47J4syasqQjzAXt1vBBVN8s1jxTKniP4NypmswJBsGK1PQQ49WvvrDNUtHYN8h9SX24nuV");
            equal(w.internalChainXPrivateKey, "xprvA1LwXrHHrvp1Ub1i8zPEd7WPqmnbmd8K2dXihAqmdew6FaMSLMGdStw3UwjFsXYtngpoJoK4CwzV8GEBpCxDQeA54pY2XEy55qHVqWhWpDi");
            equal(w.internalChainXPublicKey, "xpub6ELHwMpBhJNJh56BF1vEzFT8Pod6B5rAPrTKVZFPBzU58NgastaszhFXLBchcsuNwTZLrVgcAJGvrHRQBA33B3UcbRqWwYg3AVhVn7MoCzv");
            equal(w.path, "m/44'/0'/0'/0");
            equal(w.pathType, "BIP44");
            equal(w.depth, 0);
            w = new Wallet({from: "yprvABrGsX5C9jantnJDGKVwXWL5MWpqhaDPDrYX2xYCq6BMZSu2tN8DiZ9TXpU8ssQhYe1WRwZ9RDR8gMxndVp3yCeMRaZ7kSwbD6jPaq7NqCU",});
            equal(w.masterXPrivateKey, "yprvABrGsX5C9jantnJDGKVwXWL5MWpqhaDPDrYX2xYCq6BMZSu2tN8DiZ9TXpU8ssQhYe1WRwZ9RDR8gMxndVp3yCeMRaZ7kSwbD6jPaq7NqCU");
            equal(w.accountXPrivateKey, "yprvAKNoUVXZ3WtAnEuayKC5MnMSVvLqAjcrWb5n4FB5Mp5QHv2nQrFDNj8nAwx5kgiNPEZVgJmJhCK24axgrvH47oFSMzeB2E1jP9wtYYt4k55");
            equal(w.accountXPublicKey, "ypub6YN9t14SstSTziz45Lj5ivJB3xBKaCLhsp1Nrdagv9cPAiMvxPZTvXTG2D6jnsmGUUK13bDkDVEQu4F2DQpRcd72vHBb2neDf9TRAm9E7K6");
            equal(w.externalChainXPrivateKey, "yprvAKfNZUdQw7jVb7mt1b6CCE6b4VCwU35yW5DesrvBLJZhejkg1k6fnJhr4vrzcknzooULNWwGxi8eMgB6susaX4RiXfr7SU4tAd3yvy2rmag");
            equal(w.externalChainXPublicKey, "ypub6YeixzAJmVHnobrM7cdCZN3KcX3RsVopsJ9FgFKnte6gXY5pZHQvL72KvCjRBxdAzXsQaii7CcPTooRrKeNDMe1fVaD3Z8DGinm58vgNV2z");
            equal(w.internalChainXPrivateKey, "yprvAKfNZUdQw7jVdSM6BKgtELaDfCrhRgzHxFvnAfH26LxoE9jYYfybQGruxS2NezefRyEeH2s7oaj3LDarxRuqgQcPE5GHfZD6GgKLfWXaYvp");
            equal(w.internalChainXPublicKey, "ypub6YeixzAJmVHnqvRZHMDtbUWxDEhBq9i9KUrNy3gdegVn6x4h6DHqx5BPoisYumVWgsM5f3ByH6bRVaLvJRfFKczg2QnRYBhWDEsQS7X8N73");
            equal(w.path, "m/49'/0'/0'/0");
            equal(w.pathType, "BIP49");
            equal(w.depth, 0);

            w = new Wallet({from: "zprvAWgYBBk7JR8Gk5VL6gHZjbRaXUyHeCCt8y4jpMS6D6ZEcYiG92HnLcobZ2Risn4cxH8KBR9hssmgZeaMMCE4mSKxHvFYLMm5Upo2yQjkycx",});
            equal(w.masterXPrivateKey, "zprvAWgYBBk7JR8Gk5VL6gHZjbRaXUyHeCCt8y4jpMS6D6ZEcYiG92HnLcobZ2Risn4cxH8KBR9hssmgZeaMMCE4mSKxHvFYLMm5Upo2yQjkycx");
            equal(w.accountXPrivateKey, "zprvAdMf8RaFvFUw8khtWvUimWvGQVSkBHMgacfBvD9VmLQpGDLVtp1jv51bV3wmJLg54dqm9FDfMEHjd5TYpGFdLmVof8akvPsXM33GQ7NP2GM");
            equal(w.accountXPublicKey, "zpub6rM1Xw79kd3EMEnMcx1j8erzxXHEak5XwqanibZ7Kfwo91feSMKzTsL5LLQFCXTRs6sBpnvis1S7eii3F9y2btCPLXHQMe7h4KoMzLu33Ss");
            equal(w.externalChainXPrivateKey, "zprvAfRpmUXV8Bx8m14g129H28qNFL9DJ8GTNS2QqhqhgQ25mEo43oYKCHEn3sYFQb4mPfEU5QnwKZZui1z5fDy4h42sb3PDjYeiDfPUGDtCH8n");
            equal(w.externalChainXPublicKey, "zpub6tRBAz4NxZWRyV9973gHPGn6oMyhhazJjex1e6FKEjZ4e38CbLrZk5ZFu8sEEWShqfmkuiQ8gs2nXBTr2fEGf2iGE12oRvzbreG7kkZL6rW");
            equal(w.internalChainXPrivateKey, "zprvAfRpmUXV8Bx8osLms5d2EidSqJuhHMhcZUpao9zjrYE1aayF9BkHMX5DgnYtkHPsnoiEwVYasn1tW9xArUXkwMvB4tEx7A9Df752CLGkPPt");
            equal(w.internalChainXPublicKey, "zpub6tRBAz4NxZWS2MREy7A2braBPLkBgpRTvhkBbYQMQskzTPJPgj4XuKPhY2ytqVcWVMHj1HJQUKkD1JXiuMvPNKLyEQcRLsxbrV49Lsu2K6f");
            equal(w.path, "m/84'/0'/0'/0");
            equal(w.pathType, "BIP84");
            equal(w.depth, 0);


            w = new Wallet({from: "xprv9s21ZrQH143K3V76RxiKKREaBYgPkxDtJk2JFZeKT5oUWM5odhxf6VVKWcWYsxkn8zthgTxaxZ4ao5MDuoQ3AxxkZErhAY86wNfkCGn9MTa",
            path: "m/0'/0'"});
            equal(w.masterXPrivateKey, "xprv9s21ZrQH143K3V76RxiKKREaBYgPkxDtJk2JFZeKT5oUWM5odhxf6VVKWcWYsxkn8zthgTxaxZ4ao5MDuoQ3AxxkZErhAY86wNfkCGn9MTa");
            equal(w.chainXPrivateKey, "xprv9xQsQ3WwFzzrPLvoafdumL9AV5fF6o74fGXLi3X7ByziXa11EFrYFwjC17BcNozBYY6p6f4ue7Cq2DCDd29dpYAwBecUR3hef63Xsjcsv2t");
            equal(w.chainXPublicKey, "xpub6BQDoZ3q6NZ9bq1GghAv8U5u37VjWFpv2VSwWRvikKXhQNL9moAnok3frPogvw8GsN5T2ULjz4YoRPBVWi1EY9fGQpazwtQArRrYEHc8diy");
            equal(w.path, "m/0'/0'");
            equal(w.pathType, "custom");
            equal(w.depth, 0);

            w = new Wallet({from: "xprv9s21ZrQH143K3V76RxiKKREaBYgPkxDtJk2JFZeKT5oUWM5odhxf6VVKWcWYsxkn8zthgTxaxZ4ao5MDuoQ3AxxkZErhAY86wNfkCGn9MTa",
                path: "m/0"});
            equal(w.masterXPrivateKey, "xprv9s21ZrQH143K3V76RxiKKREaBYgPkxDtJk2JFZeKT5oUWM5odhxf6VVKWcWYsxkn8zthgTxaxZ4ao5MDuoQ3AxxkZErhAY86wNfkCGn9MTa");
            equal(w.chainXPrivateKey, "xprv9vVvYweCjEDTRTFz9GNEKjcWEEtEPXAgF7tHWLixzJtsKS3T3RoUou7CV3YNfn9BJnr2hkSqHw78pktQszEXPeLEmrxgsLC3e6HfEDpjzUy");
            equal(w.chainXPublicKey, "xpub69VGxTB6ZbmkdwLTFHuEgsZEnGiinytXcLotJj8aYeRrCENbay7jMhRgLHpCqjFa2BMRxgcoakR82JbfRAsUk16CmHE4B5NPs3YP1JeiSVj");
            equal(w.path, "m/0");
            equal(w.pathType, "custom");
            equal(w.depth, 0);

            // from non master private key
            w = new Wallet({from: "zprvAdMf8RaFvFUw8khtWvUimWvGQVSkBHMgacfBvD9VmLQpGDLVtp1jv51bV3wmJLg54dqm9FDfMEHjd5TYpGFdLmVof8akvPsXM33GQ7NP2GM"});
            equal(w.masterXPrivateKey, undefined);
            equal(w.accountXPrivateKey, "zprvAdMf8RaFvFUw8khtWvUimWvGQVSkBHMgacfBvD9VmLQpGDLVtp1jv51bV3wmJLg54dqm9FDfMEHjd5TYpGFdLmVof8akvPsXM33GQ7NP2GM");
            equal(w.accountXPublicKey, "zpub6rM1Xw79kd3EMEnMcx1j8erzxXHEak5XwqanibZ7Kfwo91feSMKzTsL5LLQFCXTRs6sBpnvis1S7eii3F9y2btCPLXHQMe7h4KoMzLu33Ss");
            equal(w.externalChainXPrivateKey, "zprvAfRpmUXV8Bx8m14g129H28qNFL9DJ8GTNS2QqhqhgQ25mEo43oYKCHEn3sYFQb4mPfEU5QnwKZZui1z5fDy4h42sb3PDjYeiDfPUGDtCH8n");
            equal(w.externalChainXPublicKey, "zpub6tRBAz4NxZWRyV9973gHPGn6oMyhhazJjex1e6FKEjZ4e38CbLrZk5ZFu8sEEWShqfmkuiQ8gs2nXBTr2fEGf2iGE12oRvzbreG7kkZL6rW");
            equal(w.internalChainXPrivateKey, "zprvAfRpmUXV8Bx8osLms5d2EidSqJuhHMhcZUpao9zjrYE1aayF9BkHMX5DgnYtkHPsnoiEwVYasn1tW9xArUXkwMvB4tEx7A9Df752CLGkPPt");
            equal(w.internalChainXPublicKey, "zpub6tRBAz4NxZWS2MREy7A2braBPLkBgpRTvhkBbYQMQskzTPJPgj4XuKPhY2ytqVcWVMHj1HJQUKkD1JXiuMvPNKLyEQcRLsxbrV49Lsu2K6f");

            equal(w.path, "m/84'/0'/0'/0");
            equal(w.pathType, "BIP84");
            equal(w.depth, 3);

        });

        it('Wallet from master xPub key', async () => {
            let w = new Wallet({from: "xpub6BxWE1dJh6Ch8UmHyCsonsNxdbYUuHMbkbAeqVXFCVsQKCPZqxyRmizTsr6d6WvfJpNSnUQy2yi9d6jZVSR5NzgaXjYqn95J93yQC5PqkZk"});
            equal(w.accountXPublicKey, "xpub6BxWE1dJh6Ch8UmHyCsonsNxdbYUuHMbkbAeqVXFCVsQKCPZqxyRmizTsr6d6WvfJpNSnUQy2yi9d6jZVSR5NzgaXjYqn95J93yQC5PqkZk");
            equal(w.externalChainXPublicKey, "xpub6ELHwMpBhJNJcumnXDHGVAVY2MQGHEVyVLbsv47J4syasqQjzAXt1vBBVN8s1jxTKniP4NypmswJBsGK1PQQ49WvvrDNUtHYN8h9SX24nuV");
            equal(w.internalChainXPrivateKey, "xpub6ELHwMpBhJNJh56BF1vEzFT8Pod6B5rAPrTKVZFPBzU58NgastaszhFXLBchcsuNwTZLrVgcAJGvrHRQBA33B3UcbRqWwYg3AVhVn7MoCzv");
            equal(w.path, "m/44'/0'/0'/0");
            equal(w.pathType, "BIP44");
            equal(w.depth, 3);

            w = new Wallet({from: "ypub6YN9t14SstSTziz45Lj5ivJB3xBKaCLhsp1Nrdagv9cPAiMvxPZTvXTG2D6jnsmGUUK13bDkDVEQu4F2DQpRcd72vHBb2neDf9TRAm9E7K6"});
            equal(w.accountXPublicKey, "ypub6YN9t14SstSTziz45Lj5ivJB3xBKaCLhsp1Nrdagv9cPAiMvxPZTvXTG2D6jnsmGUUK13bDkDVEQu4F2DQpRcd72vHBb2neDf9TRAm9E7K6");
            equal(w.externalChainXPublicKey, "ypub6YeixzAJmVHnobrM7cdCZN3KcX3RsVopsJ9FgFKnte6gXY5pZHQvL72KvCjRBxdAzXsQaii7CcPTooRrKeNDMe1fVaD3Z8DGinm58vgNV2z");
            equal(w.internalChainXPrivateKey, "ypub6YeixzAJmVHnqvRZHMDtbUWxDEhBq9i9KUrNy3gdegVn6x4h6DHqx5BPoisYumVWgsM5f3ByH6bRVaLvJRfFKczg2QnRYBhWDEsQS7X8N73");
            equal(w.path, "m/49'/0'/0'/0");
            equal(w.pathType, "BIP49");
            equal(w.depth, 3);

            w = new Wallet({from: "zpub6rM1Xw79kd3EMEnMcx1j8erzxXHEak5XwqanibZ7Kfwo91feSMKzTsL5LLQFCXTRs6sBpnvis1S7eii3F9y2btCPLXHQMe7h4KoMzLu33Ss"});
            equal(w.accountXPublicKey, "zpub6rM1Xw79kd3EMEnMcx1j8erzxXHEak5XwqanibZ7Kfwo91feSMKzTsL5LLQFCXTRs6sBpnvis1S7eii3F9y2btCPLXHQMe7h4KoMzLu33Ss");
            equal(w.externalChainXPublicKey, "zpub6tRBAz4NxZWRyV9973gHPGn6oMyhhazJjex1e6FKEjZ4e38CbLrZk5ZFu8sEEWShqfmkuiQ8gs2nXBTr2fEGf2iGE12oRvzbreG7kkZL6rW");
            equal(w.internalChainXPrivateKey, "zpub6tRBAz4NxZWS2MREy7A2braBPLkBgpRTvhkBbYQMQskzTPJPgj4XuKPhY2ytqVcWVMHj1HJQUKkD1JXiuMvPNKLyEQcRLsxbrV49Lsu2K6f");
            equal(w.path, "m/84'/0'/0'/0");
            equal(w.pathType, "BIP84");
            equal(w.depth, 3);

            w = new Wallet({from: "xpub661MyMwAqRbcFyBZXzFKgZBJjaWtAQwjfxwu3x3w1RLTP9QxBFGueHooMvsC5tyAcZKpMzxNVUHx1PpZayH74UUHfDMTK9sJ5NZMjB8fMeE",
                            path: 'm'});

            equal(w.chainXPublicKey, "xpub661MyMwAqRbcFyBZXzFKgZBJjaWtAQwjfxwu3x3w1RLTP9QxBFGueHooMvsC5tyAcZKpMzxNVUHx1PpZayH74UUHfDMTK9sJ5NZMjB8fMeE");
            equal(w.path, "m");
            equal(w.pathType, "custom");
            equal(w.depth, 0);

        });

        it('Wallet from mnemonic', async () => {
            let w = new Wallet({from:"diary fresh float ostrich clean path tooth battle rebel nerve blood shock vital travel poet profit oval super lens purse army girl protect select"})
            equal(w.masterXPrivateKey, "zprvAWgYBBk7JR8Gj6Fyh7avt7VXDTaKuFtEUVYfanib1btw1hR5DNsbmpAJQuH8wXje8oCBAh182uNsu78TSW5DEm7DHXGugYYCzX571phh8sd");
            equal(w.accountXPrivateKey, "zprvAds6aiRSB28DPqfPXm381XhejQT74yrcMYFVxKUq3RN6zdfHYhe2kdCfMVN6xizS6TjM2e9usWXBFAfzyof3jEpuw1SBbaN9ZeLTVnifWcN");
            equal(w.accountXPublicKey, "zpub6rrSzDxL1PgWcKjrdna8NfePHSHbUSaTimB6khtSbku5sRzS6ExHJRX9CnQ3YZc5mFDpq3cccw3Pt9KpoX2irELqhMEuzRpaLYqnrhqXqtR");
            equal(w.externalChainXPrivateKey, "zprvAfHTy9snayGyFCFZpHPuGDVTDhiQSAPU1yPT5Q8W6vnzAFoYP3yXDVCcGRUVw74SUXL9MBh4YEovtjyHymr2jnE9J3EFpqHjJmN9mp7cFWq");
            equal(w.externalChainXPublicKey, "zpub6tGpNfQgRLqGTgL2vJvudMSBmjYtqd7KPCK3snY7fGKy348gvbHmmHX67imLvMRewEGMVL45oJdWk47B1ykpZSPAcYCf1Yajphh23MoAoSM");
            equal(w.internalChainXPrivateKey, "zprvAfHTy9snayGyHoJXhR8ASoqSyQ2kuJx9yAPKVjdBTT6c47zKktR19sjXkzbumvB6S9Yh6PdYgXCZszypCmtrvjrBTCi7dy488mfdZFMpYQy");
            equal(w.internalChainXPublicKey, "zpub6tGpNfQgRLqGWHNzoSfAownBXRsFJmg1LPJvJ82o1ndavvKUJRjFhg41cGEYXjVDqx5MGb122nSDdSykH1GKa4Cm6ADZBg8MiwputCcQgHv");
            equal(w.mnemonic, "diary fresh float ostrich clean path tooth battle rebel nerve blood shock vital travel poet profit oval super lens purse army girl protect select");
            equal(w.path, "m/84'/0'/0'/0");
            equal(w.pathType, "BIP84");
            equal(w.depth, 0);

            w = new Wallet({from:"diary fresh float ostrich clean path tooth battle rebel nerve blood shock vital travel poet profit oval super lens purse army girl protect select",
                threshold: 2, shares:3});
            equal(combineMnemonic(w.mnemonicShares), w.mnemonic);

            w = new Wallet({from:"diary fresh float ostrich clean path tooth battle rebel nerve blood shock vital travel poet profit oval super lens purse army girl protect select",
                threshold: 2, shares:3, path:"BIP44"});
            equal(w.masterXPrivateKey, "xprv9s21ZrQH143K2Vsk2Q1gTwJWsXHS21uEeGWE1zvpFb9AuVnci4YUXgr2NVMxwiRoKWxZfjp17afn8XuL17FBeHk1Yqt4WiuET4wpEcwY7ku");
            equal(w.accountXPrivateKey, "xprv9zHPDQ6wBZ4QzGCNzsjKpEMG6PgQZ8C7esLQRLjqZj22rbeaTc1cQ39hj9oRkFT5zs2yJwdTNnnjqTqp2i1gGod4cShNEJrkFf92rtcvm1r");
            equal(w.accountXPublicKey, "xpub6DGjcudq1vciCkGr6uGLBNHzeRWtxauy26G1Dj9T84Z1jPyj19KrwqUBaS1cSJTMJwTn7pwiGae2vf5GyjXGaF2VMc1mrX6eavUARaiZoiY");
            equal(w.externalChainXPrivateKey, "xprvA1PF3AySergC7tBPGw3y6Q7b5hwBu26Av7TTmfF2xRKg283YiWuAY8a7WYmXja26cjU19nXwFCKGeqVUFnYggQ8TbJ7DSJkZLDA6mYMxH2o");
            equal(w.externalChainXPublicKey, "xpub6ENbSgWLVEEVLNFrNxayTY4KdjmgJUp2HLP4a3eeWkretvNhG4DR5vtbMq2UfT1yGDmrkfy2Df4c4tCpGCUj7dGCvAuCea3GsznkzfwVT1p");
            equal(w.internalChainXPrivateKey, "xprvA1PF3AySergC9m5gadK9JQdCHMBfpGUEsqdD2rP7vxoqDudvLPDrZsJc2ZeeLHhLQ5A94v2updumYivjRhWXxyyT4Ad8DNMDKkkvyLaDJQj");
            equal(w.internalChainXPublicKey, "xpub6ENbSgWLVEEVNFA9ger9fYZvqP2ADjC6F4YoqEnjVJLp6hy4svY77fd5sqJ573XNTQ1LTnQQiRj2MWMdoGm2CW3CANLZyquGASx2dURRKD8");
            equal(w.mnemonic, "diary fresh float ostrich clean path tooth battle rebel nerve blood shock vital travel poet profit oval super lens purse army girl protect select");
            equal(w.path, "m/44'/0'/0'/0");
            equal(w.pathType, "BIP44");
            equal(w.depth, 0);
        });

        it('Wallet getAddress method', async () => {
            let w = new Wallet({from:"diary fresh float ostrich clean path tooth battle rebel nerve blood shock vital travel poet profit oval super lens purse army girl protect select",
                threshold: 2, shares:3, path:"BIP44"});
            equal(w.getAddress(0).privateKey, 'L45mfkreqWrCfjdttVv7WU69MSmmw38FZvcSwg66thqm9J9PK9KZ');
            equal(w.getAddress(0).publicKey, '02a933ce23a6b48dfb4621e8c71cc1541993318ce667c569b8affd2278ac24aa84');
            equal(w.getAddress(0).address, '17GdQe4Cc8bA2LdNqnEs5Bg4aX1fDe2bS9');
            equal(w.getAddress(0, false).address, '1LiMan5g9YXqchuTYZ7ty1isjVH7VewkvT');
            w = new Wallet({from:"diary fresh float ostrich clean path tooth battle rebel nerve blood shock vital travel poet profit oval super lens purse army girl protect select",
                threshold: 2, shares:3, path:"BIP49"});
            equal(w.getAddress(0).address, '3EDe79YchJeaAjSkHem5NyMqTMHfm91osd');
            equal(w.getAddress(0, false).address, '36WLfXx7Jj17GVHbQcMunCVQ7dhKuKEmPb');
            w = new Wallet({from:"diary fresh float ostrich clean path tooth battle rebel nerve blood shock vital travel poet profit oval super lens purse army girl protect select",
                threshold: 2, shares:3, path:"BIP84"});
            equal(w.getAddress(0).address, 'bgl1qk2k3lgzhpu227p9fvju6tnkxjxfrqef3cg3x5a');
            equal(w.getAddress(0, false).address, 'bgl1qaksfv2t58actx25pr9mnnavsnkxp5sp5lqx8we');
            w = new Wallet({from:"diary fresh float ostrich clean path tooth battle rebel nerve blood shock vital travel poet profit oval super lens purse army girl protect select",
                threshold: 2, shares:3, path:"m/0'/0'"});
            equal(w.getAddress(0).address, '1Bwi9boQTQ57XVpa71GcX8MvjB1onTKqep');
            w = new Wallet({from:"diary fresh float ostrich clean path tooth battle rebel nerve blood shock vital travel poet profit oval super lens purse army girl protect select",
                threshold: 2, shares:3, path:"m/0'/0'", hardenedAddresses: true});
            equal(w.getAddress(0).address, '1BQHhRpCAXmAVucAmQvZpj6uPkoh2dNQjh');
        });
    });


});

