// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SomeToken is ERC20, Ownable {

    uint256 public immutable INITIAL_MINT = 100_000 * 10 ** decimals();

    uint256 public immutable MAX_SUPPLY = 1_000_000 * 10 ** decimals();

    error MaxSupplyExceeded(uint256 currentSupply, uint256 maxSupply);


    constructor (address[] memory accounts) ERC20("SomeToken", "STK") Ownable(msg.sender){
        for(uint i = 0; i < accounts.length; i++){
            _mint(accounts[i], INITIAL_MINT);
        }
    }

    function mint(address account, uint256 value) public onlyOwner{
        if (totalSupply() + value > MAX_SUPPLY){
            revert MaxSupplyExceeded(totalSupply() + value, MAX_SUPPLY);
        }
        _mint(account, value);
    } 

}