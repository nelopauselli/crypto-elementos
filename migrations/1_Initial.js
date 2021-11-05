const fs = require("fs");
const path = require("path");

const Root = artifacts.require("Root");

const Elemento = artifacts.require("Elemento");

const Hidrogeno = artifacts.require("Hidrogeno");
const Helio = artifacts.require("Helio");
const Carbono = artifacts.require("Carbono");
const Oxigeno = artifacts.require("Oxigeno");
const Nitrogeno = artifacts.require("Nitrogeno");

const Fusionador = artifacts.require("Fusionador");

module.exports = async (deployer) => {
  await deployer.deploy(Hidrogeno);
  await deployer.deploy(Helio);
  await deployer.deploy(Carbono);
  await deployer.deploy(Oxigeno);
  await deployer.deploy(Nitrogeno);

  let deployedFusionador = await deployer.deploy(Fusionador);
  let setH = await deployedFusionador.add(Hidrogeno.address, { gas: 2000000 });
  let setHe = await deployedFusionador.add(Helio.address, { gas: 2000000 });

  let deployedRoot = await deployer.deploy(Root);
  await deployedRoot.registrarElementoClaimable(Hidrogeno.address, { gas: 2000000 });
  await deployedRoot.registrarElemento(Helio.address, { gas: 2000000 });
  await deployedRoot.registrarElemento(Carbono.address, { gas: 2000000 });
  await deployedRoot.registrarElemento(Oxigeno.address, { gas: 2000000 });
  await deployedRoot.registrarElemento(Nitrogeno.address, { gas: 2000000 });
  await deployedRoot.registrarFusionador(Fusionador.address, { gas: 2000000 });

  let settingsPath = path.join(__dirname, './../app/json/settings.json');
  fs.writeFileSync(settingsPath, `{"root":"${Root.address}", "rewards":"${Hidrogeno.address}"}`);

  fs.writeFileSync(path.join(__dirname, './../app/json/root.json'), JSON.stringify(Root.abi)); 
  fs.writeFileSync(path.join(__dirname, './../app/json/elemento.json'), JSON.stringify(Elemento.abi)); 
  fs.writeFileSync(path.join(__dirname, './../app/json/fusionador.json'), JSON.stringify(Fusionador.abi)); 
  fs.writeFileSync(path.join(__dirname, './../app/json/hidrogeno.json'), JSON.stringify(Hidrogeno.abi)); 
  
};
