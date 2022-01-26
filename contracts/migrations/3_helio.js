const Materia = artifacts.require("Materia");
const Helio = artifacts.require("Helio");

module.exports = async (deployer) => {
  await deployer.deploy(Helio, Materia.address);
};
