// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/*
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor () {
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

interface INFT {
	function mintTile(address to, int256 x, int256 y) external;
}

contract Gameplay is Ownable {
    using SafeMath for uint256;
    using Strings for uint256;

    event moving(uint256 _tokenId, int256 _x, int256 _y, uint16 _hp, uint16 _energy, uint16 _xp, uint256 _nextActionTime);
    event explored(uint256 _tokenId, int256 _x, int256 _y, int16 _level, uint256 _spiceAmount, uint16 _foesAmount);
    event leveledUp(uint256 _tokenId, uint16 _mining, uint16 _hpMax, uint16 _energyMax);
    event died(uint256 _tokenId, int256 _x, int256 _y);
    event mining(uint256 _tokenId, uint256 _bank, uint256 _spiceAmount, uint16 _xp, uint256 _nextActionTime);
    event resting(uint256 _tokenId, uint16 _hp, uint16 _energy, uint256 _nextActionTime);
    event spawned(uint256 _tokenId, int256 _x, int256 _y);
    event buyLand(uint256 _tokenId, int256 _x, int256 _y);
    event changedName(uint256 _tokenId, string _name);

    IERC721 public apinator;
    INFT public property;

    constructor(address apinatorAddress, address apinatorPropertyAddress){
        uint256[] memory emptyIds;
        map[0][0] = Tile(true, 0, 0, 0, emptyIds, emptyIds);
        apinator = IERC721(apinatorAddress);
        property = INFT(apinatorPropertyAddress);
    }
    //TODO Add : ERC20, TPs name, attack enemies on tile, reduce foes, build on tile protections + defs
    struct Tile {
        bool isExplored;
        int16 level;
        uint256 spiceAmount;
        uint16 foesAmount;
        uint256[] team1Ids;
        uint256[] team2Ids;
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
        uint16 xp;
        uint16 lvl;
        string name;
    }
    mapping (uint256 => uint256) public bank;
	mapping (int256 => mapping(int256 => Tile)) public map;
    mapping (uint256 => Chara) public charas;
    uint256 actionTime = 1;
    uint256 spiceBlocksPerTile = 30;
    int256 startX = 0;
    int256 startY = 0;
    uint16 dif = 4;
    uint8 teamNum = 2;

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
        map[x][y] = Tile(true, level, 0, 0, map[x][y].team1Ids, map[x][y].team2Ids);
    }

    function setDifficulty(uint16 _dif) public onlyOwner() {
        dif = _dif;
    }

    function spawn(uint256 tokenId) public {
        require(apinator.ownerOf(tokenId) == msg.sender, "Not owner of specified token.");
        require(charas[tokenId].stats.hp == 0, "Not dead yet.");

        charas[tokenId] = Chara(0, startX, startY, Stats(10, 10, 10, 10, 10), 0, 0, tokenId.toString());
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
            charas[tokenId].xp += 5*uint16(map[x][y].level);
            emit explored(tokenId, x, y, map[x][y].level, map[x][y].spiceAmount, map[x][y].foesAmount);
        }
        if (charas[tokenId].stats.hp < map[x][y].foesAmount/dif) {
            die(tokenId);
        }
        else{
            charas[tokenId].stats.hp -= map[x][y].foesAmount/dif;
        }
        charas[tokenId].xp += 20;
        charas[tokenId].stats.energy -= 1;
        charas[tokenId].x = x;
        charas[tokenId].y = y;
        charas[tokenId].nextActionTime = block.timestamp + actionTime;
        emit moving(tokenId, charas[tokenId].x, charas[tokenId].y, charas[tokenId].stats.hp, charas[tokenId].stats.energy, charas[tokenId].xp, charas[tokenId].nextActionTime);
    }

    function mine(uint256 tokenId, uint16 actionNb) public {
        require(actionNb > 0, "Need at least one action.");
        require(apinator.ownerOf(tokenId) == msg.sender, "Not owner of specified token.");
        uint16 spiceAmount = uint16(map[charas[tokenId].x][charas[tokenId].y].spiceAmount);
        require(spiceAmount > 0, "Nothing to mine.");
        require(charas[tokenId].stats.energy >= actionNb, "Not enough energy.");
        require(charas[tokenId].nextActionTime < block.timestamp, "Your character is still busy.");
        require(charas[tokenId].stats.hp > 0, "No more hp.");

        uint256 spiceMined = spiceAmount/spiceBlocksPerTile*actionNb;
        bank[tokenId] += uint16(spiceMined + spiceMined * charas[tokenId].stats.mining / 100);
        map[charas[tokenId].x][charas[tokenId].y].spiceAmount -= spiceMined;
        charas[tokenId].stats.energy -= actionNb;
        charas[tokenId].nextActionTime = block.timestamp + actionNb*actionTime;
        charas[tokenId].xp += uint16(spiceMined);
        emit mining(tokenId, bank[tokenId], spiceAmount, charas[tokenId].xp, charas[tokenId].nextActionTime);
    }

    function rest(uint256 tokenId, uint16 actionNb) public {
        require(apinator.ownerOf(tokenId) == msg.sender, "Not owner of specified token.");
        require(charas[tokenId].nextActionTime < block.timestamp, "Your character is still busy.");
        require(charas[tokenId].stats.hp > 0, "No more hp.");
        require(actionNb < 100, "Can't rest that long.");

        //TODO ERC20

        charas[tokenId].stats.energy = charas[tokenId].stats.energyMax;
        charas[tokenId].stats.hp = min(charas[tokenId].stats.hp + actionNb, charas[tokenId].stats.hpMax);
        charas[tokenId].nextActionTime = block.timestamp + actionTime*actionNb;
        emit resting(tokenId, charas[tokenId].stats.hp, charas[tokenId].stats.energy, charas[tokenId].nextActionTime);
    }

    function levelUp(uint256 tokenId, uint8 statId) public {
        require(apinator.ownerOf(tokenId) == msg.sender, "Not owner of specified token.");
        require(charas[tokenId].nextActionTime < block.timestamp, "Your character is still busy.");
        require(charas[tokenId].stats.hp > 0, "No more hp.");
        require(statId < 4, "Not a stat id.");
        require(100*(charas[tokenId].lvl**2 + charas[tokenId].lvl) + 100 < charas[tokenId].xp, "Not enough xp.");

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

    function selfTerminate(uint256 tokenId, bool agreement) public {
        require(apinator.ownerOf(tokenId) == msg.sender, "Not owner of specified token.");
        require(agreement, "Need owner's agreement.");
        require(charas[tokenId].stats.hp > 0, "Already no hp.");

        die(tokenId);
    }

    function claimSpice(uint256 tokenId) public {
        require(apinator.ownerOf(tokenId) == msg.sender, "Not owner of specified token.");
        require(charas[tokenId].nextActionTime < block.timestamp, "Your character is still busy.");
        require(bank[tokenId] > 0, "Nothing to claim.");
        require(charas[tokenId].stats.hp > 0, "No more hp.");

        bank[tokenId] = 0;
        charas[tokenId].nextActionTime = block.timestamp + actionTime;

        // TODO ERC20
    }

    function addSpice(uint256 tokenId) public {
        require(apinator.ownerOf(tokenId) == msg.sender, "Not owner of specified token.");
        require(charas[tokenId].nextActionTime < block.timestamp, "Your character is still busy.");
        require(charas[tokenId].stats.hp > 0, "No more hp.");

        // TODO ERC20

        bank[tokenId] += 0;
        charas[tokenId].nextActionTime = block.timestamp + actionTime;
    }

    function mintTile(uint256 tokenId, int256 x, int256 y) public payable {
        require(apinator.ownerOf(tokenId) == msg.sender, "Not owner of specified token.");
        require(charas[tokenId].nextActionTime < block.timestamp, "Your character is still busy.");
        require(charas[tokenId].stats.hp > 0, "No more hp.");
        require(charas[tokenId].stats.energy > 0, "Not enough energy.");
        
        charas[tokenId].stats.energy -= 1;
        property.mintTile(msg.sender, x, y);
        emit buyLand(tokenId, x, y);
    }

    function setName(uint256 tokenId, string memory name) public {
        require(apinator.ownerOf(tokenId) == msg.sender, "Not owner of specified token.");
        require(charas[tokenId].nextActionTime < block.timestamp, "Your character is still busy.");
        require(charas[tokenId].stats.hp > 0, "No more hp.");
        require(bytes(name).length < 15, "Name too long.");

        charas[tokenId].name = name; 
        emit changedName(tokenId, name);
    }

    function die(uint256 tokenId) internal {
        charas[tokenId].stats.hp = 0;
        map[charas[tokenId].x][charas[tokenId].y].spiceAmount += bank[tokenId];
        bank[tokenId] = 0;
        emit died(tokenId, charas[tokenId].x, charas[tokenId].y);
    }

    // Assembly Optimizable
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
        uint256 spice = uint256(max(min(mean + ((rand>>5) % 10), 100), 0)) * 100;
        uint16 foes = uint16(uint256(max(min(mean + ((rand>>10) % 10), 100), 0)));
        uint256[] memory emptyIds;
        map[x][y] = Tile(true, level, spice, foes, emptyIds, emptyIds);
    }

    function teamOf(uint256 tokenId) public view returns (uint8) {
        return uint8(tokenId % teamNum);
    }

    function getTeamsSpice() public view returns (uint256[2] memory) {
        uint256[2] memory teamsSpice;
        for (uint256 i = 0; i < teamNum; i++){
            uint256 amount = 0;
            for (uint256 j = i; j < 8000; j += 2){
                amount += bank[j];
            }
            teamsSpice[i] = amount;
        }
        return teamsSpice;
    }

    function isLevelUpAvailable(uint256 tokenId) public view returns (bool) {
        return 100*(charas[tokenId].lvl**2 + charas[tokenId].lvl) + 100 < charas[tokenId].xp;
    }

    function getRand(uint256 a, uint256 b, int from) private pure returns (int) {
        int h = int(uint(keccak256(abi.encodePacked(a, b, from))));
        return h;
    }

    /// @notice Returns the greater of two numbers.
    function max(int256 a, int256 b) internal pure returns (int256) {
        return a >= b ? a : b;
    }

    /// @notice Returns the lower of two numbers.
    function min(int256 a, int256 b) internal pure returns (int256) {
        return a <= b ? a : b;
    }

    /// @notice Returns the lower of two numbers.
    function min(uint16 a, uint16 b) internal pure returns (uint16) {
        return a <= b ? a : b;
    }

    function abs(int x) private pure returns (int) {
        return x >= 0 ? x : -x;
    }
}