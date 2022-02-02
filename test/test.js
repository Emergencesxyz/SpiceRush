const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NationNFT", function () {
  let game, nationNFT;
  let owner, addr1;

  it("Should deploy", async function () {
    [owner, addr1] = await ethers.getSigners();

    const NationNFT = await ethers.getContractFactory("NationNFT");
    nationNFT = await NationNFT.deploy();
    await nationNFT.deployed();

    const Game = await ethers.getContractFactory("Game");
    game = await Game.deploy(nationNFT.address);
    await game.deployed();

    //expect(await greeter.greet()).to.equal("Hello, world!");
    //const setGreetingTx = await greeter.setGreeting("Hola, mundo!");
    //await setGreetingTx.wait();

    console.log("name:", await nationNFT.name());

    console.log("attribute(0):", await nationNFT.viewAttributes(0));

    //     address _player,
    await nationNFT.mint(owner.address, 0, 10, 20);
    await nationNFT.mint(addr1.address, 1, 20, 10);
  });

  it("Should attack", async function () {
    game.attack(1, 0);
  });
});
