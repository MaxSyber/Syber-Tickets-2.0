import { useSelector, useDispatch } from "react-redux";
import { loadEvents } from "../store/interactions";
import { useEffect } from "react";
import { ethers } from "ethers";

const Events = () => {
    
    const provider = useSelector(state => state.provider.connection)
    const tickets = useSelector(state=> state.syberTickets.contract)
    const events = useSelector(state => state.syberTickets.events)
    const buyAmount = useSelector(state => state.syberTickets.events[1]?.buyAmount)
    console.log(buyAmount)

    const dispatch = useDispatch()

    const buyHandler = (evnetId) => {
        const ticketPrice = 
        console.log('Buy Clicked')
}

    const returnHandler = (eventId, tokenId) => {
        console.log('Return Clicked')
}

    useEffect(() => {
    if(provider && tickets) {loadEvents(provider, tickets, dispatch)} 
  }, [provider, tickets, dispatch])

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

                    <button className="infoButton" onClick={() => buyHandler(event.eventId)}>Buy</button>
                    <button className="infoButton" onClick={() => returnHandler(event.eventId)}>Return</button>
                </div>
            ))} 		
        </div>
    )
}

export default Events;
