const Nitrogeno = artifacts.require("Nitrogeno");

const Fusionador = artifacts.require("Fusionador");

module.exports = async (deployer) => {
  let deployedFusionador = await Fusionador.deployed();
  await deployedFusionador.add(Nitrogeno.address, { gas: 2000000 });
};
