// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Materia.sol";

contract Elemento is ERC20 {
    uint8 _masaAtomica;
    address _materiaAddress;

    event Desintegracion(address indexed from, address indexed to, string symbol, uint256 unidades, uint256 result);
    event Integracion(address indexed from, address indexed to, string symbol, uint256 unidades, uint256 result);

    constructor(
        string memory name,
        string memory symbol,
        uint8 masaAtomicaValue,
        address materiaAddress
    ) ERC20(name, symbol) {
        require(materiaAddress != address(0), "Debe indicar la materia");
        _materiaAddress = materiaAddress;

        _masaAtomica = masaAtomicaValue;
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    function masaAtomica() public view returns (uint8) {
        return _masaAtomica;
    }

    function desintegrar(uint256 unidades) public payable virtual {
        uint256 materiaUnidades = unidades * _masaAtomica;

        _burn(msg.sender, unidades);

        Materia materia = Materia(_materiaAddress);
        materia.transfer(msg.sender, materiaUnidades);

        emit Desintegracion(msg.sender, msg.sender, symbol(), unidades, materiaUnidades);
    }

    function integrar(uint256 unidades) public payable virtual {
        Materia materia = Materia(_materiaAddress);

        uint256 materiaUnidades = unidades * _masaAtomica;
        require(
            materia.balanceOf(msg.sender) >= materiaUnidades,
            "No tiene suficiente materia para integrar"
        );

        if (!materia.transferFrom(msg.sender, address(this), materiaUnidades))
            require(false, "no se pudo obtener la materia a integrar");

        uint256 resultante = unidades;
        if (resultante > 0) _mint(tx.origin, resultante);

        // si quedan restos de materia, se los devolvemos
        // uint256 delta = unidades - resultante * _masaAtomica;
        // if (delta > 0) {
        //     materia.transfer(msg.sender, delta);
        // }

        emit Integracion(msg.sender, tx.origin, symbol(), unidades, resultante);
    }
}
