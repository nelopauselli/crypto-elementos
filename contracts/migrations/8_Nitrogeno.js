const Cosmos = artifacts.require("Cosmos");
const Materia = artifacts.require("Materia");
const Fusionador = artifacts.require("Fusionador");

const Nitrogeno = artifacts.require("Nitrogeno");

module.exports = async (deployer) => {
  let materia = await Materia.deployed();

  await deployer.deploy(Nitrogeno, materia.address);

  let fusionador = await Fusionador.deployed();
  await fusionador.add(Nitrogeno.address, { gas: 2000000 });

  let cosmos = await Cosmos.deployed();
  await cosmos.registrarElemento(Nitrogeno.address, { gas: 2000000 });
};
