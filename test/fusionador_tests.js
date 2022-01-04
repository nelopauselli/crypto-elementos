const Cosmos = artifacts.require("Cosmos");
const Fusionador = artifacts.require("Fusionador");
const Materia = artifacts.require("Materia");
const Hidrogeno = artifacts.require("Hidrogeno");
const Helio = artifacts.require("Helio");

const UINT_256_MAX = web3.utils.toBN('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

contract("Fusionador", async (accounts) => {
    const account = accounts[1];
    const garbage = accounts[2];

    beforeEach(async () => {
        const hidrogeno = await Hidrogeno.deployed();
        const helio = await Helio.deployed();

        const balanceHidrogeno = await hidrogeno.balanceOf.call(account);
        await hidrogeno.transfer(garbage, balanceHidrogeno, {from: account});

        const balanceHelio = await helio.balanceOf.call(account);
        await helio.transfer(garbage, balanceHelio, {from: account});

        const cosmos = await Cosmos.deployed();
        await cosmos.claim({ from: account });
    });

    it("Permitir al fusionador gestionar mis Hidrogeno", async () => {
        const hidrogeno = await Hidrogeno.deployed();
        const fusionador = await Fusionador.deployed();

        await hidrogeno.approve(fusionador.address, 1000, { from: account });

        const allowed = await hidrogeno.allowance.call(account, fusionador.address);
        const expected = web3.utils.toBN(1000);
        expect(allowed).to.eql(expected, `La cantidad autorizada a gestionarno es la esperada`);
    });

    it("Desintegrar manual", async () => {
        const hidrogeno = await Hidrogeno.deployed();
        const materia = await Materia.deployed();

        const balanceAnterior = await materia.balanceOf.call(account);
        const expectedAnterior = web3.utils.toBN(0);
        expect(balanceAnterior).to.eql(expectedAnterior, `El balance de materia ${balanceAnterior.toString()} no es el esperado ${expectedAnterior.toString()}`);

        await hidrogeno.desintegrar(500, { from: account });

        const balance = await materia.balanceOf.call(account);
        const expected = web3.utils.toBN(500);
        expect(balance).to.eql(expected, `El balance de materia ${balance.toString()} no es el esperado ${expected.toString()}`);
    });

    it("Integrar manual", async () => {
        const hidrogeno = await Hidrogeno.deployed();
        const helio = await Helio.deployed();
        const materia = await Materia.deployed();

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

        await hidrogeno.approve(fusionador.address, 500, { from: account });
        await fusionador.fusionar(hidrogeno.address, helio.address, 500, { from: account });

        const balanceHelio = await helio.balanceOf.call(account);
        const expectedHelio = web3.utils.toBN(125);
        expect(balanceHelio).to.eql(expectedHelio, `El balance de helio ${balanceHelio.toString()} no es el esperado ${expectedHelio.toString()}`);

        const balanceHidrogeno = await hidrogeno.balanceOf.call(account);
        const expectedHidrogeno = web3.utils.toBN(500);
        expect(balanceHidrogeno).to.eql(expectedHidrogeno, `El balance de hidrogeno ${balanceHidrogeno.toString()} no es el esperado ${expectedHidrogeno.toString()}`);
    });
});