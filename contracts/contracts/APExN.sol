// SPDX-License-Identifier: MIT

/*
   _____       _           ____             __  
  / ___/____  (_)_______  / __ \__  _______/ /_ 
  \__ \/ __ \/ / ___/ _ \/ /_/ / / / / ___/ __ \
 ___/ / /_/ / / /__/  __/ _, _/ /_/ (__  ) / / /
/____/ .___/_/\___/\___/_/ |_|\__,_/____/_/ /_/ 
    /_/                                         
*/

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ERC721A.sol";

contract APExN is ERC721A, Ownable {

    using Strings for uint256;

    constructor() ERC721A("APExN", "APExN") {}

    string private baseURI;
    string private blindURI;
    uint256 public maxSupplyPublic = 100;
    uint256 private maxSupply = 100;
    uint256 public NFTPrice = 0.25 ether;
    uint256 public referralShare = 0.05 ether;
    uint256 public referredShare = 0.05 ether;
    uint256 public teamShare = 0.15 ether;
    bool public reveal;
    bool public isActive;
    bool public isPresaleActive;
    bool private freeMintActive;
    bytes32 public root;
    uint256 public maxMint = 1;
    uint256 public giveawayCount;
    mapping(address => uint256) public mintedAmount;
    mapping(address => bool) private giveawayMintClaimed;
    mapping(address => uint256) public totalReferred;
    mapping(address => uint256) public bank;
    mapping(uint256 => address) public codeToReferral;
    mapping(address => uint256) public ReferralToCode;
    mapping(bytes32 => uint256) public secretToMaxAmountFreeMint;
    mapping(bytes32 => uint256) public secretToAmountFreeMint;

    function setFreeMintCampaign(
        uint256 maxAmount,
        bytes32 secret
    ) 
        external 
        onlyOwner 
    {
        secretToMaxAmountFreeMint[secret] = maxAmount;
    }

    function setMaxMint(
        uint256 _maxMint
    ) 
        external 
        onlyOwner 
    {
        maxMint = _maxMint;
    }

    function setPriceShare(
        uint256 _NFTPrice,
        uint256 _referralShare,
        uint256 _referredShare,
        uint256 _teamShare
    ) 
        external 
        onlyOwner 
    {
        require(_NFTPrice == _referralShare + _referredShare + _teamShare, "Invalid price");
        NFTPrice = _NFTPrice;
        referralShare = _referralShare;
        referredShare = _referredShare;
        teamShare = _teamShare;
    }

    function setMaxSupply(
        uint256 _maxSupplyPublic,
        uint256 _maxSupply
    ) 
        external 
        onlyOwner 
    {
        maxSupplyPublic = _maxSupplyPublic;
        maxSupply = _maxSupply;
    }

    /*
     * Function to reveal
    */
    function revealNow() 
        external 
        onlyOwner 
    {
        reveal = true;
    }
    
    
    /*
     * Function setIsActive to activate/desactivate the smart contract
    */
    function setIsActive(
        bool _isActive
    ) 
        external 
        onlyOwner 
    {
        isActive = _isActive;
    }
    
    /*
     * Function setPresaleActive to activate/desactivate the whitelist/raffle presale  
    */
    function setPresaleActive(
        bool _isActive
    ) 
        external 
        onlyOwner 
    {
        isPresaleActive = _isActive;
    }

    /*
     * Function setFreeMintActive to activate/desactivate the free mint capability  
    */
    function setFreeMintActive(
        bool _isActive
    ) 
        external 
        onlyOwner 
    {
        freeMintActive = _isActive;
    }
    
    /*
     * Function to set Base and Blind URI 
    */
    function setURIs(
        string memory _blindURI, 
        string memory _URI
    ) 
        external 
        onlyOwner 
    {
        blindURI = _blindURI;
        baseURI = _URI;
    }

    /*
     * Function to withdraw collected amount during minting by the owner
    */
    function withdraw(
        address _to
    )
        public
        onlyOwner
    {
        uint balance = bank[address(this)];
        require(balance > 0, "Balance should be more then zero");
        payable(_to).transfer(balance);
        bank[address(this)] = 0;
    }

    /*
     * Function to mint new NFTs during the public sale for free
     * It is payable. Amount is calculated as per (NFTPrice.mul(_numOfTokens))
    */
    function mintNFTFree(
        uint256 secret,
        uint256 _numOfTokens
    )
        public
    {
        require(secretToAmountFreeMint[keccak256(abi.encodePacked(secret))] + _numOfTokens <= secretToMaxAmountFreeMint[keccak256(abi.encodePacked(secret))], "Wrong secret or not enough left to mint");
        require(isActive, 'Contract is not active');
        require(!isPresaleActive, 'Presale is still active');
        require(totalSupply() + _numOfTokens - giveawayCount <= maxSupplyPublic, "Purchase would exceed max public supply of NFTs");
        require(mintedAmount[msg.sender] + _numOfTokens <= maxMint, 'Purchase exceeds maximum mintable');
        if (ReferralToCode[msg.sender] == 0){
            codeToReferral[totalSupply()] = msg.sender;
            ReferralToCode[msg.sender] = totalSupply();
        }
        bank[address(this)] += _numOfTokens * NFTPrice;
        _safeMint(msg.sender, _numOfTokens);
        secretToAmountFreeMint[keccak256(abi.encodePacked(secret))] += _numOfTokens;
        mintedAmount[msg.sender] += _numOfTokens;
    }

    /*
     * Function to mint new NFTs during the public sale
     * It is payable. Amount is calculated as per (NFTPrice.mul(_numOfTokens))
    */
    function mintNFT(
        uint256 _numOfTokens
    )
        public
        payable
    {
        require(isActive, 'Contract is not active');
        require(!isPresaleActive, 'Presale is still active');
        require(totalSupply() + _numOfTokens - giveawayCount <= maxSupplyPublic, "Purchase would exceed max public supply of NFTs");
        require(NFTPrice * _numOfTokens == msg.value, "Ether value sent is not correct");
        require(mintedAmount[msg.sender] + _numOfTokens <= maxMint, 'Purchase exceeds maximum mintable');
        if (ReferralToCode[msg.sender] == 0){
            codeToReferral[totalSupply()] = msg.sender;
            ReferralToCode[msg.sender] = totalSupply();
        }
        bank[address(this)] += _numOfTokens * NFTPrice;
        _safeMint(msg.sender, _numOfTokens);
        mintedAmount[msg.sender] += _numOfTokens;
    }

    /*
     * Function to mint new NFTs during the public sale
     * It is payable. Amount is calculated as per (NFTPrice.mul(_numOfTokens))
    */
    function mintNFT(
        uint256 _numOfTokens,
        uint256 referralCode
    )
        public
        payable
    {
        require(isActive, 'Contract is not active');
        require(!isPresaleActive, 'Presale is still active');
        require(totalSupply() + _numOfTokens - giveawayCount <= maxSupplyPublic, "Purchase would exceed max public supply of NFTs");
        require(NFTPrice * _numOfTokens == msg.value, "Ether value sent is not correct");
        require(mintedAmount[msg.sender] + _numOfTokens <= maxMint, 'Purchase exceeds maximum mintable');
        require(codeToReferral[referralCode] != address(0), "Not a valid code");
        if (ReferralToCode[msg.sender] == 0){
            codeToReferral[totalSupply()] = msg.sender;
            ReferralToCode[msg.sender] = totalSupply();
        }
        _safeMint(msg.sender, _numOfTokens);
        totalReferred[codeToReferral[referralCode]] += _numOfTokens;
        bank[codeToReferral[referralCode]] += _numOfTokens * referralShare;
        bank[msg.sender] += _numOfTokens * referredShare;
        bank[address(this)] += _numOfTokens * teamShare;
        mintedAmount[msg.sender] += _numOfTokens;
    }

    function claim() public {
        require(bank[msg.sender] > 0, "Nothing to claim");
        payable(msg.sender).transfer(bank[msg.sender]);
        bank[msg.sender] = 0;
    }

    /*
     * Function to mint new NFTs during the presale
     * It is payable. Amount is calculated as per (NFTPrice.mul(_numOfTokens))
    */
    function mintNFTDuringPresale(
        uint256 _numOfTokens,
        bytes32[] memory _proof
    ) 
        public 
        payable
    {
        require(isActive, 'Sale is not active');
        require(isPresaleActive, 'Whitelist is not active');
        require(verify(_proof, bytes32(uint256(uint160(msg.sender)))), "Not whitelisted");
        if (!freeMintActive){
            require(totalSupply() < maxSupplyPublic, 'All public tokens have been minted');
            require(_numOfTokens <= maxMint, 'Cannot purchase this many tokens');
            require(totalSupply() + _numOfTokens - giveawayCount <= maxSupplyPublic, 'Purchase would exceed max public supply of NFTs');
            require(mintedAmount[msg.sender] + _numOfTokens <= maxMint, 'Purchase exceeds maximum mintable');
            require(NFTPrice * _numOfTokens == msg.value, "Ether value sent is not correct");
            mintedAmount[msg.sender] += _numOfTokens;
            _safeMint(msg.sender, _numOfTokens);
        }
        else{
            require(totalSupply() < maxSupply, 'All tokens have been minted');
            require(_numOfTokens == 1, 'Cannot purchase this many tokens');
            require(!giveawayMintClaimed[msg.sender], 'Already claimed giveaway');
            giveawayMintClaimed[msg.sender] = true;
            _safeMint(msg.sender, _numOfTokens);
        }
    }

    /*
     * Function to mint NFTs for giveaway and partnerships
    */
    function mintByOwner(
    )
        public 
        onlyOwner
    {
        require(totalSupply() < maxSupply, "Tokens number to mint cannot exceed number of MAX tokens");
        _safeMint(msg.sender, 1);
    }

    /*
     * Function to mint all NFTs for giveaway and partnerships
    */
    function mintMultipleByOwner(
        address[] memory _to
    )
        public
        onlyOwner
    {
        for(uint256 i = 0; i < _to.length; i++){
            require(totalSupply() < maxSupply, "Tokens number to mint cannot exceed number of MAX tokens");
            if (ReferralToCode[_to[i]] == 0){
                codeToReferral[totalSupply()] = _to[i];
                ReferralToCode[_to[i]] = totalSupply();
            }
            _safeMint(_to[i], 1);
        }
    }

    /*
     * Function to get token URI of given token ID
    */
    function tokenURI(
        uint256 _tokenId
    )
        public 
        view 
        virtual 
        override 
        returns (string memory) 
    {
        require(_exists(_tokenId), "ERC721Metadata: URI query for nonexistent token");
        if (!reveal) {
            return string(abi.encodePacked(blindURI));
        } else {
            return string(abi.encodePacked(baseURI, _tokenId.toString()));
        }
    }

    // Set Root for whitelist and raffle to participate in presale
    function setRootAndMax(uint256 _root,uint256 _max) onlyOwner() public {
        root = bytes32(_root);
        maxMint=_max;
    }

    // Verify MerkleProof
    function verify(bytes32[] memory proof, bytes32 leaf) public view returns (bool) {
        bytes32 computedHash = leaf;

        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];

            if (computedHash <= proofElement) {
                // Hash(current computed hash + current element of the proof)
                computedHash = sha256(abi.encodePacked(computedHash, proofElement));
            } else {
                // Hash(current element of the proof + current computed hash)
                computedHash = sha256(abi.encodePacked(proofElement, computedHash));
            }
        }

        // Check if the computed hash (root) is equal to the provided root
        return computedHash == root;
    }
}