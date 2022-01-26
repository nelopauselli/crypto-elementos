const Cosmos = artifacts.require("Cosmos");
const Materia = artifacts.require("Materia");

module.exports = async (deployer) => {
  await deployer.deploy(Cosmos);
  await deployer.deploy(Materia, Cosmos.address);
};
