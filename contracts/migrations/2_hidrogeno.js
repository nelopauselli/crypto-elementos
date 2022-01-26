const Materia = artifacts.require("Materia");
const Hidrogeno = artifacts.require("Hidrogeno");

module.exports = async (deployer) => {
  let materia = await Materia.deployed();
  await deployer.deploy(Hidrogeno, materia.address);
};
