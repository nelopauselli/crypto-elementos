const Cosmos = artifacts.require("Cosmos");
const Materia = artifacts.require("Materia");

const UINT_256_MAX = web3.utils.toBN('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

contract("Materia", async accounts => {
    it("La materia inicial está en el Cosmos", async () => {
        const cosmos = await Cosmos.deployed();

        const materia = await Materia.deployed();
        const balance = await materia.balanceOf.call(cosmos.address);

        expect(balance).to.eql(UINT_256_MAX, 'El balance inicial de materia no es el esperado')
    });
});