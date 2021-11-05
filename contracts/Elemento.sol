// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Elemento is ERC20 {
    uint8 _masaAtomica;
    address fusionador;

    constructor(
        string memory name,
        string memory symbol,
        uint8 masaAtomica
    ) ERC20(name, symbol) {
        _masaAtomica = masaAtomica;
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    function desintegrar(address from, uint256 cantidad)
        public
        payable
        virtual
        returns (uint256)
    {
        //TODO: validar que sea el fusionador
        _burn(from, cantidad);
        return cantidad * _masaAtomica;
    }

    function integrar(address to, uint256 cantidad)
        public
        payable
        virtual
        returns (uint256)
    {
        //TODO: validar que sea el fusionador
        uint256 resultante = cantidad / _masaAtomica;
        _mint(to, resultante);
        return resultante;
    }
}