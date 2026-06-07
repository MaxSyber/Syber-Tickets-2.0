//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract syberTickets {

    address public ticketMaster;
    uint256 totalEvents;

    constructor(
        ) {
            ticketMaster = msg.sender;
            totalEvents = 0;
        }

    modifier onlyTicketMaster {
		require(msg.sender == ticketMaster, "Only the Ticket Master can call this function");
		_;
	}

    struct Event {
        uint256 id;
        string name;
        uint256 date;
        uint256 buyAmount;
        uint256 returnAmount;
        uint256 maxSupply;
        address creator;
    }
    //We will require many nested mappings
    //We will require many nested mappings
    //We will require many nested mappings
    //We will require many nested mappings
    //We will require many nested mappings
    event Transfer();
    event Sell();
    event Return();

    function createEvent(string _name, uint256 _date, uint256 _buyAmount, uint256 _returnAmount, uint256 _maxSupply) public {
        mintAllTokens(ticketMaster);
        totalEvents++;
    }

    function _mint(address to, uint256 tokenId) internal virtual {
		require(to != address(0), "ERC: mint to the zero address");
		require(!_exists[tokenId], "Token already exists");
		
		balance[to]++;
		owner[tokenId] = to;
		_exists[tokenId] = true;

		emit Transfer(address(0), to, tokenId);
	}

    function mint(address to, uint256 tokenId) public virtual {
		require(to != address(0), "ERC: mint to the zero address");
		require(totalSupply < maxSupply, "All Tickets Minted");

		_mint(to, tokenId);
		totalSupply++;
	}

    function mintAllTokens(address to) public onlyTicketMaster{
		for(uint256 i = 0; i < maxSupply; i++) {
			mint(to , i , i.toString());
		}
	}

    function buyTicket(address to, uint256 eventId, uint256 tokenId) payable public {
		require(balance[msg.sender] < 2, "Each address can only own a maximum of two tickets");
		require(to != address(0), "Transfer to a zero address");
		require(ticketMaster == owner[tokenId], "This ticket is already sold");
		require(to == ticketMaster, 'Only ticketMaster can sell tickets');
		require(msg.value == sellAmount, 'Input Price does not match ticket price');
		
		owner[tokenId] = msg.sender;
		balance[to]--;
		balance[msg.sender]++;

		(bool success, ) = to.call{value: msg.value}("");
		require(success, "Transfer failed");

		emit Sell(to, msg.sender, tokenId, msg.value);
	}

	function returnTicket(address to, uint256 eventId, uint256 tokenId) public payable {
		require(to == owner[tokenId], "Return value not being sent to ticket holder");
		require(msg.sender == owner[tokenId], "You are not the ticket holder");
		
		owner[tokenId] = ticketMaster;
		balance[to]--;
		balance[ticketMaster]++;

		address payable toPayable = payable(to);
		withdraw(toPayable);		

		emit Return(to, msg.sender, tokenId, returnAmount);
	}

    function balanceOf(address owner, uint256 eventId) external virtual view returns (uint256) {
		return balance[eventId][owner];
	}

    //this one will need more logic
	function ownerOf(uint256 tokenId, uint256 eventId) external virtual view returns (address) {
		return owner[tokenId];
	}

    function cancelTicket(address to, uint256 eventId, uint256 tokenId) payable onlyTicketMaster public {
		require(to == owner[tokenId], "You are not the ticket holder");
		require(msg.value == returnAmount, 'Input Price does not match return value');
		
		owner[tokenId] = ticketMaster;
		balance[to]--;
		balance[msg.sender]++;

		(bool success, ) = to.call{value: msg.value}("");
		require(success, "Transfer failed");

		emit Return(to, msg.sender, tokenId, msg.value);
	}

    function adminDeposit() onlyTicketMaster external payable {
		require(msg.value > 0, "Amount must be greater than 0");
	}

	function adminWithdraw(uint256 amount) onlyTicketMaster external {
		require(address(this).balance >= amount);
		(bool success, ) = msg.sender.call{value: amount}("");
		require(success, "Admin Withdraw failed");
	}

	function getContractBalance() external view onlyTicketMaster returns (uint256) {
        return address(this).balance;
    }
}
