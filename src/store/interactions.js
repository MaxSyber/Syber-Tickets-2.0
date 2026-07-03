import { ethers } from "ethers";
import { setProvider, setNetwork, setAccount } from "./reducers/provider";
import { setContract, eventsLoaded, ticketsRemainingLoaded, userBalancesLoaded, buyRequest, buySuccess, buyFail, returnRequest, 
  returnSuccess, returnFail, eventRequest, eventSuccess, eventFail } from "./reducers/syberTickets";

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
    const totalEvents = await tickets.totalEvents()
    const ticketMaster = await tickets.ticketMaster()
    const events = []

    for (let i = 0; i < totalEvents.toNumber(); i++) {
        const eventData = await tickets.eventData(i)
        const event = {
            hash: null,
            eventId: eventData.id.toNumber(),
            name: eventData.name,
            date: eventData.date.toNumber(),
            buyAmount: eventData.buyAmount.toString(),
            returnAmount: eventData.returnAmount.toString(),
            maxSupply: eventData.maxSupply.toNumber(),
            creator: eventData.creator
        }

        events.push(event)

        const eventId = event.eventId
        const ticketsRemaining = await tickets.balanceOf(ticketMaster, eventId)

        dispatch(ticketsRemainingLoaded({
            eventId,
            value: Number(ticketsRemaining)
        }))
    }

    dispatch(eventsLoaded(events))
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
