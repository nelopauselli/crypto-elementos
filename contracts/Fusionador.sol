// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./Elemento.sol";
import "./IFusionador.sol";

contract Fusionador is IFusionador, Ownable {
    mapping(address=>Elemento) elementos;

    constructor () {
    }

    function add(address elementoAddr) public payable onlyOwner {
        //TODO: validar quien puede agregar elementos a la lista
        Elemento elemento = Elemento(elementoAddr);
        elementos[elementoAddr] = elemento;
    }

    function fusionar(address origen, address destino, uint256 cantidad) public payable virtual {
        Elemento elementoOrigen = elementos[origen];
        Elemento elementoDestino = elementos[destino];
        
        elementoDestino.integrar(msg.sender, elementoOrigen.desintegrar(msg.sender, cantidad));
    }
}