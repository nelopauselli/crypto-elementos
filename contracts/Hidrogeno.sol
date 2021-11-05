// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./Elemento.sol";

contract Hidrogeno is Elemento {
    uint256 startAt;
    uint256 initialReward;
    mapping(address => uint256) subscriptors;

    constructor() Elemento("Hidrogeno", "H", 1) {
        startAt = block.number;
        initialReward = 1000;
    }

    function subscribed() public view returns (bool) {
        return subscriptors[msg.sender] != 0;
    }

    function subscribe() public payable {
        require(
            subscriptors[msg.sender] == 0,
            "The address already is subscribed"
        );

        subscriptors[msg.sender] = block.number;

        _mint(msg.sender, initialReward);
    }

    function claim() public payable {
        require(subscriptors[msg.sender] != 0, "The address isn't subscribed");

        uint256 diff = block.number - subscriptors[msg.sender];
        uint256 reward = diff * 1000;
        _mint(msg.sender, reward);

        subscriptors[msg.sender] = block.number;
    }

    function pendingReward() public view returns (uint256) {
        require(subscriptors[msg.sender] != 0, "The address isn't subscribed");

        uint256 diff = block.number - subscriptors[msg.sender];
        uint256 reward = diff * 1000;
        return reward;
    }
}
