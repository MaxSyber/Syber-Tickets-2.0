import { useSelector, useDispatch } from "react-redux";
import { loadEvents, loadEventData, buyTicket, returnTicket } from "../store/interactions";
import { useEffect } from "react";
import { ethers } from "ethers";
import { syberTickets } from "../store/reducers/syberTickets";

const Events = () => {
    
    const provider = useSelector(state => state.provider.connection)
    const tickets = useSelector(state=> state.syberTickets.contract)
    const events = useSelector(state => state.syberTickets.events)
    const ticketsRemaining = useSelector (state => state.syberTickets.ticketsRemaining)
    const balanceOf = useSelector (state => state.syberTickets.userBalances)
    const account = useSelector(state => state.provider.account)
    const buyingSuccess = useSelector(state => state.syberTickets.buying.isSuccess)
    const returningSuccess = useSelector(state => state.syberTickets.returning.isSuccess)
    

    const dispatch = useDispatch()

    const buyToggle = async (eventId) => {
        let className = ''
    }

    const returnToggle = async (eventId) => {
        let className = ''
    }
    const buyHandler = async (eventId) =>  {
        const event = events.find(e => e.eventId === eventId)
        await buyTicket(provider, tickets, eventId, event.buyAmount, dispatch)
    }

    const returnHandler = async (eventId) => {
        await returnTicket(provider, tickets, eventId, dispatch)
    }

    useEffect(() => {
        if(provider && tickets) {loadEvents(provider, tickets, dispatch)} 
    }, [provider, tickets, dispatch])


    useEffect(() => {
        if (provider && tickets && events.length > 0 && account){
            loadEventData(provider, tickets, events, dispatch)
        }
    }, [provider, tickets, events, account, buyingSuccess, returningSuccess, dispatch])

    return(
        <div style={{ paddingTop: "100px", color: "white" }}className=''>
            {events.map(event => (
                <div key={event.eventId} style={{marginBottom: '20px'}}>
                    <h3>{event.name}</h3>
                    <p>Price : {ethers.utils.formatEther(event.buyAmount)}</p>
                    <p>Date: {new Date(event.date * 1000).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    })} </p>

                    <button className="buy" onClick={() => buyHandler(event.eventId)}>
                        Buy
                    </button>
                    <button className="return" onClick={() => returnHandler(event.eventId)}>Return</button>
                    {ticketsRemaining[event.eventId] === 0 ? (
                        <p>Sold Out</p>
                        ) : (
                        <p>Tickets Remaining: {ticketsRemaining[event.eventId]}</p>
                        )}
                    <p> Your Owned Tickets: {balanceOf[event.eventId]}</p>
                </div>
            ))} 		
        </div>
    )
}

export default Events;
