// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Elemento.sol";
import "./Materia.sol";

contract Cosmos is Ownable {
    address[] elementos;
    address[] fusionadores;

    address materiaAddress;
    address rewardElementAddress;

    uint256 initialReward;
    mapping(address => uint256) subscriptors;

    constructor() {
        initialReward = 1000;
    }

    function registrarElemento(address elemento) public payable onlyOwner {
        elementos.push(elemento);
    }

    function contarElementos() public view returns (uint256) {
        return elementos.length;
    }

    function obtenerElemento(uint256 index) public view returns (address) {
        require(index < elementos.length, "Index out of range");
        return elementos[index];
    }

    function registrarFusionador(address fusionador) public payable onlyOwner {
        fusionadores.push(fusionador);
    }

    function contarFusionadores() public view returns (uint256) {
        return fusionadores.length;
    }

    function obtenerFusionador(uint256 index) public view returns (address) {
        require(index < fusionadores.length, "Index out of range");
        return fusionadores[index];
    }

    function registrarMateria(address addr) public payable onlyOwner {
        require(
            materiaAddress == address(0),
            "El elemento para la recompensas ya fue establecido"
        );
        materiaAddress = addr;
    }

    function registrarElementoParaRecompensas(address elemento)
        public
        payable
        onlyOwner
    {
        require(
            rewardElementAddress == address(0),
            "El elemento para la recompensas ya fue establecido"
        );
        require(materiaAddress != address(0), "materia desconocida");

        rewardElementAddress = elemento;

        Materia materia = Materia(materiaAddress);
        materia.approve(rewardElementAddress, UINT_256_MAX);
    }

    function obtenerElementoClaimable() public view returns (address) {
        require(
            rewardElementAddress != address(0),
            "No esta configurado el elemento de las recompensas"
        );
        return rewardElementAddress;
    }

    function claim() public payable {
        uint256 reward = pendingReward();

        Elemento elementToClaim = Elemento(rewardElementAddress);
        elementToClaim.integrar(reward);

        subscriptors[msg.sender] = block.number;
    }

    function pendingReward() public view returns (uint256) {
        if (subscriptors[msg.sender] == 0) return initialReward;

        uint256 diff = block.number - subscriptors[msg.sender];
        uint256 reward = diff * 1000;
        return reward;
    }
}
