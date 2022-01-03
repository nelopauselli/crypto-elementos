// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./Elemento.sol";
import "./Hidrogeno.sol";
import "./IFusionador.sol";

contract Fusionador is IFusionador, Ownable {
    mapping(address => Elemento) elementos;

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
        //TODO: validar que el elemento de origen estaba en la lista
        Elemento elementoDestino = elementos[destino];
        //TODO: validar que el elemento de destino estaba en la lista

        require(
            elementoOrigen.balanceOf(msg.sender) >= cantidad,
            "Insuficiente cantidad del elemento"
        );

        uint256 materia = cantidad * elementoOrigen.masaAtomica();
        uint256 cantidadDestino = materia / elementoDestino.masaAtomica();
        uint256 balanceOfDestino = elementoDestino.balanceOf(address(this));

        if (cantidadDestino < balanceOfDestino) {
            //Si no tenemos suficiente materia destino, calculamos la cantidad posible de origen
            cantidadDestino = balanceOfDestino;
            materia = balanceOfDestino * elementoDestino.masaAtomica();
            cantidad = materia / elementoOrigen.masaAtomica();

            // y volvemos a calcular la materia destino
            materia = cantidad * elementoOrigen.masaAtomica();
            cantidadDestino = materia / elementoDestino.masaAtomica();
        }

        bool transferSuccess = elementoOrigen.transferFrom(
            msg.sender,
            address(this),
            cantidad
        );
        require(
            transferSuccess,
            "no se pudo obtener el elemento a desintegrar"
        );

        elementoOrigen.desintegrar(cantidad);
        IntegrarResult memory result = elementoDestino.integrar(cantidadDestino);
        
        if (result.materiaRestante > 0) {
            Hidrogeno base;
            base.integrar(result.materiaRestante);
        }
    }
}
