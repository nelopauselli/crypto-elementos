// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./Elemento.sol";
import "./Hidrogeno.sol";
import "./IFusionador.sol";

contract Fusionador is IFusionador, Ownable {
    mapping(address => Elemento) elementos;

    constructor() {}

    function add(address elementoAddr) public payable onlyOwner {
        //TODO: validar quien puede agregar elementos a la lista
        Elemento elemento = Elemento(elementoAddr);
        elementos[elementoAddr] = elemento;
    }

    function fusionar(
        address origen,
        address destino,
        uint256 cantidad
    ) public payable virtual {
        Elemento elementoOrigen = elementos[origen];
        Elemento elementoDestino = elementos[destino];

        uint256 materia = elementoOrigen.desintegrar(msg.sender, cantidad);
        materia = elementoDestino.integrar(msg.sender, materia);

        if (materia > 0) {
            Hidrogeno base;
            base.integrar(msg.sender, materia);
        }
    }
}
