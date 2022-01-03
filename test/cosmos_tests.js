const Cosmos = artifacts.require("Cosmos");
const Materia = artifacts.require("Materia");
const Hidrogeno = artifacts.require("Hidrogeno");

const UINT_256_MAX = web3.utils.toBN('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

contract("Cosmos", async (accounts) => {
    it("La materia inicial está en el cosmos", async () => {
        const cosmos = await Cosmos.deployed();

        const materia = await Materia.deployed();
        const balance = await materia.balanceOf.call(cosmos.address);

        expect(balance).to.eql(UINT_256_MAX, 'El balance inicial de materia no es el esperado')
    });

    it("El hidrogeno puede gestinar la materia del cosmos", async () => {
        const cosmos = await Cosmos.deployed();

        const materia = await Materia.deployed();
        const hidrogeno = await Hidrogeno.deployed();

        const ammount = await materia.allowance.call(cosmos.address, hidrogeno.address);

        expect(ammount).to.eql(UINT_256_MAX, 'El monto de materia del cosmos que puede gestionar el Hidrogeno es ilimitado');
    });

    it("Se puede pedirle hidrogeno al cosmos", async () => {
        const cosmos = await Cosmos.deployed();

        const pending = await cosmos.pendingReward.call({ from: accounts[1] });

        const expected = web3.utils.toBN(1000);

        expect(pending).to.eql(expected, 'Se esperaba tener 1000 unidades de hidrogeno pendientes de reclamar');
    });

    it("Pedirle hidrogeno al cosmos", async () => {
        const cosmos = await Cosmos.deployed();
        const hidrogeno = await Hidrogeno.deployed();

        const account = accounts[1];
        await cosmos.claim({ from: account });

        const balance = await hidrogeno.balanceOf.call(account);

        const expected = web3.utils.toBN(1000);
        expect(balance).to.eql(expected, 'El balance final de hidrógeno no es el esperado');
    });
});