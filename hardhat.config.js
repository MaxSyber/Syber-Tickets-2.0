require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

const privateKey= process.env.PRIVATE_KEY || ""
module.exports = {
  solidity: "0.8.28",
};

/** @typenetworks: {
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: privateKey ? [privateKey] : []
    }
  }, import('hardhat/config').HardhatUserConfig */
