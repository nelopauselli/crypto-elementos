const Cosmos = artifacts.require("Cosmos");
const Materia = artifacts.require("Materia");
const Fusionador = artifacts.require("Fusionador");

const Oxigeno = artifacts.require("Oxigeno");

module.exports = async (deployer) => {
  let materia = await Materia.deployed();

  await deployer.deploy(Oxigeno, materia.address);

  let fusionador = await Fusionador.deployed();
  await fusionador.add(Oxigeno.address, { gas: 2000000 });

  let cosmos = await Cosmos.deployed();
  await cosmos.registrarElemento(Oxigeno.address, { gas: 2000000 });
};
