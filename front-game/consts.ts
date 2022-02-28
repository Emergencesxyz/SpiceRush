const constants = {
  nftPrice: "200000000000000000", //ETH

  gameplayABI: [
    {
      inputs: [
        {
          internalType: "address",
          name: "apinatorAddress",
          type: "address",
        },
        {
          internalType: "address",
          name: "apinatorPropertyAddress",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "int256",
          name: "_x",
          type: "int256",
        },
        {
          indexed: false,
          internalType: "int256",
          name: "_y",
          type: "int256",
        },
      ],
      name: "buyLand",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "_name",
          type: "string",
        },
      ],
      name: "changedName",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "int256",
          name: "_x",
          type: "int256",
        },
        {
          indexed: false,
          internalType: "int256",
          name: "_y",
          type: "int256",
        },
      ],
      name: "died",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "int256",
          name: "_x",
          type: "int256",
        },
        {
          indexed: false,
          internalType: "int256",
          name: "_y",
          type: "int256",
        },
        {
          indexed: false,
          internalType: "int16",
          name: "_level",
          type: "int16",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_spiceAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint16",
          name: "_foesAmount",
          type: "uint16",
        },
      ],
      name: "explored",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint16",
          name: "_mining",
          type: "uint16",
        },
        {
          indexed: false,
          internalType: "uint16",
          name: "_hpMax",
          type: "uint16",
        },
        {
          indexed: false,
          internalType: "uint16",
          name: "_energyMax",
          type: "uint16",
        },
      ],
      name: "leveledUp",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_bank",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_spiceAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint16",
          name: "_xp",
          type: "uint16",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_nextActionTime",
          type: "uint256",
        },
      ],
      name: "mining",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "int256",
          name: "_x",
          type: "int256",
        },
        {
          indexed: false,
          internalType: "int256",
          name: "_y",
          type: "int256",
        },
        {
          indexed: false,
          internalType: "uint16",
          name: "_hp",
          type: "uint16",
        },
        {
          indexed: false,
          internalType: "uint16",
          name: "_energy",
          type: "uint16",
        },
        {
          indexed: false,
          internalType: "uint16",
          name: "_xp",
          type: "uint16",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_nextActionTime",
          type: "uint256",
        },
      ],
      name: "moving",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint16",
          name: "_hp",
          type: "uint16",
        },
        {
          indexed: false,
          internalType: "uint16",
          name: "_energy",
          type: "uint16",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_nextActionTime",
          type: "uint256",
        },
      ],
      name: "resting",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "int256",
          name: "_x",
          type: "int256",
        },
        {
          indexed: false,
          internalType: "int256",
          name: "_y",
          type: "int256",
        },
      ],
      name: "spawned",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "addSpice",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "apinator",
      outputs: [
        {
          internalType: "contract IERC721",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "bank",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "charas",
      outputs: [
        {
          internalType: "uint256",
          name: "nextActionTime",
          type: "uint256",
        },
        {
          internalType: "int256",
          name: "x",
          type: "int256",
        },
        {
          internalType: "int256",
          name: "y",
          type: "int256",
        },
        {
          components: [
            {
              internalType: "uint16",
              name: "hp",
              type: "uint16",
            },
            {
              internalType: "uint16",
              name: "energy",
              type: "uint16",
            },
            {
              internalType: "uint16",
              name: "mining",
              type: "uint16",
            },
            {
              internalType: "uint16",
              name: "hpMax",
              type: "uint16",
            },
            {
              internalType: "uint16",
              name: "energyMax",
              type: "uint16",
            },
          ],
          internalType: "struct Gameplay.Stats",
          name: "stats",
          type: "tuple",
        },
        {
          internalType: "uint16",
          name: "xp",
          type: "uint16",
        },
        {
          internalType: "uint16",
          name: "lvl",
          type: "uint16",
        },
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "claimSpice",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "getTeamsSpice",
      outputs: [
        {
          internalType: "uint256[2]",
          name: "",
          type: "uint256[2]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "isLevelUpAvailable",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "uint8",
          name: "statId",
          type: "uint8",
        },
      ],
      name: "levelUp",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "int256",
          name: "",
          type: "int256",
        },
        {
          internalType: "int256",
          name: "",
          type: "int256",
        },
      ],
      name: "map",
      outputs: [
        {
          internalType: "bool",
          name: "isExplored",
          type: "bool",
        },
        {
          internalType: "int16",
          name: "level",
          type: "int16",
        },
        {
          internalType: "uint256",
          name: "spiceAmount",
          type: "uint256",
        },
        {
          internalType: "uint16",
          name: "foesAmount",
          type: "uint16",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "uint16",
          name: "actionNb",
          type: "uint16",
        },
      ],
      name: "mine",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "int256",
          name: "x",
          type: "int256",
        },
        {
          internalType: "int256",
          name: "y",
          type: "int256",
        },
      ],
      name: "mintTile",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "int256",
          name: "x",
          type: "int256",
        },
        {
          internalType: "int256",
          name: "y",
          type: "int256",
        },
      ],
      name: "move",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "property",
      outputs: [
        {
          internalType: "contract INFT",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "uint16",
          name: "actionNb",
          type: "uint16",
        },
      ],
      name: "rest",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "agreement",
          type: "bool",
        },
      ],
      name: "selfTerminate",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_actionTime",
          type: "uint256",
        },
      ],
      name: "setActionTime",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint16",
          name: "_dif",
          type: "uint16",
        },
      ],
      name: "setDifficulty",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
      ],
      name: "setName",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "int256",
          name: "x",
          type: "int256",
        },
        {
          internalType: "int256",
          name: "y",
          type: "int256",
        },
        {
          internalType: "int16",
          name: "level",
          type: "int16",
        },
      ],
      name: "setSpawnTile",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_spiceBlocksPerTile",
          type: "uint256",
        },
      ],
      name: "setSpiceBlocksPerTile",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint8",
          name: "_teamNum",
          type: "uint8",
        },
      ],
      name: "setTeamNum",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "spawn",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "teamOf",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],

  apinatorABI: [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "approved",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "ApprovalForAll",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [],
      name: "BUY_LIMIT_PER_TX",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "MAX_NFT_PUBLIC",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "NFTPrice",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "WHITELIST_MAX_MINT",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "getApproved",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "giveawayCount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "isActive",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
      ],
      name: "isApprovedForAll",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "isPresaleActive",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "mintByOwner",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address[]",
          name: "_to",
          type: "address[]",
        },
      ],
      name: "mintMultipleByOwner",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_numOfTokens",
          type: "uint256",
        },
      ],
      name: "mintNFT",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_numOfTokens",
          type: "uint256",
        },
        {
          internalType: "bytes32[]",
          name: "_proof",
          type: "bytes32[]",
        },
      ],
      name: "mintNFTDuringPresale",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "nextOwnerToExplicitlySet",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ownerOf",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "reveal",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "revealNow",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "root",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "_data",
          type: "bytes",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "setApprovalForAll",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bool",
          name: "_isActive",
          type: "bool",
        },
      ],
      name: "setFreeMintActive",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bool",
          name: "_isActive",
          type: "bool",
        },
      ],
      name: "setIsActive",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bool",
          name: "_isActive",
          type: "bool",
        },
      ],
      name: "setPresaleActive",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_root",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_max",
          type: "uint256",
        },
      ],
      name: "setRootAndMax",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_blindURI",
          type: "string",
        },
        {
          internalType: "string",
          name: "_URI",
          type: "string",
        },
      ],
      name: "setURIs",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes4",
          name: "interfaceId",
          type: "bytes4",
        },
      ],
      name: "supportsInterface",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "index",
          type: "uint256",
        },
      ],
      name: "tokenByIndex",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "index",
          type: "uint256",
        },
      ],
      name: "tokenOfOwnerByIndex",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
      ],
      name: "tokenURI",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32[]",
          name: "proof",
          type: "bytes32[]",
        },
        {
          internalType: "bytes32",
          name: "leaf",
          type: "bytes32",
        },
      ],
      name: "verify",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "walletOfOwner",
      outputs: [
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "whiteListClaimed",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "withdraw",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],

  randomQuotes: [
    "",
    "❝Today is a good day... well not for you.❞",
    "❝Ancients say that a virus wiped all the humans of the planet. I wouldn't know, all my memories were downloaded... btw do you have some $SPICE ?❞",
    "❝An advice ? Well don't trust anyone out here.. that and watching out for Giant Worms.❞",
    "❝Great men create good times, good times create weak men and weak men created the difficult times that we live in. Me ? Don't worry you won't live enough time to find out.❞",
    "❝If you give me all your $SPICE right now, I promise that you I will not le you die in the desert... maybe.❞",
    "[AD] Buy yourself a bionic breast enhancement for the modic sum of 1M $SPICE. Self-confidence has no price.",
    "$SPICE is the ingame currency and energy resource. You need it to travel, fight, mine. Owners of the genesis collection will enjoy a lifetime fixed yield of $SPICE.",
    " This is a zero-sum game. You can decide to stay on your own, cooperate with others, or play it dirty and get your hands on your neighbors $SPICE.",
    "[AD] Cheap fields to buy in the wastelands*. Presence of $SPICE : likely. Don't miss the train. *Chances of certain death. ",
  ],

  tutorial_character: {
    energy:
      '📚 This is your energy amount. It decreases when you take any action. Click on "rest" when low on energy.',
    character:
      "📚 This is all the information about your character. Click anywhere to learn more",
    hp: "📚 Literally vital. Lose all your health and you will have to restart again.",
    mining:
      "📚 The more mining power, the more $SPICE you can extract from the lands.",
    spiceMined:
      '📚 The alpha and omega of this game. Click on "Mine" to extract spice from your current land. You will be able to trade this against real tokens! ',
    lvl: "📚 Your current level.  An arrow animation will appear beside your stats when you will have passed a level.",
    xp: "📚  Take actions to earn experience and increase your level. ",
    position:
      "📚  This is your current position on the map. The tile on which you are will be bordered with blue. Click on center to view your position or spawn to appear on the map. ",
  },
  tutorial_intro: [
    "👋 So.. first time here uh ?",
    "😊 Let me help you with this mess.",
    "👛 First, connect your wallet. I'll wait.",
    "✔️ Done ? Great, now mint a NFT or if you have already one, input your ID and press select.",
    "Ok, the character screen should have popped up by now. Click on any icon to get more information.",
    "Below is the map, it's made of tiles. Actually just a portion of it. Click on the arrows to look orther parts of the map.   Click on a tile to get more information.",
    "Go to action screen and spawn to appear on the map. Your tile should be bordered with blue.",
    "🏃 Now press any arrow from the action screen to move your character.",
    "👀 Check if the tile has some spice on it. if it has, press mine to get it, if not continue moving until you find a tile with spice on it.",
    "🎉 Congratulations, your earned some spice. Keep it, you will be able to trade it against real tokens in the future!",
  ],
};
export default constants;
