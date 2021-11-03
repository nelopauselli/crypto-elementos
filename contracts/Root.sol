// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Root is Ownable {
    address[] elementos;
    address[] fusionadores;

    function registrarElemento(address elemento) public payable onlyOwner {
        elementos.push(elemento);
    }

    function quitarElemento(uint256 index) public payable onlyOwner {
        if (index >= elementos.length) return;

        for (uint256 i = index; i < elementos.length - 1; i++) {
            elementos[i] = elementos[i + 1];
        }
        delete elementos[elementos.length - 1];
    }

    function contarElementos() public view returns (uint256) {
        return elementos.length;
    }

    function obtenerElemento(uint256 index) public view returns (address) {
        require(index < elementos.length, "Index out of range");
        return elementos[index];
    }

    function registrarFusionador(address fusionador)
        public
        payable
        onlyOwner
    {
        fusionadores.push(fusionador);
    }

    function quitarFusionador(uint256 index) public payable onlyOwner {
        if (index >= fusionadores.length) return;

        for (uint256 i = index; i < fusionadores.length - 1; i++) {
            fusionadores[i] = fusionadores[i + 1];
        }
        delete fusionadores[fusionadores.length - 1];
    }

    function contarFusionadores() public view returns (uint256) {
        return fusionadores.length;
    }

    function obtenerFusionador(uint256 index)
        public
        view
        returns (address)
    {
        require(index < fusionadores.length, "Index out of range");
        return fusionadores[index];
    }
}
