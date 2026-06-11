//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract syberTickets {
    address public ticketMaster;
    uint256 public totalEvents;

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

	mapping(uint256 => Event) public eventData;

	// Tracks total owned ticket per specific event
	mapping(uint256 => mapping(address => uint256)) public balance;

	// Tracks who owns a specific ticket to specific event
	mapping(uint256 => mapping(uint256 => address)) public owner;

	// A check to see if a specific ticket for an event exists
	mapping(uint256 => mapping(uint256 => bool)) public exists;

	// Total minted tickets: eventId > total minted tickets
	mapping(uint256 => uint256) public totalSupply;
   
    event Transfer(
		address indexed from,
		address indexed to,
		uint256 indexed tokenId
	);

    event Sell(
		address indexed to,
		address indexed from,
		uint256 indexed eventId,
		uint256 tokenId,
		uint256 amount
	);

	event Return(
		address indexed to,
		address indexed from,
		uint256 indexed eventId,
		uint256 tokenId,
		uint256 amount
	);

	event AdminDeposit(
		address indexed from, 
		uint256 amount
	);

	event AdminWithdraw(
		address indexed to, 
		uint256 amount
	);

    function createEvent(string memory _name, uint256 _date, uint256 _buyAmount, uint256 _returnAmount, uint256 _maxSupply) public {
		require(_maxSupply > 10 && _maxSupply <= 5000, "Max supply must be within range 10-5000");
		require(_buyAmount >= _returnAmount, "Return Amount must be less than or equal to buy Amount");
		uint256 eventId = totalEvents;
		eventData[eventId] = Event ({
			id: eventId,
			name: _name,
			date: _date,
			buyAmount: _buyAmount,
			returnAmount: _returnAmount,
			maxSupply: _maxSupply,
			creator: msg.sender
		});
        mintAllTokens(ticketMaster, eventId);
        totalEvents++;
    }

    function _mint(address to, uint256 eventId, uint256 tokenId) internal virtual {
		require(to != address(0), "ERC: mint to the zero address");
		require(!exists[eventId][tokenId], "Token already exists");
		
		balance[eventId][to]++;
		owner[eventId][tokenId] = to;
		exists[eventId][tokenId] = true;

		emit Transfer(address(0), to, tokenId);
	}

    function mintAllTokens(address to, uint256 eventId) internal {
		require(eventData[eventId].maxSupply > 0, "Event does not exist");
		uint256 max = eventData[eventId].maxSupply;
		for(uint256 i = 0; i < max; i++) {
			_mint(to , eventId, i);
		}

		totalSupply[eventId] = max;
	}

    function buyTicket(uint256 eventId, uint256 tokenId) payable public {
		require(eventData[eventId].creator != address(0), "Event does not exist");

		address seller = ticketMaster;
		address buyer = msg.sender;

		require(exists[eventId][tokenId], "Token does not exist");
		require(balance[eventId][buyer] < 2, "Each address can only own a maximum of two tickets");
		require(owner[eventId][tokenId] == ticketMaster, "This ticket is already sold");
		require(msg.value == eventData[eventId].buyAmount, 'Input Price does not match ticket price');
		
		owner[eventId][tokenId] = buyer;
		balance[eventId][ticketMaster]--;
		balance[eventId][buyer]++;

		emit Sell(buyer, seller, eventId, tokenId, msg.value);
	}

	function returnTicket(uint256 eventId, uint256 tokenId) public {
		require(eventData[eventId].creator != address(0), "Event does not exist");
		require(msg.sender == owner[eventId][tokenId], "You are not the ticket holder");
		
		owner[eventId][tokenId] = ticketMaster;
		balance[eventId][msg.sender]--;
		balance[eventId][ticketMaster]++;

		uint256 refund = eventData[eventId].returnAmount;

		(bool success, ) = msg.sender.call{value: refund}("");
		require(success, "Refund failed");		

		emit Return(msg.sender, msg.sender, eventId, tokenId, refund);
	}

    function balanceOf(address user, uint256 eventId) external virtual view returns (uint256) {
		return balance[eventId][user];
	}

	function ownerOf(uint256 tokenId, uint256 eventId) external virtual view returns (address) {
		require(exists[eventId][tokenId], "Token does not exist");
		return owner[eventId][tokenId];
	}

    function cancelTicket(address to, uint256 eventId, uint256 tokenId) onlyTicketMaster public {
		require(eventData[eventId].creator != address(0), "Event does not exist");
		require(exists[eventId][tokenId], "Token does not exist");
		require(to == owner[eventId][tokenId], "That is not the ticket holder");
		
		uint256 refund = eventData[eventId].returnAmount;
		
		owner[eventId][tokenId] = ticketMaster;
		balance[eventId][to]--;
		balance[eventId][ticketMaster]++;

		(bool success, ) = to.call{value: refund}("");
		require(success, "Transfer failed");

		emit Return(to, ticketMaster, eventId, tokenId, refund);
	}

    function adminDeposit() onlyTicketMaster external payable {
		require(msg.value > 0, "Amount must be greater than 0");

		emit AdminDeposit(msg.sender, msg.value);
	}

	function adminWithdraw(uint256 amount) onlyTicketMaster external {
		require(address(this).balance >= amount, "Insufficient balance");
		(bool success, ) = msg.sender.call{value: amount}("");
		require(success, "Admin Withdraw failed");

		emit AdminWithdraw(msg.sender, amount);
	}

	function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
