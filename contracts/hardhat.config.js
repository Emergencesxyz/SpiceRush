require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require("hardhat-gas-reporter");
require("solidity-coverage");

require("dotenv").config();
const { PRIVATE_KEY } = process.env;

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.0",
      },
      {
        version: "0.8.7",
        settings: {},
      },
      {
        version: "0.8.10",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    rinkeby: {
      url: process.env.RINKEBY_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    polygon: {
      url: process.env.POLYGON_URL,
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    mumbai: {
      url: process.env.MUMBAI_URL,
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    kovan: {
      url: process.env.KOVAN_URL,
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  mocha: {
    timeout: 10000000,
  },
};

async function connect(rpcUrl) {
  let provider = ethers.providers.getDefaultProvider(network.config.url);
  let wallet = await new hre.ethers.Wallet(PRIVATE_KEY); //mainnet

  console.log(
    "Init  Balance",
    (await provider.getBalance(wallet.address)).toString()
  );

  console.log("wallet address:", wallet.address);

  return { provider: provider, wallet: wallet };
}
task("deploy", "Deploy Apinator and Gameplay contracts").setAction(
  async (taskArgs) => {
    const { wallet, provider } = await connect(network.config.url);

    console.log("--Deploying contract on network :", network.name);
    console.log("...");

    Factory = await ethers.getContractFactory("Apinator");
    apinator = await Factory.deploy();
    await apinator.deployed();
    Factory = await ethers.getContractFactory("Gameplay");
    gameplay = await Factory.deploy(apinator.address);
    await gameplay.deployed();

    console.log("Contracts deployed ✓");
    console.log("- Apinator : ", apinator.address);
    console.log("- Gameplay : ", gameplay.address);

    await apinator.setIsActive(true);
  }
);
task("fund-link", "Funds a contract with LINK")
  .addParam("contract", "The address of the contract that requires LINK")
  .addOptionalParam("linkAddress", "Set the LINK token address")
  .setAction(async (taskArgs) => {
    //console.log(linkAddress);
    const contractAddr = taskArgs.contract;
    const networkId = network.name;
    console.log("Funding contract ", contractAddr, " on network ", networkId);
    const LINK_TOKEN_ABI = [
      {
        inputs: [
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];

    //set the LINK token contract address according to the environment
    switch (networkId) {
      case "mainnet":
        linkContractAddr = "0x514910771af9ca656af840dff83e8264ecf986ca";
        break;
      case "kovan":
        linkContractAddr = "0xa36085F69e2889c224210F603D836748e7dC0088";
        break;
      case "rinkeby":
        linkContractAddr = "0x01BE23585060835E02B77ef475b0Cc51aA1e0709";
        break;
      case "goerli":
        linkContractAddr = "0x326c977e6efc84e512bb9c30f76e30c160ed06fb";
        break;
      default:
        //default to kovan
        linkContractAddr = "0xa36085F69e2889c224210F603D836748e7dC0088";
    }
    //Fund with 1 LINK token
    const amount = web3.utils.toHex(1e18);

    //Get signer information
    const accounts = await hre.ethers.getSigners();
    const signer = accounts[0];

    //Create connection to LINK token contract and initiate the transfer
    const linkTokenContract = new ethers.Contract(
      linkContractAddr,
      LINK_TOKEN_ABI,
      signer
    );
    var result = await linkTokenContract
      .transfer(contractAddr, amount)
      .then(function (transaction) {
        console.log(
          "Contract ",
          contractAddr,
          " funded with 1 LINK. Transaction Hash: ",
          transaction.hash
        );
      });
  });
