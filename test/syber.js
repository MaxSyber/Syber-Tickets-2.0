const { expect } = require('chai')
const { ethers } = require('hardhat')

const tokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Tickets', () => {
	let tickets, accounts, deployer
	beforeEach(async () => {
		const Tickets = await ethers.getContractFactory('syberTickets')
		tickets = await Tickets.deploy()
		accounts = await ethers.getSigners()
		deployer = accounts[0]
    user1 = accounts[1]
	})

  describe('Deployment' , () => {
    it("sets ticketMaster as deployer", async function () {
      expect(await tickets.ticketMaster()).to.equal(deployer.address);
    })
  })
})