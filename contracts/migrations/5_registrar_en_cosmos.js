const Cosmos = artifacts.require("Cosmos");
const Materia = artifacts.require("Materia");

const Hidrogeno = artifacts.require("Hidrogeno");
const Helio = artifacts.require("Helio");

const Fusionador = artifacts.require("Fusionador");

module.exports = async (deployer) => {
  let cosmos = await Cosmos.deployed();
  await cosmos.registrarElemento(Hidrogeno.address, { gas: 2000000 });
  await cosmos.registrarMateria(Materia.address, { gas: 2000000 });
  await cosmos.registrarElementoParaRecompensas(Hidrogeno.address, { gas: 2000000 });
  await cosmos.registrarElemento(Helio.address, { gas: 2000000 });
  await cosmos.registrarFusionador(Fusionador.address, { gas: 2000000 });
};
