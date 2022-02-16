// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { waffle, ethers } = require("hardhat");
const provider = waffle.provider;

require("dotenv").config();
const { PRIVATE_KEY } = process.env;

async function connect() {
  let wallet = await new ethers.Wallet(PRIVATE_KEY); //mainnet
  //let wallet = (await ethers.getSigners())[0]; //local

  console.log(
    "Init  Balance",
    (await provider.getBalance(wallet.address)).toString()
  );

  console.log("wallet address:", wallet.address);
  console.log("------------------");

  return wallet;
}

async function deploy(wallet) {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
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

  // await apinator
  //   .connect(wallet)
  //   .mintNFT(2, { value: ethers.utils.parseEther("0.4") });

  await apinator.mintNFT(1, { value: ethers.utils.parseEther("0.001") });
}

async function getContracts(wallet) {
  //let wallet = await new ethers.Wallet(PRIVATE_KEY); //mainnet

  apinator = await ethers.getContractAt(
    "Apinator",
    "0x72964592d695E1f2Ed8764bA5F801aeA8F7AaCD3"
  );

  gameplay = await ethers.getContractAt(
    "Gameplay",
    "0xC2784d28369e70B03f968DA307408D81307Be92F"
  );
  console.log("- Apinator : ", apinator.address);
  console.log("- Gameplay : ", gameplay.address);

  console.log(
    "Apinator total supply :",
    (await apinator.totalSupply()).toString()
  );

  console.log("------------------");
  return { gameplay: gameplay, apinator: apinator };
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
async function main() {
  let wallet = await connect();

  //await deploy(wallet);

  const { gameplay, apinator } = await getContracts(wallet);

  //await apinator.setIsActive(true);
  // await apinator.mintNFT("1", {
  //   from: wallet.address,
  //   value: ethers.utils.parseEther("0.002"),
  // });
  await apinator.ownerOf("0");

  //await gameplay.spawn("1");
  //console.log("owner of", await apinator.ownerOf(1));
  //console.log("choords:", await gameplay.charas(0));
}

main();
