//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract syberTickets {

    address public ticketMaster;

    constructor(
        ) {
            ticketMaster = msg.sender;
        }

    modifier onlyTicketMaster {
		require(msg.sender == ticketMaster, "Only the Ticket Master can call this function");
		_;
	}


    //events to track major functionalities
    //core functionalities

    //1. Mint  - mints ticket nfts

    //2.  MintAll - run at createion of event to print all tickets as assign owner as the ticketmaster address

    //3. Create Event - creates a new ticketed event which runs the mintAll with given parameters.  This will likly be some kind of 
    // struct for outlining particulars about different events  eventId and TokenId(within event)

    //3. balanceOf - returns total owner tickets #

    //4. ownerOf - returns the owner of a specific ticket

    // create a tokenURI and setTokenURI - needed for token data

    //5. Buy ticket to, eventId, tokenId

    //6. returnTicket to, eventId, tokenId

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