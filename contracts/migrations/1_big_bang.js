const fs = require("fs");
const path = require("path");

const Cosmos = artifacts.require("Cosmos");

const Elemento = artifacts.require("Elemento");

const Materia = artifacts.require("Materia");
const Hidrogeno = artifacts.require("Hidrogeno");
const Helio = artifacts.require("Helio");

const Fusionador = artifacts.require("Fusionador");

module.exports = async (deployer) => {
  await deployer.deploy(Cosmos);
  await deployer.deploy(Materia, Cosmos.address);

  await deployer.deploy(Hidrogeno, Materia.address);
  await deployer.deploy(Helio, Materia.address);

  let fusionador = await deployer.deploy(Fusionador, Materia.address);
  await fusionador.add(Hidrogeno.address, { gas: 2000000 });
  await fusionador.add(Helio.address, { gas: 2000000 });

  let cosmos = await Cosmos.deployed();
  await cosmos.registrarElemento(Hidrogeno.address, { gas: 2000000 });
  await cosmos.registrarMateria(Materia.address, { gas: 2000000 });
  await cosmos.registrarElementoParaRecompensas(Hidrogeno.address, { gas: 2000000 });
  await cosmos.registrarElemento(Helio.address, { gas: 2000000 });
  await cosmos.registrarFusionador(Fusionador.address, { gas: 2000000 });

  let settingsPath = path.join(__dirname, './../../app/src/abis/settings.json');
  fs.writeFileSync(settingsPath, `{"root":"${Cosmos.address}"}`);

  fs.writeFileSync(path.join(__dirname, './../../app/src/abis/cosmos.json'), JSON.stringify(Cosmos.abi));
  fs.writeFileSync(path.join(__dirname, './../../app/src/abis/elemento.json'), JSON.stringify(Elemento.abi));
  fs.writeFileSync(path.join(__dirname, './../../app/src/abis/fusionador.json'), JSON.stringify(Fusionador.abi));
};
