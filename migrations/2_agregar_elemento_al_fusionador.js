const Carbono = artifacts.require("Carbono");
const Oxigeno = artifacts.require("Oxigeno");

const Fusionador = artifacts.require("Fusionador");

module.exports = async (deployer) => {
  let deployedFusionador = await Fusionador.deployed();
  await deployedFusionador.add(Carbono.address, { gas: 2000000 });
  await deployedFusionador.add(Oxigeno.address, { gas: 2000000 });
};
