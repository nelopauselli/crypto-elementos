const Cosmos = artifacts.require("Cosmos");
const Materia = artifacts.require("Materia");
const Fusionador = artifacts.require("Fusionador");

const Carbono = artifacts.require("Carbono");

module.exports = async (deployer) => {
  let materia = await Materia.deployed();
  await deployer.deploy(Carbono, materia.address);

  let fusionador = await Fusionador.deployed();
  await fusionador.add(Carbono.address, { gas: 2000000 });

  let cosmos = await Cosmos.deployed();
  await cosmos.registrarElemento(Carbono.address, { gas: 2000000 });
};
