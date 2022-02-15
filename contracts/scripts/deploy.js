// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { waffle } = require("hardhat");
const provider = waffle.provider;

require("dotenv").config();

const { PRIVATE_KEY } = process.env;

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  //let wallet = await new ethers.Wallet(PRIVATE_KEY); //mainnet
  let wallet = (await ethers.getSigners())[0]; //local

  console.log(
    "Init  Balance",
    (await provider.getBalance(wallet.address)).toString()
  );

  Factory = await ethers.getContractFactory("Apinator");
  apinator = await Factory.deploy();
  await apinator.deployed();
  Factory = await ethers.getContractFactory("Gameplay");
  gameplay = await Factory.deploy(apinator.address);
  await gameplay.deployed();

  console.log("Contracts deployed ✓");
  console.log("- Apinator : ", apinator.address);
  console.log("- Gameplay : ", gameplay.address);
}

async function getContractInfo() {
  const apinator = await hre.ethers.getContractAt(
    "Apinator",
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  );
  const gameplay = await hre.ethers.getContractAt(
    "Gameplay",
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
  );

  console.log("- Apinator : ", apinator.address);
  console.log("- Gameplay : ", gameplay.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
getContractInfo().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
