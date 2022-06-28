// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ERC721A.sol";

interface INFT {
	function mintTile(address to, int256 x, int256 y) external;
    function buildOnLand(address to, int256 x, int256 y, uint256 buildingId) external;
    function ownerOfTile(int256 x, int256 y) external returns (address);
}

contract Buildings is Ownable {

    using Strings for uint256;

    ERC721A public apinator;
    INFT public property;

    constructor(address apinatorAddress, address apinatorPropertyAddress){
        apinator = ERC721A(apinatorAddress);
        property = INFT(apinatorPropertyAddress);
    }

    struct Well{
        uint256 creationEpoch;
        uint256 lastClaimEpoch;
        uint256 lastBoostEpoch;
        uint256 drillLvl;
        uint256 drillBoost;
    }
    struct Defense{
        uint256 creationEpoch;
        uint256 lastRepairEpoch;
        uint256 lastHitEpoch;
        uint256 level;
        uint256 hp;
    }
    mapping (int256 => mapping(int256 => Well)) public wells;
    mapping (int256 => mapping(int256 => Defense)) public defenses;
    mapping (address => bool) operators;

    uint256 rate = 1;
    uint256 timePeriod = 86400;


    function getCreationEpoch(int256 x, int256 y) external view returns(uint256) {
        return wells[x][y].creationEpoch;
    }

    function getLastClaimEpoch(int256 x, int256 y) external view returns(uint256) {
        return wells[x][y].lastClaimEpoch;
    }

    function getDrillLevel(int256 x, int256 y) external view returns(uint256) {
        return wells[x][y].drillLvl;
    }

    function getDrillBoost(int256 x, int256 y) external view returns(uint256) {
        return wells[x][y].drillBoost;
    }

    function getLastBoostEpoch(int256 x, int256 y) external view returns(uint256) {
        return wells[x][y].lastBoostEpoch;
    }

    function setLastClaimEpoch(int256 x, int256 y, uint256 epoch) external {
        require(operators[msg.sender], "Only operator.");
        wells[x][y].lastClaimEpoch = epoch;
    }

    function setDrillLevel(int256 x, int256 y, uint256 level) external {
        require(operators[msg.sender], "Only operator.");
        wells[x][y].drillLvl = level;
    }

    function setDrillBoost(int256 x, int256 y, uint256 boost) external {
        require(operators[msg.sender], "Only operator.");
        wells[x][y].drillBoost = boost;
    }

    function setLastBoostEpoch(int256 x, int256 y, uint256 epoch) external {
        require(operators[msg.sender], "Only operator.");
        wells[x][y].lastBoostEpoch = epoch;
    }

    function updateOperator(address addr, bool isOperator) public onlyOwner(){
        operators[addr] = isOperator;
    }

    function createDefense(int256 x, int256 y) public payable {
        require(operators[msg.sender], "Only operator.");
        require(defenses[x][y].creationEpoch == 0, "Already built defenses on Land.");
        defenses[x][y] = Defense(block.timestamp, 0, 0, 0, block.timestamp);
    }

    function createWell(int256 x, int256 y) public payable {
        require(operators[msg.sender], "Only operator.");
        require(wells[x][y].creationEpoch == 0, "Already built a well on Land.");
        wells[x][y] = Well(block.timestamp, block.timestamp, block.timestamp, 0, 0);
    }

    function upgradeDrill(int256 x, int256 y) public payable {
        require(operators[msg.sender], "Only operator.");
        require(wells[x][y].creationEpoch != 0, "No well on Land.");
        wells[x][y].drillLvl += 1;
    }

    function damageWell(int256 x, int256 y, uint256 damage) public {
        require(operators[msg.sender], "Only operator.");
        require(wells[x][y].drillLvl > 0, "No damage to deal.");
        wells[x][y].drillLvl -= damage;
    }

    function claimSpice(int256 x, int256 y, uint256 pricePerDrillLvl, uint256 wellPrice) public returns (uint256) {
        require(operators[msg.sender], "Only operator.");
        require(wells[x][y].creationEpoch != 0, "No well on Land.");
        uint256 amount = (wellPrice + pricePerDrillLvl*wells[x][y].drillLvl)*(100 + wells[x][y].drillBoost)/100 // investment*boost
        *(block.timestamp - wells[x][y].lastClaimEpoch)/timePeriod/100 // *nDays/100
        *rate; // *rate
        wells[x][y].drillBoost = 0;
        wells[x][y].lastBoostEpoch = block.timestamp;
        wells[x][y].lastClaimEpoch = block.timestamp;
        return amount;
    }

    function boostDrill(int256 x, int256 y) public {
        require(property.ownerOfTile(x, y) == msg.sender, "Not owner of Land.");
        require(wells[x][y].creationEpoch != 0, "No well on Land.");
        require(wells[x][y].lastBoostEpoch + timePeriod < block.timestamp, "Not ready yet.");
        require(wells[x][y].drillBoost < 100, "Already maximum boost.");
        wells[x][y].drillBoost += 1;
        wells[x][y].lastBoostEpoch = block.timestamp;
    }
}