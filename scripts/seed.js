const hre = require("hardhat");
const config = require('../src/config.json')

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
    console.log(`Fetching accounts and network \n`)
    const accounts = await ethers.getSigners()
    const deployer = accounts[0]
    const user1 = accounts [1]
    const user2 = accounts [2]
    const user3 = accounts [3]


    const { chainId } = await ethers.provider.getNetwork()
    console.log (`Fetching token and transfering to acccounts`)

    console.log("Chain ID:", chainId);
    console.log("Config:", config);
    const tickets = await ethers.getContractAt('syberTickets', config[chainId].syberTickets.address)
    console.log(`Tickets fetched: ${tickets.address}\n`)

    //Create Some seed Events [4]
    let transaction
    console.log(`Creating Event 1...\n`)
    date1 = 1807920000;
    transaction = await tickets.connect(user1).createEvent('Max Fosh Comedy', date1, tokens(5), tokens(4), 50)
    await transaction.wait()

    console.log(`Creating Event 2...\n`)
    date2 = 1816732800;
    transaction = await tickets.connect(user2).createEvent('Teletubbie Party', date2, tokens(100), tokens(90), 35)
    await transaction.wait()

    console.log(`Creating Event 3...\n`)
    date3 = 1829782800;
    transaction = await tickets.connect(user3).createEvent('Company Christmas Party', date3, tokens(10), tokens(9), 26)
    await transaction.wait()

    console.log(`Creating Event 4...\n`)
    date4 = 1820001600;
    transaction = await tickets.connect(deployer).createEvent('The Super Taylor Swift Show', date4, tokens(300), tokens(250), 200)
    await transaction.wait()
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});