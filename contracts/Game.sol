pragma solidity ^0.8.0;

import "./NationNFT.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract Game {
    NationNFT nations;
    IERC20 currency;

    event Battle(uint256 attackerId, uint256 defenderId, bool success); //success is true if attacker has won

    constructor(address _collection) {
        nations = NationNFT(_collection);
    }

    function attack(uint256 _attackerId, uint256 _defenderId) public {
        (uint256 economyA, uint256 militaryA) = nations.viewAttributes(
            _attackerId
        );

        (uint256 economyD, uint256 militaryD) = nations.viewAttributes(
            _defenderId
        );

        bool outcome = militaryA > militaryD;
        emit Battle(_attackerId, _defenderId, outcome);

        console.log("outcome", outcome);
    }

    function claimReward() public {}
}
