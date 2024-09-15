// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
import pkg from "hardhat";

const { ethers } = pkg;

async function main() {
  let buyer, seller, inspector, lender;

  let RealEstate, Escrow;
  let realEstate, escrow;

  let address;

  let transaction;

  const tokens = (n) => {
    return ethers.parseUnits(n.toString(), "ether");
  };


  [buyer, seller, inspector, lender] = await ethers.getSigners();
  console.log(`Buyer: ${buyer.address} Seller: ${seller.address} Inspector: ${inspector.address} Lender: ${lender.address}`);
  RealEstate = await ethers.deployContract("RealEstate", [], {});
  address = await RealEstate.getAddress();
  realEstate = await ethers.getContractAt("RealEstate", address);



  Escrow = await ethers.deployContract(
    "Escrow",
    [seller.address, address, inspector.address, lender.address],
    {}
  );
  address = await Escrow.getAddress();
  escrow = await ethers.getContractAt("Escrow", address);

  for (let index = 0; index < 3; index++) {
    transaction = await realEstate
      .connect(seller)
      .approve(Escrow.getAddress(), index);
    await transaction.wait();
  }

  for (let index = 0; index < 3; index++) {
    transaction = await escrow.connect(seller).list(
      index,
      buyer.address,
      tokens(10),
      tokens(5),
    ) 
    await transaction.wait();
  }
  console.log(await Escrow.getAddress())
  console.log("Finished ....");
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});