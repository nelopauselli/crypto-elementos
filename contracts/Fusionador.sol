// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./Elemento.sol";
import "./Materia.sol";
import "./Hidrogeno.sol";
import "./IFusionador.sol";

contract Fusionador is IFusionador, Ownable {
    Materia _materia;

    mapping(address => Elemento) elementos;

    event Fusion(
        address indexed from,
        address indexed to,
        string symbolFrom,
        string symbolTo,
        uint256 unidadesFrom,
        uint256 unidadesTo
    );

    constructor(address materiaAddress) {
        require(
            materiaAddress != address(0),
            "Falta indicar la materia"
        );
        _materia = Materia(materiaAddress);
    }

    function add(address elementoAddr) public payable onlyOwner {
        //TODO: validar quien puede agregar elementos a la lista
        Elemento elemento = Elemento(elementoAddr);
        
        _materia.approve(elementoAddr, UINT_256_MAX);
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

        // if (cantidadDestino < balanceOfDestino) {
        //     //Si no tenemos suficiente materia destino, calculamos la cantidad posible de origen
        //     cantidadDestino = balanceOfDestino;
        //     materia = balanceOfDestino * elementoDestino.masaAtomica();
        //     cantidad = materia / elementoOrigen.masaAtomica();

        //     // y volvemos a calcular la materia destino
        //     materia = cantidad * elementoOrigen.masaAtomica();
        //     cantidadDestino = materia / elementoDestino.masaAtomica();
        // }

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
        elementoDestino.integrar(cantidadDestino);

        // if (result.materiaRestante > 0) {
        //     Hidrogeno base;
        //     base.integrar(result.materiaRestante);
        // }

        emit Fusion(
            msg.sender,
            msg.sender,
            elementoOrigen.symbol(),
            elementoDestino.symbol(),
            cantidad,
            cantidadDestino
        );
    }
}
