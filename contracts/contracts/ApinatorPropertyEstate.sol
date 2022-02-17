// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface INFT {
	function mintTile(address to, int256 x, int256 y) external;
}

contract ApinatorPropertyEstate is ERC721, Ownable, INFT {
    using Counters for Counters.Counter;
    using SafeMath for uint256;
    
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
    mapping (uint256 => Coord) public tokenToTile;
    mapping (int256 => mapping(int256 => Tile)) public map;

    string private _baseURIPrefix;
    uint256 private tokenPrice = 0.5 ether;
    mapping (address => bool) operators;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("Apinator Property Estate", "APE") {
        _tokenIdCounter.increment();
    }

    function setOperator(address _address, bool isOperator) onlyOwner() public {
        operators[_address] = isOperator;
    }

    function setBaseURI(string memory baseURIPrefix) public onlyOwner {
        _baseURIPrefix = baseURIPrefix;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseURIPrefix;
    }

    function safeMint(address to) public onlyOwner {
        _safeMint(to, _tokenIdCounter.current());
        _tokenIdCounter.increment();
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    override
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721)
    returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function withdraw() public onlyOwner {
        uint balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    function directMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }

    function mintTile(address to, int256 x, int256 y) public override {
        require(operators[msg.sender] == true, "Only operator");
        require(map[x][y].ownerTokenId == 0, "Already owned.");
        map[x][y] = Tile(x, y, _tokenIdCounter.current(), "", "");
        tokenToTile[_tokenIdCounter.current()] = Coord(map[x][y].x, map[x][y].y);
        _safeMint(to, _tokenIdCounter.current());
        _tokenIdCounter.increment();
    }

    function setTileName(string memory name, int256 x, int256 y) public {
        require(ownerOfTile(x, y) == msg.sender, "Not owner.");
        map[x][y].name = name;
    }

    function setTileColor(bytes3 color, int256 x, int256 y) public {
        require(ownerOfTile(x, y) == msg.sender, "Not owner.");
        map[x][y].color = color;
    }

    function ownerOfTile(int256 x, int256 y) public view returns (address) {
        return ownerOf(map[x][y].ownerTokenId);
    }

    function getTileFromToken(uint256 tokenId) public view returns (Tile memory) {
        return map[tokenToTile[tokenId].x][tokenToTile[tokenId].y];
    }
}