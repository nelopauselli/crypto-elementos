const Cosmos = artifacts.require("Cosmos");
const Fusionador = artifacts.require("Fusionador");
const Materia = artifacts.require("Materia");
const Hidrogeno = artifacts.require("Hidrogeno");
const Helio = artifacts.require("Helio");
const Carbono = artifacts.require("Carbono");

const UINT_256_MAX = web3.utils.toBN('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

contract("Fusionador", async (accounts) => {

    it("Permitir al fusionador gestionar mis Hidrogeno", async () => {
        const cosmos = await Cosmos.deployed();
        const hidrogeno = await Hidrogeno.deployed();
        const fusionador = await Fusionador.deployed();

        const account = accounts[0];
        await cosmos.claim({ from: account });

        await hidrogeno.approve(fusionador.address, 1000, { from: account });

        const allowed = await hidrogeno.allowance.call(account, fusionador.address);
        const expected = web3.utils.toBN(1000);
        expect(allowed).to.eql(expected, `La cantidad autorizada a gestionarno es la esperada`);
    });

    it("Desintegrar manual", async () => {
        const hidrogeno = await Hidrogeno.deployed();
        const materia = await Materia.deployed();
        const cosmos = await Cosmos.deployed();

        const account = accounts[1];
        await cosmos.claim({ from: account });

        await hidrogeno.desintegrar(500, { from: account });

        const balance = await materia.balanceOf.call(account);
        const expected = web3.utils.toBN(500);
        expect(balance).to.eql(expected, `El balance de materia ${balance.toString()} no es el esperado ${expected.toString()}`);
    });

    it("Integrar manual", async () => {
        const hidrogeno = await Hidrogeno.deployed();
        const helio = await Helio.deployed();
        const materia = await Materia.deployed();
        const cosmos = await Cosmos.deployed();

        const account = accounts[2];
        await cosmos.claim({ from: account });

        await hidrogeno.desintegrar(500, { from: account });

        await materia.approve(helio.address, 500, { from: account });
        await helio.integrar(125, { from: account, gas: 5000000 });

        const balanceHelio = await helio.balanceOf.call(account);
        const exceptedHelio = web3.utils.toBN(125);
        expect(balanceHelio).to.eql(exceptedHelio, `El balance de Helio ${balanceHelio.toString()} no es el esperado ${exceptedHelio.toString()}`);
    });

    it("Fusionar Hidrogeno en Helio", async () => {
        const hidrogeno = await Hidrogeno.deployed();
        const helio = await Helio.deployed();
        const fusionador = await Fusionador.deployed();
        const cosmos = await Cosmos.deployed();

        const account = accounts[3];
        await cosmos.claim({ from: account });

        await hidrogeno.approve(fusionador.address, 500, { from: account });
        await fusionador.fusionar(hidrogeno.address, helio.address, 500, { from: account });

        const balanceHelio = await helio.balanceOf.call(account);
        const expectedHelio = web3.utils.toBN(125);
        expect(balanceHelio).to.eql(expectedHelio, `El balance de helio ${balanceHelio.toString()} no es el esperado ${expectedHelio.toString()}`);

        const balanceHidrogeno = await hidrogeno.balanceOf.call(account);
        const expectedHidrogeno = web3.utils.toBN(500);
        expect(balanceHidrogeno).to.eql(expectedHidrogeno, `El balance de hidrogeno ${balanceHidrogeno.toString()} no es el esperado ${expectedHidrogeno.toString()}`);
    });

    it("Fusionar Hidrogeno en Helio en Carbono", async () => {
        const hidrogeno = await Hidrogeno.deployed();
        const helio = await Helio.deployed();
        const carbono = await Carbono.deployed();
        const fusionador = await Fusionador.deployed();
        const cosmos = await Cosmos.deployed();

        const account = accounts[4];
        await cosmos.claim({ from: account });

        await hidrogeno.approve(fusionador.address, 1000, { from: account });
        await fusionador.fusionar(hidrogeno.address, helio.address, 1000, { from: account });

        await helio.approve(fusionador.address, 249, { from: account });
        await fusionador.fusionar(helio.address, carbono.address, 249, { from: account });

        const balanceCarbono = await carbono.balanceOf.call(account);
        const expectedCarbono = web3.utils.toBN(83);
        expect(balanceCarbono).to.eql(expectedCarbono, `El balance de carbono ${balanceCarbono.toString()} no es el esperado ${expectedCarbono.toString()}`);

        const balanceHelio = await helio.balanceOf.call(account);
        const expectedHelio = web3.utils.toBN(1);
        expect(balanceHelio).to.eql(expectedHelio, `El balance de helio ${balanceHelio.toString()} no es el esperado ${expectedHelio.toString()}`);

        const balanceHidrogeno = await hidrogeno.balanceOf.call(account);
        const expectedHidrogeno = web3.utils.toBN(0);
        expect(balanceHidrogeno).to.eql(expectedHidrogeno, `El balance de hidrogeno ${balanceHidrogeno.toString()} no es el esperado ${expectedHidrogeno.toString()}`);
    });
});