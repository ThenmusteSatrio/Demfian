// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

// import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { ethers } = require("hardhat");



module.exports = buildModule("DeployAccount", (module) => {
 const Account = module.contract("Account", [], {});
 const NFTs = module.contract("NFTs", [Account], {});
 const MarketPlace = module.contract("MarketPlace", [], {});
  return {Account, NFTs, MarketPlace};
});