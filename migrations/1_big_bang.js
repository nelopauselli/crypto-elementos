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

  let hidrogeno = await deployer.deploy(Hidrogeno);
  hidrogeno.setMateria(Materia.address);

  let helio = await deployer.deploy(Helio);
  helio.setMateria(Materia.address);
  
  let fusionador = await deployer.deploy(Fusionador);
  await fusionador.add(Hidrogeno.address, { gas: 2000000 });
  await fusionador.add(Helio.address, { gas: 2000000 });

  let cosmosDeployed = await Cosmos.deployed();
  await cosmosDeployed.registrarElementoClaimable(Hidrogeno.address, { gas: 2000000 });
  await cosmosDeployed.registrarElemento(Helio.address, { gas: 2000000 });
  await cosmosDeployed.registrarFusionador(Fusionador.address, { gas: 2000000 });

  /*
  let settingsPath = path.join(__dirname, './../app/json/settings.json');
  fs.writeFileSync(settingsPath, `{"root":"${Cosmos.address}", "rewards":"${Hidrogeno.address}"}`);

  fs.writeFileSync(path.join(__dirname, './../app/json/root.json'), JSON.stringify(Root.abi)); 
  fs.writeFileSync(path.join(__dirname, './../app/json/elemento.json'), JSON.stringify(Elemento.abi)); 
  fs.writeFileSync(path.join(__dirname, './../app/json/fusionador.json'), JSON.stringify(Fusionador.abi)); 
  fs.writeFileSync(path.join(__dirname, './../app/json/hidrogeno.json'), JSON.stringify(Hidrogeno.abi)); 
  */

};
