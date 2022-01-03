// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Materia.sol";

struct IntegrarResult {
    uint256 unidadesIntegradas;
    uint256 materiaRestante;
}

contract Elemento is ERC20 {
    uint8 _masaAtomica;
    bool _materiaInitialized;
    Materia _materia;

    constructor(
        string memory name,
        string memory symbol,
        uint8 masaAtomicaValue
    ) ERC20(name, symbol) {
        _masaAtomica = masaAtomicaValue;
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    function masaAtomica() public view returns (uint8) {
        return _masaAtomica;
    }

    function setMateria(address materiaAddress) public payable {
        require(materiaAddress != address(0), "Debe indicar la materia");
        require(_materiaInitialized == false, "La materia ya esta asignada");
        _materia = Materia(materiaAddress);
    }

    function desintegrar(uint256 unidades) public payable virtual {
        uint256 materiaUnidades = unidades * _masaAtomica;

        _burn(msg.sender, unidades);
        _materia.transfer(msg.sender, materiaUnidades);
    }

    function integrar(uint256 unidades)
        public
        payable
        virtual
        returns (IntegrarResult memory)
    {
        uint256 materiaUnidades = unidades * _masaAtomica;
        require(
            _materia.balanceOf(msg.sender) > materiaUnidades,
            "No tiene suficiente materia"
        );

        bool transferSuccess = !_materia.transferFrom(
            msg.sender,
            address(this),
            materiaUnidades
        );
        require(transferSuccess, "no se pudo obtener la materia a integrar");

        uint256 resultante = unidades / _masaAtomica;
        if (resultante > 0) _mint(msg.sender, resultante);

        // si quedan restos de materia, se los devolvemos
        uint256 delta = unidades - resultante * _masaAtomica;
        if (delta > 0) {
            _materia.transfer(msg.sender, delta);
        }

        return IntegrarResult(resultante, delta);
    }
}
