// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract Relay {
    
    IERC20 private immutable dChanToken;

    constructor(IERC20 _tokenAddress) {
        dChanToken = _tokenAddress;
    }

    event Message(address from, string jsonMessage, uint balance);

    function message(string memory jsonMessage) public {
        uint balance = dChanToken.balanceOf(msg.sender);
        emit Message(msg.sender, jsonMessage, balance);
    }
}