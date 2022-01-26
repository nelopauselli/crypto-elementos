const fs = require("fs");
const path = require("path");

const Cosmos = artifacts.require("Cosmos");
const Elemento = artifacts.require("Elemento");
const Fusionador = artifacts.require("Fusionador");

module.exports = async (deployer) => {
  let cosmos = await Cosmos.deployed();

  let settingsPath = path.join(__dirname, './../../app/src/abis/settings.json');
  fs.writeFileSync(settingsPath, `{"root":"${cosmos.address}"}`);

  fs.writeFileSync(path.join(__dirname, './../../app/src/abis/cosmos.json'), JSON.stringify(Cosmos.abi));
  fs.writeFileSync(path.join(__dirname, './../../app/src/abis/elemento.json'), JSON.stringify(Elemento.abi));
  fs.writeFileSync(path.join(__dirname, './../../app/src/abis/fusionador.json'), JSON.stringify(Fusionador.abi));
};
