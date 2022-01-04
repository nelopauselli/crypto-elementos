const Cosmos = artifacts.require("Cosmos");
const Materia = artifacts.require("Materia");

const Carbono = artifacts.require("Carbono");
const Oxigeno = artifacts.require("Oxigeno");
const Nitrogeno = artifacts.require("Nitrogeno");

const Fusionador = artifacts.require("Fusionador");

module.exports = async (deployer) => {
  let materia = await Materia.deployed();

  await deployer.deploy(Carbono, materia.address);
  await deployer.deploy(Oxigeno, materia.address);
  await deployer.deploy(Nitrogeno, materia.address);

  let fusionador = await Fusionador.deployed();
  await fusionador.add(Carbono.address, { gas: 2000000 });
  await fusionador.add(Oxigeno.address, { gas: 2000000 });
  await fusionador.add(Nitrogeno.address, { gas: 2000000 });

  let cosmos = await Cosmos.deployed();
  await cosmos.registrarElemento(Carbono.address, { gas: 2000000 });
  await cosmos.registrarElemento(Oxigeno.address, { gas: 2000000 });
  await cosmos.registrarElemento(Nitrogeno.address, { gas: 2000000 });
};
