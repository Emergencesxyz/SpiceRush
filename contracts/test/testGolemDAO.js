const { expect } = require("chai");
const { waffle } = require("hardhat");
const provider = waffle.provider;


describe("Basic test", function() {
  it("works", async function() {
    await network.provider.send("evm_setNextBlockTimestamp", [4244522870])

    accounts = await ethers.getSigners()
    myAddress = accounts[0].address;


    Factory = await ethers.getContractFactory("Golem");
    golem = await Factory.deploy();
    await golem.deployed();
    Factory = await ethers.getContractFactory("GolemDAO");
    golemDao = await Factory.deploy(golem.address);
    await golemDao.deployed();

    // let digits = "000000000000000000";
    await golem.updateOperator(golemDao.address, true)

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

    console.log(await (await golem.balanceOf(accounts[4].address)).toString())
    await golemDao.connect(accounts[4]).stake("100000000000000000000")
    console.log(await (await golem.balanceOf(accounts[4].address)).toString())

    await network.provider.send("evm_increaseTime", [10])
    await network.provider.send('evm_mine');

    console.log(await (await golemDao.connect(accounts[4]).getPower(accounts[4].address)).toString())

    await golemDao.connect(accounts[4]).stake("100000000000000000000")

    await network.provider.send("evm_increaseTime", [10])
    await network.provider.send('evm_mine');

    console.log(await (await golemDao.connect(accounts[4]).getPower(accounts[4].address)).toString())

    await golemDao.connect(accounts[4]).withdraw("200000000000000000000") 
    console.log(await (await golem.balanceOf(accounts[4].address)).toString())    
    
  });

});
