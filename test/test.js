const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NationNFT", function () {
  it("Should", async function () {
    const NationNFT = await ethers.getContractFactory("NationNFT");
    const nationNFT = await NationNFT.deploy();

    await nationNFT.deployed();

    //expect(await greeter.greet()).to.equal("Hello, world!");
    //const setGreetingTx = await greeter.setGreeting("Hola, mundo!");
    //await setGreetingTx.wait();

    console.log("name:", await nationNFT.name());

    console.log("attribute(0):", await nationNFT.viewAttributes(0));
  });
});
