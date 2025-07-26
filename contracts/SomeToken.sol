// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SomeToken is ERC20 {

    uint256 public immutable INITIAL_MINT = 100_000 * 10 ** decimals();

    constructor (address[] memory mintAdresses) ERC20("SomeToken", "STK"){

        for(uint i = 0; i < mintAdresses.length; i++){
            _mint(mintAdresses[i], INITIAL_MINT);
        }
    }

}