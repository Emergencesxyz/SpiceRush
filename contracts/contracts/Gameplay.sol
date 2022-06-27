// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ERC721A.sol";

interface INFT {
    function pricePerDrillLvl() external returns(uint256);
	function mintTile(address to, int256 x, int256 y) external;
    function createWell(int256 x, int256 y) external;
    function upgradeDrill(int256 x, int256 y) external;
    function ownerOfTile(int256 x, int256 y) external returns (address);
    function getDrillLevel(int256 x, int256 y) external view returns(uint256);
    function setLastClaimEpoch(int256 x, int256 y, uint256 epoch) external;
    function claimSpice(int256 x, int256 y) external returns (uint256);
}

contract Gameplay is Ownable {
    using Strings for uint256;

    event moving(uint256 _tokenId, int256 _x, int256 _y, uint16 _hp, uint16 _energy, uint256 _xp, uint256 _nextActionTime);
    event explored(uint256 _tokenId, int256 _x, int256 _y, int16 _level, uint256 _spiceAmount, uint16 _foesAmount);
    event leveledUp(uint256 _tokenId, uint16 _mining, uint16 _hpMax, uint16 _energyMax);
    event died(uint256 _tokenId, int256 _x, int256 _y, uint256 _spiceAmount);
    event mining(uint256 _tokenId, uint256 _bank, uint256 _spiceAmount, uint256 _xp, uint256 _nextActionTime);
    event resting(uint256 _tokenId, uint16 _hp, uint16 _energy, uint256 _nextActionTime);
    event spawned(uint256 _tokenId, int256 _x, int256 _y);
    event buyLand(uint256 _tokenId, int256 _x, int256 _y);
    event changedName(uint256 _tokenId, string _name);
    event hit(uint256 _tokenIdFrom, uint256 _tokenIdTo);
    event refine(uint256 _tokenId, uint256 _amount, uint256 _spiceFlow);
    event collect(uint256 _tokenId, uint256 _spiceFlow);

    ERC721A public apinator;
    INFT public property;
    INFT public buildings;
    
    IERC20 public spice;

    constructor(address apinatorAddress, address apinatorPropertyAddress, address spiceAddress, address buildingsAddress){
        map[0][0] = Tile(true, 0, 0, 0);
        apinator = ERC721A(apinatorAddress);
        property = INFT(apinatorPropertyAddress);
        buildings = INFT(buildingsAddress);
        spice = IERC20(spiceAddress);
    }
    //TODO Add : TPs name, reduce foes, build on tile protections + defs, event info a revoir, coûts en spice
    struct Tile {
        bool isExplored;
        int16 level;
        uint256 spiceAmount;
        uint16 foesAmount;
    }
    struct Stats {
        uint16 hp;
        uint16 energy;
        uint16 mining;
        uint16 hpMax;
        uint16 energyMax;
    }
    struct Chara {
        uint256 nextActionTime;
        int256 x;
        int256 y;
        Stats stats;
        uint256 xp;
        uint256 oreBalance;
        uint16 lvl;
        string name;
    }
	mapping (int256 => mapping(int256 => Tile)) public map;
    mapping (uint256 => Chara) public charas;
    uint256 public totalDeposit;
    uint256 public totalRewarded;
    uint256 public rewardBalancerNumerator = 1;
    uint256 public rewardBalancerDivisor = 1;
    uint256 public actionTime = 1;
    uint256 public spiceBlocksPerTile = 30;
    int256 public startX = 0;
    int256 public startY = 0;
    uint16 public dif = 4;
    uint8 teamNum = 3;
    bool public isPvpActive;
    uint256 public maxRefine = 1000000000000000000000; // 100 000000000000000000
    uint256 public maxCollect = 1000000000000000000000; // 100 000000000000000000
    uint256 landPrice = 50 ether;
    uint256 restActionPrice = 1000000000000000000;
    uint256 levelUpPrice = 1000000000000000000;
    uint256 setNamePrice = 100000000000000000000;
    uint256 wellPrice = 500000000000000000000;


    function setMaxRefine(uint256 _maxRefine) public onlyOwner() {
        maxRefine = _maxRefine;
    }

    function setGamePrices(uint256 _landPrice, uint256 _restActionPrice, uint256 _levelUpPrice, uint256 _setNamePrice, uint256 _wellPrice) public onlyOwner() {
        landPrice = _landPrice;
        restActionPrice = _restActionPrice;
        levelUpPrice = _levelUpPrice;
        setNamePrice = _setNamePrice;
        wellPrice = _wellPrice;
    }

    function  setPvpIsActive(bool _isActive) public onlyOwner() {
        isPvpActive = _isActive;
    }

    function  setRewardBalancer(uint256 numerator, uint256 divisor) public onlyOwner() {
        rewardBalancerNumerator = numerator;
        rewardBalancerDivisor = divisor;
    }

    function setTeamNum(uint8 _teamNum) public onlyOwner() {
        teamNum = _teamNum;
    }

    function setActionTime(uint256 _actionTime) public onlyOwner() {
        actionTime = _actionTime;
    }

    function setSpiceBlocksPerTile(uint256 _spiceBlocksPerTile) public onlyOwner() {
        spiceBlocksPerTile = _spiceBlocksPerTile;
    }

    function setSpawnTile(int256 x, int256 y, int16 level) public onlyOwner() {
        startX = x;
        startY = y;
        map[x][y] = Tile(true, level, 0, 0);
    }

    function setDifficulty(uint16 _dif) public onlyOwner() {
        dif = _dif;
    }

    function addRewards(uint256 amount) public onlyOwner(){
        require(spice.transferFrom(msg.sender, address(this), amount), "Error with token transfer.");
        totalDeposit += amount;
    }

    function spawn(uint256 tokenId) public {
        require(apinator.ownerOf(tokenId) == msg.sender, "Not owner of specified token.");
        require(charas[tokenId].stats.hp == 0, "Not dead yet.");

        charas[tokenId] = Chara(0, startX, startY, Stats(10, 10, 10, 10, 10), 0, 0, 0, tokenId.toString());
        emit spawned(tokenId, startX, startY);
    }

    function move(uint256 tokenId, int256 x, int256 y) public {
        require(apinator.ownerOf(tokenId) == msg.sender, "Not owner of specified token.");
        require(charas[tokenId].stats.energy > 0, "No more energy.");
        require(charas[tokenId].nextActionTime < block.timestamp, "Your character is still busy.");
        int256 dx = charas[tokenId].x - x;
        int256 dy = charas[tokenId].y - y;
        require(dx + dy == 1 || dx + dy == -1, "Wrong position.");
        require(charas[tokenId].stats.hp > 0, "No more hp.");

        if (!map[x][y].isExplored) {
            explore(x, y);
            charas[tokenId].xp += 5*uint256(uint16(map[x][y].level));
            emit explored(tokenId, x, y, map[x][y].level, map[x][y].spiceAmount, map[x][y].foesAmount);
        }
        charas[tokenId].xp += 20;
        charas[tokenId].stats.energy -= 1;
        charas[tokenId].x = x;
        charas[tokenId].y = y;
        if (charas[tokenId].stats.hp < map[x][y].foesAmount/dif) {
            die(tokenId);
        }
        else{
            charas[tokenId].stats.hp -= map[x][y].foesAmount/dif;
        }
        emit moving(tokenId, charas[tokenId].x, charas[tokenId].y, charas[tokenId].stats.hp, charas[tokenId].stats.energy, charas[tokenId].xp, charas[tokenId].nextActionTime);
    }

    function mine(uint256 tokenId, uint16 actionNb) public {
        require(actionNb > 0, "Need at least one action.");
        require(apinator.ownerOf(tokenId) == msg.sender, "Not owner of specified token.");
        uint256 spiceAmount = map[charas[tokenId].x][charas[tokenId].y].spiceAmount;
        require(spiceAmount > 0, "Nothing to mine.");
        require(charas[tokenId].stats.energy >= actionNb, "Not enough energy.");
        require(charas[tokenId].nextActionTime < block.timestamp, "Your character is still busy.");
        require(charas[tokenId].stats.hp > 0, "No more hp.");

        uint256 spiceMined = spiceAmount/spiceBlocksPerTile*actionNb;
        charas[tokenId].oreBalance += spiceMined + spiceMined * charas[tokenId].stats.mining / 100;
        map[charas[tokenId].x][charas[tokenId].y].spiceAmount -= spiceMined;
        charas[tokenId].stats.energy -= actionNb;
        charas[tokenId].xp += spiceMined;
        emit mining(tokenId, charas[tokenId].oreBalance, spiceMined, charas[tokenId].xp, charas[tokenId].nextActionTime);
    }

    function rest(uint256 tokenId, uint16 actionNb) public {
        require(apinator.ownerOf(tokenId) == msg.sender, "Not owner of specified token.");
        require(charas[tokenId].nextActionTime < block.timestamp, "Your character is still busy.");
        require(charas[tokenId].stats.hp > 0, "No more hp.");
        require(actionNb < 100, "Can't rest that long.");

        if (actionNb > 0) {
            uint256 spiceFlow = restActionPrice*actionNb;
            require(spice.transferFrom(msg.sender, address(this), spiceFlow), "Error with token transfer.");
            totalDeposit += spiceFlow;
        }
        charas[tokenId].stats.energy = charas[tokenId].stats.energyMax;
        charas[tokenId].stats.hp = min(charas[tokenId].stats.hp + actionNb, charas[tokenId].stats.hpMax);
        charas[tokenId].nextActionTime = block.timestamp + actionTime*(actionNb + 1);
        emit resting(tokenId, charas[tokenId].stats.hp, charas[tokenId].stats.energy, charas[tokenId].nextActionTime);
    }

    function levelUp(uint256 tokenId, uint8 statId) public {
        require(apinator.ownerOf(tokenId) == msg.sender, "Not owner of specified token.");
        require(charas[tokenId].nextActionTime < block.timestamp, "Your character is still busy.");
        require(charas[tokenId].stats.hp > 0, "No more hp.");
        require(statId < 4, "Not a stat id.");
        require(100*(uint256(charas[tokenId].lvl)**2 + uint256(charas[tokenId].lvl)) + 100 < charas[tokenId].xp, "Not enough xp.");

        uint256 spiceFlow = levelUpPrice * (charas[tokenId].lvl + 1);
        require(spice.transferFrom(msg.sender, address(this), spiceFlow), "Error with token transfer.");
        totalDeposit += spiceFlow;
        charas[tokenId].lvl += 1;
        if (statId == 1) {
            charas[tokenId].stats.hpMax += 1;
            }
        else if (statId == 2) {
            charas[tokenId].stats.energyMax += 1;
            }
        else if (statId == 3) {
            charas[tokenId].stats.mining += 2;
            }
        emit leveledUp(tokenId, charas[tokenId].stats.mining, charas[tokenId].stats.hpMax, charas[tokenId].stats.energyMax);
    }

    function terminateSelf(uint256 tokenId, bool agreement) public {
        require(apinator.ownerOf(tokenId) == msg.sender, "Not owner of specified token.");
        require(agreement, "Need owner's agreement.");
        require(charas[tokenId].stats.hp > 0, "Already no hp.");

        die(tokenId);
    }

    function hitFoe(uint256 tokenIdFrom, uint256 tokenIdTo) public {
        require(isPvpActive, "PvP not activated.");
        require(apinator.ownerOf(tokenIdFrom) == msg.sender, "Not owner of specified token.");
        require(tokenIdTo <= apinator.totalSupply(), "Non existent Foe.");
        require(charas[tokenIdTo].x == charas[tokenIdFrom].x && charas[tokenIdTo].y == charas[tokenIdFrom].y, "Not in reach.");
        require(charas[tokenIdFrom].stats.energy >= 1, "Not enough energy.");
        require(charas[tokenIdFrom].nextActionTime < block.timestamp, "Your character is still busy.");
        require(charas[tokenIdFrom].stats.hp > 0, "No more hp.");
        require(charas[tokenIdTo].stats.hp > 0, "No more hp on foe.");
        require(teamOf(tokenIdTo) != teamOf(tokenIdFrom), "Same team.");

        if (charas[tokenIdTo].stats.hp == 1) {
            die(tokenIdTo);
        }
        else {charas[tokenIdTo].stats.hp -= 1;}
        charas[tokenIdFrom].stats.energy -= 1;
        emit hit(tokenIdFrom, tokenIdTo);
    }

    function reduceFoes(uint256 tokenId) public {
        require(apinator.ownerOf(tokenId) == msg.sender, "Not owner of specified token.");
        Chara storage chara = charas[tokenId];
        require(chara.stats.energy >= 1, "Not enough energy.");
        require(chara.nextActionTime < block.timestamp, "Your character is still busy.");
        require(chara.stats.hp > 0, "No more hp.");

        chara.stats.energy -= 1;
        if (chara.stats.hp < map[chara.x][chara.y].foesAmount) {
            die(tokenId);
        }
        else{
            chara.stats.hp -= map[chara.x][chara.y].foesAmount;
        }
        map[chara.x][chara.y].foesAmount = map[chara.x][chara.y].foesAmount / 2;
        if(map[chara.x][chara.y].foesAmount < charas[tokenId].lvl){
            map[chara.x][chara.y].foesAmount = 0;
        }
    }

    function refineOre(uint256 tokenId, uint256 amount) public {
        require(apinator.ownerOf(tokenId) == msg.sender, "Not owner of specified token.");
        require(charas[tokenId].nextActionTime < block.timestamp, "Your character is still busy.");
        require(charas[tokenId].oreBalance > 0, "Nothing to refine.");
        require(charas[tokenId].stats.hp > 0, "No more hp.");
        require(charas[tokenId].oreBalance <= amount);
        require(amount < maxRefine, "Exceeds maximum refinable at once.");

        uint256 spiceFlow = amount*(1 - totalRewarded/totalDeposit)*rewardBalancerNumerator/rewardBalancerDivisor;
        require(spiceFlow < totalDeposit - totalRewarded, "Impact too high.");
        require(spice.transfer(msg.sender, spiceFlow), "Error with token transfer.");
        totalRewarded += spiceFlow;
        charas[tokenId].oreBalance -= amount;
        emit refine(tokenId, amount, spiceFlow);
    }

    function mintTile(uint256 tokenId) public payable {
        require(apinator.ownerOf(tokenId) == msg.sender, "Not owner of specified token.");
        require(charas[tokenId].nextActionTime < block.timestamp, "Your character is still busy.");
        require(charas[tokenId].stats.hp > 0, "No more hp.");
        require(charas[tokenId].stats.energy > 0, "Not enough energy.");
        require(landPrice == msg.value, "Ether value sent is not correct");

        charas[tokenId].stats.energy -= 1;
        property.mintTile(msg.sender, charas[tokenId].x, charas[tokenId].y);
        emit buyLand(tokenId, charas[tokenId].x, charas[tokenId].y);
    }

    function withdraw(address _to) public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Balance should be more then zero");
        payable(_to).transfer(balance);
    }

    function buildSpiceWell(uint256 tokenId) public {
        require(apinator.ownerOf(tokenId) == msg.sender, "Not owner of specified token.");
        require(charas[tokenId].nextActionTime < block.timestamp, "Your character is still busy.");
        require(charas[tokenId].stats.hp > 0, "No more hp.");
        require(charas[tokenId].stats.energy > 0, "Not enough energy.");
        require(map[charas[tokenId].x][charas[tokenId].y].foesAmount == 0,"Land is still dangerous.");
        require(property.ownerOfTile(charas[tokenId].x, charas[tokenId].y) == apinator.ownerOf(tokenId), "Not owner of Tile.");

        charas[tokenId].stats.energy -= 1;
        require(spice.transferFrom(msg.sender, address(this), wellPrice), "Error with token transfer.");
        totalDeposit += wellPrice;
        buildings.createWell(charas[tokenId].x, charas[tokenId].y);
    }

    function upgradeDrill(uint256 tokenId) public {
        require(apinator.ownerOf(tokenId) == msg.sender, "Not owner of specified token.");
        require(charas[tokenId].nextActionTime < block.timestamp, "Your character is still busy.");
        require(charas[tokenId].stats.hp > 0, "No more hp.");
        require(charas[tokenId].stats.energy > 0, "Not enough energy.");
        require(uint16(map[charas[tokenId].x][charas[tokenId].y].level) > buildings.getDrillLevel(charas[tokenId].x, charas[tokenId].y), "Max drill level reached on this Land.");
        require(property.ownerOfTile(charas[tokenId].x, charas[tokenId].y) == apinator.ownerOf(tokenId), "Not owner of Tile.");

        charas[tokenId].stats.energy -= 1;
        uint256 price = buildings.pricePerDrillLvl();
        require(spice.transferFrom(msg.sender, address(this), price), "Error with token transfer.");
        totalDeposit += price;
        buildings.upgradeDrill(charas[tokenId].x, charas[tokenId].y);
        //TODO emit + pay
    }

    function collectWell(uint256 tokenId) public {
        require(apinator.ownerOf(tokenId) == msg.sender, "Not owner of specified token.");
        require(charas[tokenId].nextActionTime < block.timestamp, "Your character is still busy.");
        require(charas[tokenId].stats.hp > 0, "No more hp.");
        require(charas[tokenId].stats.energy > 0, "Not enough energy.");
        require(property.ownerOfTile(charas[tokenId].x, charas[tokenId].y) == apinator.ownerOf(tokenId), "Not owner of Tile.");

        charas[tokenId].stats.energy -= 1;
        uint256 spiceFlow = buildings.claimSpice(charas[tokenId].x, charas[tokenId].y);
        if(spiceFlow > maxCollect){
            spiceFlow = maxCollect;
        }
        require(spice.transfer(msg.sender, spiceFlow), "Error with token transfer.");
        emit collect(tokenId, spiceFlow);
    }

    function setName(uint256 tokenId, string memory name) public {
        require(apinator.ownerOf(tokenId) == msg.sender, "Not owner of specified token.");
        require(charas[tokenId].nextActionTime < block.timestamp, "Your character is still busy.");
        require(charas[tokenId].stats.hp > 0, "No more hp.");
        require(bytes(name).length < 15, "Name too long.");

        require(spice.transferFrom(msg.sender, address(this), setNamePrice), "Error with token transfer.");
        totalDeposit += setNamePrice;

        charas[tokenId].name = name; 
        emit changedName(tokenId, name);
    }

    function die(uint256 tokenId) internal {
        charas[tokenId].stats.hp = 0;
        map[charas[tokenId].x][charas[tokenId].y].spiceAmount += charas[tokenId].oreBalance;
        emit died(tokenId, charas[tokenId].x, charas[tokenId].y, charas[tokenId].oreBalance);
        charas[tokenId].oreBalance = 0;
    }

    // Assembly Optimizable - randomize on unexplored ?
    function explore(int256 x, int256 y) internal {
        int256 mean;
        int256 cnt;
        if (map[x + 1][y].isExplored){
            mean += map[x + 1][y].level;
            cnt += 1;
        }
        if (map[x - 1][y].isExplored){
            mean += map[x - 1][y].level;
            cnt += 1;
        }
        if (map[x][y + 1].isExplored){
            mean += map[x][y + 1].level;
            cnt += 1;
        }
        if (map[x][y - 1].isExplored){
            mean += map[x][y - 1].level;
            cnt += 1;
        }
        mean = mean/cnt;
        int rand = getRand(block.difficulty, block.timestamp, int(mean));
        int16 level = int16(max(min(mean + (rand % 10), 100), 0));
        uint256 ore = uint256(max(min(mean + ((rand>>5) % 10), 100), 0)) * 10000000000000000;
        uint16 foes = uint16(uint256(max(min(mean + ((rand>>15) % 10), 50), 0)));
        map[x][y] = Tile(true, level, ore, foes);
    }

    function teamOf(uint256 tokenId) public view returns (uint8) {
        return uint8(tokenId % teamNum);
    }

    function getTeamsSpice() public view returns (uint256[2] memory) {
        uint256[2] memory teamsSpice;
        for (uint256 i = 0; i < teamNum; i++){
            uint256 amount = 0;
            for (uint256 j = i; j < 8000; j += 2){
                amount += charas[j].oreBalance;
            }
            teamsSpice[i] = amount;
        }
        return teamsSpice;
    }

    function isLevelUpAvailable(uint256 tokenId) public view returns (bool) {
        return 100*(uint256(charas[tokenId].lvl)**2 + uint256(charas[tokenId].lvl)) + 100 < charas[tokenId].xp;
    }

    function getRand(uint256 a, uint256 b, int from) private pure returns (int) {
        int h = int(uint(keccak256(abi.encodePacked(a, b, from))));
        return h;
    }

    function max(int256 a, int256 b) internal pure returns (int256) {
        return a >= b ? a : b;
    }

    function min(int256 a, int256 b) internal pure returns (int256) {
        return a <= b ? a : b;
    }

    function min(uint16 a, uint16 b) internal pure returns (uint16) {
        return a <= b ? a : b;
    }

    function abs(int x) private pure returns (int) {
        return x >= 0 ? x : -x;
    }
}