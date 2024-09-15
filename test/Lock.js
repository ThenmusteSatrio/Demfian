const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Account", function () {
  let UserRegistry, userRegistry, owner, addr1, addr2;

  beforeEach(async function () {
    UserRegistry = await ethers.deployContract("Account", [], {});
    let address = await UserRegistry.getAddress();
    userRegistry = await ethers.getContractAt("Account", address);
    [owner, addr1, addr2, _] = await ethers.getSigners();
  });

  it("Should allow a user to register", async function () {
    await userRegistry.connect(addr1).register("User1", "image.png");
    const user = await userRegistry.getUserDetails(addr1.address);

    expect(user.username).to.equal("User1");
    expect(user.userAddress).to.equal(addr1.address);
  });

  it("Should return true for registered users", async function () {
    await userRegistry.connect(addr1).register("User1", "image.png");
    expect(await userRegistry.isRegistered(addr1.address)).to.equal(true);
  });

  it("Should return false for unregistered users", async function () {
    expect(await userRegistry.isRegistered(addr2.address)).to.equal(false);
  });
});
