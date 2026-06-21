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
        <div id='events' className='events_list'>
            {events.map(event => (
                <div className='card' key={event.eventId}>
                    <div className='cart_left'>
                        <h3 className='event_name'>{event.name}</h3>
                        <p className='event_meta'>Date: {new Date(event.date * 1000).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        })} </p>
                        <p className='event_meta'>Price : {ethers.utils.formatEther(event.buyAmount)}</p>
                        <p className='event_meta'>Event Creator:  {(event.creator.slice(0,5) +'...' + event.creator.slice(38,42))}</p>  
                        {ticketsRemaining[event.eventId] === 0 ? (
                            <p className='sold'>Sold Out</p>
                            ) : (
                            <p className='event_meta'>Tickets Remaining: {ticketsRemaining[event.eventId]}</p>
                        )}
                    </div>
                    <div className='card_right'>
                        <button className="buy" onClick={() => buyHandler(event.eventId)}>
                            Buy
                        </button>
                        <button
                            className={`return ${balanceOf[event.eventId] === 0 ? "disabled" : ""}`}
                            onClick={() => returnHandler(event.eventId)}
                            disabled={balanceOf[event.eventId] === 0}
                        >
                            Return
                        </button>
                        
                        <p className='event_meta'> Your Owned Tickets: {balanceOf[event.eventId]}</p>
                    </div>
                </div>
            ))} 		
        </div>
    )
}

export default Events;
