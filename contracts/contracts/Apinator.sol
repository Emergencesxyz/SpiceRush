// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// File @openzeppelin/contracts/access/Ownable.sol@v4.3.0

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

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _setOwner(_msgSender());
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
        _setOwner(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(
            newOwner != address(0),
            "Ownable: new owner is the zero address"
        );
        _setOwner(newOwner);
    }

    function _setOwner(address newOwner) private {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

import "./ERC721A.sol";

contract Apinator is ERC721A, Ownable {
    constructor() ERC721A("Apinator", "Apinator", 10) {}

    using SafeMath for uint256;
    using Strings for uint256;

    string private baseURI;
    string private blindURI;
    uint256 public constant BUY_LIMIT_PER_TX = 5;
    uint256 public constant MAX_NFT_PUBLIC = 8000;
    uint256 private constant MAX_NFT = 8000;
    uint256 public NFTPrice = 2000000000000000; // 0.002 ETH
    bool public reveal;
    bool public isActive;
    bool public isPresaleActive;
    bool private freeMintActive;
    bytes32 public root;
    uint256 public WHITELIST_MAX_MINT = 2;
    mapping(address => uint256) public whiteListClaimed;
    mapping(address => bool) private giveawayMintClaimed;
    uint256 public giveawayCount;

    /*
     * Function to reveal all Lucky Lion Club
     */
    function revealNow() external onlyOwner {
        reveal = true;
    }

    /*
     * Function setIsActive to activate/desactivate the smart contract
     */
    function setIsActive(bool _isActive) external onlyOwner {
        isActive = _isActive;
    }

    /*
     * Function setPresaleActive to activate/desactivate the whitelist/raffle presale
     */
    function setPresaleActive(bool _isActive) external onlyOwner {
        isPresaleActive = _isActive;
    }

    /*
     * Function setFreeMintActive to activate/desactivate the free mint capability
     */
    function setFreeMintActive(bool _isActive) external onlyOwner {
        freeMintActive = _isActive;
    }

    /*
     * Function to set Base and Blind URI
     */
    function setURIs(string memory _blindURI, string memory _URI)
        external
        onlyOwner
    {
        blindURI = _blindURI;
        baseURI = _URI;
    }

    /*
     * Function to withdraw collected amount during minting by the owner
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Balance should be more then zero");
        payable(address(0xfF9cE6B8aC49d8dad861Eb55f78bE2Fd1f8D180D)).transfer(
            balance
        );
    }

    /*
     * Function to mint new NFTs during the public sale
     * It is payable. Amount is calculated as per (NFTPrice.mul(_numOfTokens))
     */
    function mintNFT(uint256 _numOfTokens) public payable {
        require(isActive, "Contract is not active");
        require(!isPresaleActive, "Presale is still active");
        require(_numOfTokens <= BUY_LIMIT_PER_TX, "Cannot mint above limit");
        require(
            totalSupply().add(_numOfTokens).sub(giveawayCount) <=
                MAX_NFT_PUBLIC,
            "Purchase would exceed max public supply of NFTs"
        );
        require(
            NFTPrice.mul(_numOfTokens) == msg.value,
            "Ether value sent is not correct"
        );
        _safeMint(msg.sender, _numOfTokens);
    }

    /*
     * Function to mint new NFTs during the presale
     * It is payable. Amount is calculated as per (NFTPrice.mul(_numOfTokens))
     */
    function mintNFTDuringPresale(uint256 _numOfTokens, bytes32[] memory _proof)
        public
        payable
    {
        require(isActive, "Sale is not active");
        require(isPresaleActive, "Whitelist is not active");
        require(
            verify(_proof, bytes32(uint256(uint160(msg.sender)))),
            "Not whitelisted"
        );
        if (!freeMintActive) {
            require(
                totalSupply() < MAX_NFT_PUBLIC,
                "All public tokens have been minted"
            );
            require(
                _numOfTokens <= WHITELIST_MAX_MINT,
                "Cannot purchase this many tokens"
            );
            require(
                totalSupply().add(_numOfTokens).sub(giveawayCount) <=
                    MAX_NFT_PUBLIC,
                "Purchase would exceed max public supply of NFTs"
            );
            require(
                whiteListClaimed[msg.sender].add(_numOfTokens) <=
                    WHITELIST_MAX_MINT,
                "Purchase exceeds max whiteed"
            );
            require(
                NFTPrice.mul(_numOfTokens) == msg.value,
                "Ether value sent is not correct"
            );
            whiteListClaimed[msg.sender] += _numOfTokens;
            _safeMint(msg.sender, _numOfTokens);
        } else {
            require(totalSupply() < MAX_NFT, "All tokens have been minted");
            require(_numOfTokens == 1, "Cannot purchase this many tokens");
            require(
                !giveawayMintClaimed[msg.sender],
                "Already claimed giveaway"
            );
            giveawayMintClaimed[msg.sender] = true;
            _safeMint(msg.sender, _numOfTokens);
        }
    }

    /*
     * Function to mint NFTs for giveaway and partnerships
     */
    function mintByOwner() public onlyOwner {
        require(
            totalSupply() + 1 < MAX_NFT,
            "Tokens number to mint cannot exceed number of MAX tokens"
        );
        _safeMint(msg.sender, 1);
    }

    /*
     * Function to mint all NFTs for giveaway and partnerships
     */
    function mintMultipleByOwner(address[] memory _to) public onlyOwner {
        for (uint256 i = 0; i < _to.length; i++) {
            require(
                totalSupply() + 1 < MAX_NFT,
                "Tokens number to mint cannot exceed number of MAX tokens"
            );
            _safeMint(_to[i], 1);
        }
    }

    /*
     * Function to get token URI of given token ID
     * URI will be blank untill totalSupply reaches MAX_NFT_PUBLIC
     */
    function tokenURI(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(_tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        if (!reveal) {
            return string(abi.encodePacked(blindURI));
        } else {
            return string(abi.encodePacked(baseURI, _tokenId.toString()));
        }
    }

    // Set Root for whitelist and raffle to participate in presale
    function setRootAndMax(uint256 _root, uint256 _max) public onlyOwner {
        root = bytes32(_root);
        WHITELIST_MAX_MINT = _max;
    }

    // Verify MerkleProof
    function verify(bytes32[] memory proof, bytes32 leaf)
        public
        view
        returns (bool)
    {
        bytes32 computedHash = leaf;

        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];

            if (computedHash <= proofElement) {
                // Hash(current computed hash + current element of the proof)
                computedHash = sha256(
                    abi.encodePacked(computedHash, proofElement)
                );
            } else {
                // Hash(current element of the proof + current computed hash)
                computedHash = sha256(
                    abi.encodePacked(proofElement, computedHash)
                );
            }
        }

        // Check if the computed hash (root) is equal to the provided root
        return computedHash == root;
    }
}
