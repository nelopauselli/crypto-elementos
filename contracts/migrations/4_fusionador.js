const Materia = artifacts.require("Materia");
const Hidrogeno = artifacts.require("Hidrogeno");
const Helio = artifacts.require("Helio");

const Fusionador = artifacts.require("Fusionador");

module.exports = async (deployer) => {
  let hidrogeno = await Hidrogeno.deployed();
  let helio = await Helio.deployed();
  let materia = await Materia.deployed();

  let fusionador = await deployer.deploy(Fusionador, materia.address);
  await fusionador.add(hidrogeno.address, { gas: 2000000 });
  await fusionador.add(helio.address, { gas: 2000000 });
};
