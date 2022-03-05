// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IGolem is IERC20 {
	function transferFromOperator (
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

contract GolemDAO is Ownable {

    IGolem public golem;

    struct Staker {
        uint256 firstInvestEpoch;
        uint256 lastEpoch;
        uint256 balance;
        uint256 powerStaked;
    }
    uint256 significantEpoch;
    uint256 deployEpoch;

    mapping (address => Staker) public stakers;
    mapping (address => bool) public operators;


    constructor(address golemAddr) {
        golem = IGolem(golemAddr);
        deployEpoch = block.timestamp;
    }

    function stake(uint256 amount) public payable returns (bool) {
        require(msg.value == 0, "non-zero eth");
        require(amount > 0, "Cannot stake 0");
        if (stakers[msg.sender].firstInvestEpoch == 0){
            stakers[msg.sender] = Staker(block.timestamp, block.timestamp, amount, 0);
        }
        else {
            stakers[msg.sender].powerStaked += (block.timestamp - stakers[msg.sender].lastEpoch) * stakers[msg.sender].balance;
            stakers[msg.sender].lastEpoch = block.timestamp;
            stakers[msg.sender].balance += amount;
        }
        require(golem.transferFromOperator(msg.sender, address(this), amount), "Error with token transfer.");
        return true;
    }

    function withdraw(uint256 amount) public returns(bool) {
        require(amount > 0, "Cannot stake 0");
        require(amount <= stakers[msg.sender].balance, "Staked balance is lower.");
        stakers[msg.sender].powerStaked += (block.timestamp - stakers[msg.sender].lastEpoch) * stakers[msg.sender].balance;
        stakers[msg.sender].lastEpoch = block.timestamp;
        stakers[msg.sender].balance -= amount;
        require(golem.transferFromOperator(address(this), msg.sender, amount), "Error with token transfer.");
        return true;
    }

    function updateSignificantEpoch(uint256 epoch) public returns(bool) {
        require(epoch >= deployEpoch, "Incorrect epoch.");
        require(operators[msg.sender], "Only operator.");
        significantEpoch = epoch;
        return true;
    }

    function getPower(address addr) public view returns (uint256) {
        return ((block.timestamp - stakers[addr].lastEpoch) * stakers[addr].balance + stakers[addr].powerStaked);
    }

    function updateOperator(address addr, bool isOperator) public onlyOwner() returns(bool) {
        operators[addr] = isOperator;
        return true;
    }
}