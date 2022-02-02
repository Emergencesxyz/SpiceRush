pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Game {
    IERC721 nations;

    constructor(address _collection) {
        nations = IERC721(_collection);
    }

    function attack(uint256 _nationId) public {}

    function claimReward() public {}
}
