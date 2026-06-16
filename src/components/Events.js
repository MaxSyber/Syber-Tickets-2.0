import { useSelector, useDispatch } from "react-redux";
import { loadEvents } from "../store/interactions";
import { useEffect } from "react";

const Events = () => {
    
    const provider = useSelector(state => state.provider.connection)
    const tickets = useSelector(state=> state.syberTickets.contract)

    const dispatch = useDispatch()

    const buyHandler = () => {
        console.log('Buy Clicked')
}

    const returnHandler = () => {
        console.log('Return Clicked')
}

    useEffect(() => {
    if(provider && tickets) {loadEvents(provider, tickets, dispatch)} 
  }, [provider, tickets, dispatch])

    return(
        <div style={{ paddingTop: "100px", color: "white" }}className=''>
            <div>This will be the holder for events which will be mapped through reading the store (We should have a default seed event)
            </div>
            <div>
                <button className="infoButton" onClick={buyHandler}>Buy</button>
                <button className="infoButton" onClick={returnHandler}>Return</button>
            </div>	 		
        </div>
    )
}

export default Events;
