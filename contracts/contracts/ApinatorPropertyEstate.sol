// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

// File @openzeppelin/contracts/access/Ownable.sol@v4.3.0

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ERC721A.sol";

interface INFT {
    function mintTile(address to, int256 x, int256 y) external;
}

contract ApinatorPropertyEstate is ERC721A, Ownable, INFT {
    
    using Strings for uint256;

    constructor() ERC721A("Apinator Property Estate", "APE") {}

    string private baseURI;
    string private blindURI;
    uint256 public constant BUY_LIMIT_PER_TX = 10;
    uint256 public constant MAX_NFT_PUBLIC = 400;
    uint256 private constant MAX_NFT = 10000;
    uint256 public NFTPrice = 0.002 ether;
    bool public reveal;
    bool public isActive;
    bool public isPresaleActive;
    uint256 public giveawayCount;
    struct Tile {
        int256 x;
        int256 y;
        uint256 ownerTokenId;
        string name;
        bytes3 color;
    }
    struct Coord {
        int256 x;
        int256 y;
    }
    struct mintInfo {
        uint256 timestamp;
        uint256 num;
        address addr;
    }
    mapping(uint256 => Coord) public tokenToTile;
    mapping(int256 => mapping(int256 => Tile)) public map;
    mapping(uint256 => mintInfo) public tokenToMintInfo;
    mapping(address => bool) operators;
    Coord[] public prestoredMap;
    uint256 salt;

    function setPrestoredMap(int256[] memory xs, int256[] memory ys) external onlyOwner {
        for (uint256 i; i < xs.length; i++) {
            prestoredMap.push(Coord(xs[i], ys[i]));
        }
    }

    function revealNow() external onlyOwner {
        reveal = true;
    }

    function setIsActive(bool _isActive) external onlyOwner {
        isActive = _isActive;
    }

    function setPresaleActive(bool _isActive) external onlyOwner {
        isPresaleActive = _isActive;
    }

    function setURIs(string memory _blindURI, string memory _URI)
        external
        onlyOwner
    {
        blindURI = _blindURI;
        baseURI = _URI;
    }

    function withdraw(address _to) public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Balance should be more then zero");
        payable(_to).transfer(balance);
    }

    function mintTilesBlind(uint256 _numOfTokens) public payable {
        require(isActive, "Contract is not active");
        require(!isPresaleActive, "Presale is still active");
        require(_numOfTokens <= BUY_LIMIT_PER_TX, "Cannot mint above limit");
        require(totalSupply() + _numOfTokens - giveawayCount <= MAX_NFT_PUBLIC, "Purchase would exceed max public supply of NFTs");
        require(NFTPrice * _numOfTokens == msg.value, "Ether value sent is not correct");
        for (uint256 i = totalSupply(); i < totalSupply() + _numOfTokens; i++) {
            tokenToMintInfo[i] = mintInfo(block.timestamp, i, msg.sender);
        }
        _safeMint(msg.sender, _numOfTokens);
    }

    function mintOneTile(int256 x, int256 y) public payable {
        require(isActive, "Contract is not active");
        require(!isPresaleActive, "Presale is still active");
        require(1 <= BUY_LIMIT_PER_TX, "Cannot mint above limit");
        require(totalSupply() + 1 - giveawayCount <= MAX_NFT_PUBLIC, "Purchase would exceed max public supply of NFTs");
        require(NFTPrice * 1 == msg.value, "Ether value sent is not correct");
        map[x][y] = Tile(x, y, totalSupply(), "", "");
        tokenToTile[totalSupply()] = Coord(map[x][y].x, map[x][y].y);
        _safeMint(msg.sender, 1);
    }

    function mintTile(address to, int256 x, int256 y) public override {
        require(operators[msg.sender] == true, "Only operator");
        require(map[x][y].ownerTokenId == 0, "Already owned.");
        map[x][y] = Tile(x, y, totalSupply(), "", "");
        tokenToTile[totalSupply()] = Coord(x, y);
        _safeMint(to, 1);
        //TODO emit
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        require(_exists(_tokenId), "ERC721Metadata: URI query for nonexistent token");
        if (!reveal) {
            return string(abi.encodePacked(blindURI));
        } 
        else {
            return string(abi.encodePacked(baseURI, _tokenId.toString()));
        }
    }

    function ownerOfTile(int256 x, int256 y) public view returns (address) {
        return ownerOf(map[x][y].ownerTokenId);
    }

    function getTileFromToken(uint256 tokenId) public view returns (Tile memory) {
        return map[tokenToTile[tokenId].x][tokenToTile[tokenId].y];
    }

    function revealTile(uint256 tokenId) public {
        mintInfo memory mintInf = tokenToMintInfo[tokenId];
        uint256 rand = getRand(mintInf.timestamp, mintInf.num, mintInf.addr);
        tokenToTile[tokenId] = Coord(prestoredMap[rand % prestoredMap.length].x, prestoredMap[rand % prestoredMap.length].y);
        map[tokenToTile[tokenId].x][tokenToTile[tokenId].y] = Tile(
            prestoredMap[rand % prestoredMap.length].x,
            prestoredMap[rand % prestoredMap.length].y,
            tokenId,
            "",
            ""
        );
        if (prestoredMap.length < 2) {
            removeItem(rand % prestoredMap.length);
        }
    }

    function getRand(uint256 a, uint256 b, address from) private view returns (uint256) {
        uint256 h = uint256(keccak256(abi.encodePacked(a, b, from, salt)));
        return h;
    }

    function setSalt(uint256 _salt) public onlyOwner {
        salt = _salt;
    }

    function removeItem(uint256 i) private {
        prestoredMap[i] = prestoredMap[prestoredMap.length - 1];
        prestoredMap.pop();
    }

    function setOperator(address _address, bool isOperator) public onlyOwner {
        operators[_address] = isOperator;
    }

    function setTileName(string memory name, int256 x, int256 y) public {
        require(ownerOfTile(x, y) == msg.sender, "Not owner.");
        map[x][y].name = name;
    }

    function setTileColor(bytes3 color, int256 x, int256 y) public {
        require(ownerOfTile(x, y) == msg.sender, "Not owner.");
        map[x][y].color = color;
    }
}
