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
		user2 = accounts[2]
	})

  describe('Deployment' , () => {
    it("sets ticketMaster as deployer", async function () {
      expect(await tickets.ticketMaster()).to.equal(deployer.address)
    })

	it("Sets Total Events to 0", async function () {
      expect(await tickets.totalEvents()).to.equal(0)
    })
  })

  describe('Create Event and Minting', () => {
	let transaction, result
	beforeEach(async () => {
		transaction = await tickets.connect(user1).createEvent("The Big Event", 42, tokens(10), tokens(8), 30)
		result = await transaction.wait()
	})

	it("Stores the Event to the EventData Mapping", async function() {
		const event = await tickets.eventData(0)

		expect(event.id).to.equal(0)
		expect(event.name).to.equal("The Big Event")
		expect(event.date).to.equal(42)
		expect(event.buyAmount).to.equal(tokens(10))
		expect(event.returnAmount).to.equal(tokens(8))
		expect(event.maxSupply).to.equal(30)
		expect(event.creator).to.equal(user1.address);
	})

	it("Mints all Tokens to the TicketMaster Address", async function () {
		for (let i = 0; i < 30; i++) { 
			expect(await tickets.owner(0, i)).to.equal(deployer.address) 
		}
		expect(await tickets.balance(0, deployer.address)).to.equal(30)
	})

	it("Marks Tokens as Existing", async function () {
		expect(await tickets.exists(0, 5)).to.be.true
		expect(await tickets.exists(0, 29)).to.be.true
	})

	it("Increments the Total Events", async function () {
		expect(await tickets.totalEvents()).to.equal(1)
	})

	it("Emits a Transfer Event for each Mint", async function () {
		const emit = result.events[0]
		const args = emit.args
		expect(args.tokenId).to.equal(0)
		
		const emit2 = result.events[27]
		const args2 = emit2.args
		expect(args2.tokenId).to.equal(27)
	})
	
	it("Emits a EventCreated for each new Event", async function () {
		const event = result.events.find(
      	(e) => e.event === "EventCreated");

		expect(event).to.not.be.undefined;

		const args3 = event.args;

		expect(args3.eventId).to.equal(0);
		expect(args3.name).to.equal("The Big Event");
		expect(args3.date).to.equal(42);
		expect(args3.buyAmount).to.equal(tokens(10));
		expect(args3.returnAmount).to.equal(tokens(8));
		expect(args3.maxSupply).to.equal(30);
		expect(args3.creator).to.equal(user1.address);
	})
  })

  describe('Buying and Returning' , () => {
	beforeEach(async () => {
		transaction = await tickets.connect(user1).createEvent("The Bigger Event", 42, tokens(10), tokens(8), 30)
		result = await transaction.wait()
		transaction = await tickets.connect(user1).buyTicket(0,0, {value: tokens((10))})
		result = await transaction.wait()
	})

    it("Buys Ticket and Transfers Ownership", async function () {
		
		expect(await tickets.owner(0, 0)).to.equal(user1.address)
		expect(await tickets.balance(0, user1.address)).to.equal(1)
		expect(await tickets.balance(0, deployer.address)).to.equal(29)
    })

	it('Emits A Sell Event', () => {
		const emit = result.events[0]
		const args = emit.args
		expect(args.to).to.equal(user1.address)
		expect(args.from).to.equal(deployer.address)
		expect(args.tokenId).to.equal(0)
		expect(args.eventId).to.equal(0)
	})
	
	it("Returns Ticket and Transfers Ownership", async function () {
		const balanceBefore = await ethers.provider.getBalance(user1.address)
		transaction = await tickets.connect(user1).returnTicket(0,0)
		await transaction.wait()
		const balanceAfter = await ethers.provider.getBalance(user1.address)
		expect(await tickets.owner(0, 0)).to.equal(deployer.address)
		expect(await tickets.balance(0, user1.address)).to.equal(0)
		expect(await tickets.balance(0, deployer.address)).to.equal(30)
		expect(balanceBefore).to.be.lessThan(balanceAfter)
    })

	it('Emits A Return Event', async function () {
		transaction = await tickets.connect(user1).returnTicket(0,0)
		returnResult = await transaction.wait()
		const emit = returnResult.events[0]
		const args = emit.args
		expect(args.to).to.equal(user1.address)
		expect(args.from).to.equal(user1.address)
		expect(args.tokenId).to.equal(0)
		expect(args.eventId).to.equal(0)
	})
  })

  describe('Failure Cases' , () => {
    it("Rejects createEvent if Maxsupply is Too Low", async function () {
    	await expect(tickets.connect(user1).createEvent("The Small Event", 42, tokens(10), tokens(8), 2)).to.be.revertedWith("Max supply must be within range 10-5000")
    })

	it("Rejects createEvent if Maxsupply is Too High", async function () {
    	await expect(tickets.connect(user1).createEvent("The Small Event", 42, tokens(10), tokens(8), 80000)).to.be.revertedWith("Max supply must be within range 10-5000")
    })

	it("Rejects createEvent if returnAmount > buyAmount", async function () {
    	await expect(tickets.connect(user1).createEvent("The Small Event", 42, tokens(8), tokens(10), 30)).to.be.revertedWith("Return Amount must be less than or equal to buy Amount")
    })

	it("Rejects buyTicket if Event Doent Exist", async function () {
		transaction = await tickets.connect(user1).createEvent("The Big Event", 42, tokens(10), tokens(8), 30)
    	await expect(tickets.connect(user1).buyTicket(1,12)).to.be.revertedWith("Event does not exist")
    })

	it("Rejects buyTicket if Token Doent Exist", async function () {
		transaction = await tickets.connect(user1).createEvent("The Big Event", 42, tokens(10), tokens(8), 30)
    	await expect(tickets.connect(user1).buyTicket(0,31)).to.be.revertedWith("Token does not exist")
    })

	it("Rejects buyTicket if Ticket is Already Purchased", async function () {
		transaction = await tickets.connect(user1).createEvent("The Big Event", 42, tokens(10), tokens(8), 30)
		transaction = await tickets.connect(user1).buyTicket(0,0, {value: tokens(10)})
    	transaction = await expect(tickets.connect(user1).buyTicket(0,0)).to.be.revertedWith("This ticket is already sold")
    })

	it("Rejects buyTicket if not Enough Ether", async function () {
		transaction = await tickets.connect(user1).createEvent("The Big Event", 42, tokens(10), tokens(8), 30)
    	transaction = await expect(tickets.connect(user1).buyTicket(0,0, {value: tokens(9)})).to.be.revertedWith("Input Price does not match ticket price")
    })

	it("Rejects buyTicket if Purchaser is Trying to Buy More Than Two Tickets", async function () {
		transaction = await tickets.connect(user1).createEvent("The Big Event", 42, tokens(10), tokens(8), 30)
		transaction = await tickets.connect(user1).buyTicket(0,0, {value: tokens(10)})
		transaction = await tickets.connect(user1).buyTicket(0,1, {value: tokens(10)})
    	transaction = await expect(tickets.connect(user1).buyTicket(0,2, {value: tokens(9)})).to.be.revertedWith("Each address can only own a maximum of two tickets")
    })

	it("Rejects returnTicket if event does not exist", async function () {
		transaction = await tickets.connect(user1).createEvent("The Biggest Event", 42, tokens(10), tokens(8), 30)
		transaction = await tickets.connect(user1).buyTicket(0,0, {value: tokens(10)})
		transaction = await expect(tickets.connect(user1).returnTicket(20,0)).to.be.revertedWith("Event does not exist")
	})

	it("Rejects returnTicket if User is Not the Ticket Holder", async function () {
		transaction = await tickets.connect(user1).createEvent("The Biggest Event", 42, tokens(10), tokens(8), 30)
		transaction = await tickets.connect(user1).buyTicket(0,0, {value: tokens(10)})
		transaction = await expect(tickets.connect(user2).returnTicket(0,0)).to.be.revertedWith("You are not the ticket holder")
	})

	it("Rejects Admin cancelTicket if Event Doesnt Exist", async function () {
		transaction = await tickets.connect(user1).createEvent("The Biggest Event", 42, tokens(10), tokens(8), 30)
		transaction = await tickets.connect(user1).buyTicket(0,0, {value: tokens(10)})
		transaction = await expect(tickets.connect(deployer).cancelTicket(user1.address,1,0)).to.be.revertedWith("Event does not exist")
	})

	it("Rejects Admin cancelTicket if Token Doesnt Exist", async function () {
		transaction = await tickets.connect(user1).createEvent("The Biggest Event", 42, tokens(10), tokens(8), 30)
		transaction = await tickets.connect(user1).buyTicket(0,0, {value: tokens(10)})
		transaction = await expect(tickets.connect(deployer).cancelTicket(user1.address,0,31)).to.be.revertedWith("Token does not exist")
	})

	it("Rejects Admin cancelTicket if Targeted User is not Token Owner", async function () {
		transaction = await tickets.connect(user1).createEvent("The Biggest Event", 42, tokens(10), tokens(8), 30)
		transaction = await tickets.connect(user2).buyTicket(0,0, {value: tokens(10)})
		transaction = await expect(tickets.connect(deployer).cancelTicket(user1.address,0,0)).to.be.revertedWith("That is not the ticket holder")
	})
  })

  describe('Admin Actions' , () => { 
	it("Accepts Admin Deposits", async function () {
		const balanceBefore = await ethers.provider.getBalance(tickets.address)	
		transaction = await tickets.connect(deployer).adminDeposit({value: tokens(110)})
		const balanceAfter = await ethers.provider.getBalance(tickets.address)
		expect(balanceBefore).to.be.lessThan(balanceAfter)
	})

	it('Emits A Admin Deposit Event', async function () {
		transaction = await tickets.connect(deployer).adminDeposit({value: tokens(110)})
		adminDeposit = await transaction.wait()
		const adminEmit = adminDeposit.events[0]
		const args = adminEmit.args
		expect(args.from).to.equal(deployer.address)
		expect(args.amount).to.equal(tokens(110))
	})

	it("Processes Admin Withdraws", async function () {
		transaction = await tickets.connect(user1).createEvent("The Biggest Event", 42, tokens(10), tokens(8), 30)
		transaction = await tickets.connect(user1).buyTicket(0,0, {value: tokens(10)})
		const balanceBefore = await ethers.provider.getBalance(tickets.address)
		transaction = await tickets.connect(deployer).adminWithdraw(tokens(4))
		await transaction.wait()
		const balanceAfter = await ethers.provider.getBalance(tickets.address)
		expect(balanceAfter).to.equal(balanceBefore.sub(tokens(4)));
	})

	it('Emits A Admin Withdraw Event', async function () {
		transaction = await tickets.connect(user1).createEvent("The Biggest Event", 42, tokens(10), tokens(8), 30)
		transaction = await tickets.connect(user1).buyTicket(0,0, {value: tokens(10)})
		transaction = await tickets.connect(deployer).adminWithdraw(tokens(4))
		adminWithdraw = await transaction.wait()
		const adminWEmit = adminWithdraw.events[0]
		const args = adminWEmit.args
		expect(args.to).to.equal(deployer.address)
		expect(args.amount).to.equal(tokens(4))
	})

	it('Admin Returns ticket and Transfers Ownership with cancelTicket', async function () {
		transaction = await tickets.connect(user1).createEvent("The Biggest Event", 42, tokens(10), tokens(8), 30)
		transaction = await tickets.connect(user1).buyTicket(0,0, {value: tokens(10)})
		const balanceBefore = await ethers.provider.getBalance(user1.address)
		await transaction.wait()
		transaction = await tickets.connect(deployer).cancelTicket(user1.address, 0,0)
		const balanceAfter = await ethers.provider.getBalance(user1.address)
		expect(await tickets.owner(0, 0)).to.equal(deployer.address)
		expect(await tickets.balance(0, user1.address)).to.equal(0)
		expect(await tickets.balance(0, deployer.address)).to.equal(30)
		expect(balanceBefore).to.be.lessThan(balanceAfter)
	})

	it('Emits An Admin Return Event', async function () {
		transaction = await tickets.connect(user1).createEvent("The Biggest Event", 42, tokens(10), tokens(8), 30)
		transaction = await tickets.connect(user1).buyTicket(0,0, {value: tokens(10)})
		transaction = await tickets.connect(deployer).cancelTicket(user1.address, 0,0)
		AdminReturn = await transaction.wait()
		const emit = AdminReturn.events[0]
		const args = emit.args
		expect(args.to).to.equal(user1.address)
		expect(args.from).to.equal(deployer.address)
		expect(args.tokenId).to.equal(0)
		expect(args.eventId).to.equal(0)
	})
  })
})
