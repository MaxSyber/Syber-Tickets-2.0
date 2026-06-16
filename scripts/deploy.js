const hre = require("hardhat");

async function main() {
  console.log(`Preparing Deployment...\n`)
  //Fetch contract to deploy
  const syberTickets = await hre.ethers.getContractFactory('syberTickets')
  //Delploy Contract
  const tickets = await syberTickets.deploy()
  await tickets.deployed()
  console.log(`Contract Deployed to: ${tickets.address}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});