import { ethers } from "ethers";
import { setProvider, setNetwork, setAccount } from "./reducers/provider";
import { setContract, eventsLoaded, ticketsRemainingLoaded, userBalancesLoaded, buyRequest, buySuccess, buyFail, returnRequest, 
  returnSuccess, returnFail, cancelRequest, cancelSuccess, cancleFail, eventRequest, eventSuccess, eventFail } from "./reducers/syberTickets";

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
   const tickets = await new ethers.Contract(config[chainId].syberTickets.address, SYBERTICKETS_ABI, provider)

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

    const ticketMaster = await tickets.ticketMaster()
    for (let event of events) {
        const eventId = event.eventId
        const ticketsRemaining = await tickets.balanceOf(ticketMaster, eventId)

        dispatch(ticketsRemainingLoaded({
            eventId,
            value: Number(ticketsRemaining)
        }))
    }
}

export const loadEventData = async (provider, tickets, events, dispatch) => {
    const signer = await provider.getSigner()
    const user = await signer.getAddress()
    const ticketMaster = await tickets.ticketMaster()

    for (let event of events) {
        const eventId = event.eventId
        const userBalance = await tickets.balanceOf(user , eventId)

        dispatch(userBalancesLoaded({
            eventId,
            value: Number(userBalance)
        }))

        const ticketsRemaining = await tickets.balanceOf(ticketMaster, eventId)

        dispatch(ticketsRemainingLoaded({
            eventId,
            value: Number(ticketsRemaining)
        }))
    }
}

export const buyTicket = async (provider, tickets, eventId, buyAmount, dispatch) => {
    try {
        dispatch(buyRequest())

        const signer = await provider.getSigner()
        const availableTokens = await tickets.getAvailableTokens(eventId)
        const randomIndex = Math.floor(Math.random() * availableTokens.length)
        const tokenId = availableTokens[randomIndex]
        let transaction = await tickets.connect(signer).buyTicket(eventId, tokenId, {value: buyAmount})
        await transaction.wait()

        dispatch(buySuccess(transaction.hash))
    } catch (error) {
        dispatch(buyFail())
    }
}

export const returnTicket = async (provider, tickets, eventId, dispatch) => {
    try {
        dispatch(returnRequest())

        const signer = await provider.getSigner()
        const user = await signer.getAddress()
        const ownedTokens = await tickets.getOwnedTokens(eventId, user)
        const tokenId = ownedTokens[0]
        let transaction = await tickets.connect(signer).returnTicket(eventId, tokenId)
        await transaction.wait()

        dispatch(returnSuccess(transaction.hash))
    } catch (error) {
        dispatch(returnFail())
    }
}

export const newEvent = async (provider, tickets, name, date, buyAmount, returnAmount, maxSupply, dispatch) => {
    try {
        dispatch(eventRequest())
        const signer = await provider.getSigner()
        let transaction = await tickets.connect(signer).createEvent(name, date, buyAmount, returnAmount, maxSupply)
        await transaction.wait()
        dispatch(eventSuccess(transaction.hash))
        return transaction
        
    } catch (error) {
        dispatch(eventFail())
    }
}

//admin cancel ticket