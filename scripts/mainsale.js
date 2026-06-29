const { ethers } = require("hardhat")

const wait = (seconds) => {
  const milliseconds = seconds * 1000
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
async function main() {
    const accounts = await ethers.getSigners()
    const ticketMaster = accounts[0]

    const { chainId } = await ethers.provider.getNetwork()

    console.log(`Deploying to chainId: ${chainId}`)
    console.log(`Deployer: ${ticketMaster.address}\n`)

    const Tickets = await ethers.getContractFactory('syberTickets')

    const tickets = await Tickets.deploy()
    await tickets.deployed() 

    console.log(`Contract deployed to: ${tickets.address}\n`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  //code to run to testnet [npx hardhat run scripts/mainsale.js --network baseSepolia]
  