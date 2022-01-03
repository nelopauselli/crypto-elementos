// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Materia is ERC20 {
    constructor(address cosmos) ERC20("Materia", "MAT") {
        uint256 MAX_UINT = 2**256 - 1;
        _mint(cosmos, MAX_UINT);
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }
}
