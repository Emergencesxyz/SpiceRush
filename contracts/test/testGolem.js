const { expect } = require("chai");
const { waffle } = require("hardhat");
const provider = waffle.provider;


describe("Basic test", function() {
  it("Should work", async function() {

    accounts = await ethers.getSigners()
    myAddress = accounts[0].address;


    Factory = await ethers.getContractFactory("Golem");
    golem = await Factory.deploy();
    await golem.deployed();

    // let digits = "000000000000000000";

    console.log(myAddress)
    console.log(await golem.owner())
    console.log(await (await golem.balanceOf(myAddress)).toString())

    await golem.connect(accounts[0]).transfer(accounts[2].address, "100000000000000000000")
    await golem.connect(accounts[0]).transfer(accounts[3].address, "100000000000000000000")
    await golem.connect(accounts[0]).transfer(accounts[2].address, "100000000000000000000")

    console.log(await (await golem.balanceOf(myAddress)).toString())

    await golem.connect(accounts[2]).approve(accounts[3].address, "100000000000000000000")
    await golem.connect(accounts[3]).transferFrom(accounts[2].address, accounts[4].address, "100000000000000000000")


    await golem.updateOperator(accounts[3].address, true)
    await golem.connect(accounts[3]).transferFromOperator(accounts[2].address, accounts[4].address, "100000000000000000000")
    
  });

});
