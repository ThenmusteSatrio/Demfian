const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), "ether");
};

describe("NFT Marketplace", function () {
  let account, nftCreation, marketplace;
  let owner, user1, user2;
  let accountAddress, nftCreationAddress, marketplaceAddress;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const Account = await ethers.deployContract("Account", [], {});
    accountAddress = await Account.getAddress();
    account =  await ethers.getContractAt("Account", accountAddress);

    const NFTs = await ethers.deployContract("NFTs", [accountAddress], {});
    nftCreationAddress = await NFTs.getAddress();
    nftCreation = await ethers.getContractAt("NFTs", nftCreationAddress);

    const Marketplace = await ethers.deployContract("MarketPlace", [nftCreationAddress], {});
    marketplaceAddress = await Marketplace.getAddress();
    marketplace = await ethers.getContractAt("MarketPlace", marketplaceAddress);
  });

  it("User registration and NFT creation", async function () {
    await account.connect(user1).register("Anonymous person", "image.png");
    expect(await account.isRegistered(user1.address)).to.equal(true);

    const tokenURI = "https://ipfs.io/ipfs/your-token-uri";
    await nftCreation.connect(user1).mint(tokenURI);
    expect(await nftCreation.totalSupply()).to.equal(1);
  });

  it("Listing and buying NFT", async function () {
    await account.connect(user1).register("Anonymous person", "image.png");
    const tokenURI = "https://ipfs.io/ipfs/your-token-uri";
    await nftCreation.connect(user1).mint(tokenURI);

    await nftCreation.connect(user1).approve(marketplaceAddress, 0);
    await marketplace.connect(user1).listNFT(0, tokens(10));

    await marketplace.connect(user2).buyNFT(0, { value: tokens(10) });

    expect(await nftCreation.ownerOf(0)).to.equal(user2.address);
  });
});
