const Hidrogeno = artifacts.require("Hidrogeno");
const Helio = artifacts.require("Helio");
const Fusionador = artifacts.require("Fusionador");

module.exports = async(deployer) => {
  let deployedHidrogeno = await deployer.deploy(Hidrogeno);
  let deployedHelio = await deployer.deploy(Helio);
  let deployedFusionador = await deployer.deploy(Fusionador);
  let setH = await deployedFusionador.add(Hidrogeno.address, {gas: 2000000 });
  let setHe = await deployedFusionador.add(Helio.address, {gas: 2000000 });
};
