import { ethers } from "ethers";
import { setProvider, setNetwork, setAccount } from "./reducers/provider";
import { setContract, eventsLoaded } from "./reducers/syberTickets";

import SYBERTICKETS_ABI from '../abis/SYBERTICKETS_ABI.json'

import config from '../config.json'

export const loadProvider = (dispatch) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    dispatch(setProvider(provider))

    return provider
}

export const loadNetwork = async (provider, dispatch) => {
    const { chainId } = await provider.getNetwork()
    dispatch(setNetwork(chainId))

    return chainId
}

export const loadAccount = async (dispatch) => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'})
    const account = ethers.utils.getAddress(accounts[0])
    dispatch(setAccount(account))

    return account
}

export const loadTickets = async (provider, chainId, dispatch) => {
   const tickets = new ethers.Contract(config[chainId].syberTickets.address, SYBERTICKETS_ABI, provider)

   dispatch(setContract(tickets))
}

export const loadEvents = async (provider, tickets, dispatch) => {

    const block = await provider.getBlockNumber()
    const eventStream = await tickets.queryFilter('EventCreated', 0, block)
    const events = eventStream.map(event => {
      return {hash: event.transactionHash, 
        eventId: event.args.eventId.toNumber(),
        name: event.args.name,
        date: event.args.date.toNumber(),

        // keep financial values safe as strings
        buyAmount: event.args.buyAmount.toString(),
        returnAmount: event.args.returnAmount.toString(),

        maxSupply: event.args.maxSupply.toNumber(),

        creator: event.args.creator
      }
    })

    dispatch(eventsLoaded(events))
}

//load balances

//load events

//buyticket

//sellticket