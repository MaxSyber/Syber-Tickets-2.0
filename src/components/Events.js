import { useSelector, useDispatch } from "react-redux";
import { loadEvents, loadEventData, buyTicket, returnTicket } from "../store/interactions";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Alert from "./Alert";

const Events = () => {
    
    const provider = useSelector(state => state.provider.connection)
    const tickets = useSelector(state=> state.syberTickets.contract)
    const events = useSelector(state => state.syberTickets.events)
    const ticketsRemaining = useSelector (state => state.syberTickets.ticketsRemaining)
    const balanceOf = useSelector (state => state.syberTickets.userBalances)
    const account = useSelector(state => state.provider.account)
    const buyingSuccess = useSelector(state => state.syberTickets.buying.isSuccess)
    const returningSuccess = useSelector(state => state.syberTickets.returning.isSuccess)
    const buyLoading = useSelector(state => state.syberTickets.buying.isBuying)
    const returnLoading = useSelector(state => state.syberTickets.returning.isReturning)
    const buyTransactionHash = useSelector(state => state.syberTickets.buying.transactionHash)
    const returnTransactionHash = useSelector(state => state.syberTickets.returning.transactionHash)
    const eventCreated = useSelector(state => state.syberTickets.creating.isSuccess)

    const [showAlert, setShowAlert] = useState(false)
    const [txType, setTxType] = useState(null)
    const isLoading = buyLoading || returnLoading

    const dispatch = useDispatch()

    const buyHandler = async (eventId) =>  {
        setShowAlert(true)
        setTxType("buy")
        const event = events.find(e => e.eventId === eventId)
        await buyTicket(provider, tickets, eventId, event.buyAmount, dispatch)
    }

    const returnHandler = async (eventId) => {
        setShowAlert(true)
        setTxType("return")
        await returnTicket(provider, tickets, eventId, dispatch)
    }

    useEffect(() => {
        if(provider && tickets) {loadEvents(provider, tickets, dispatch)} 
    }, [provider, tickets, eventCreated, dispatch])

    useEffect(() => {
        if (provider && tickets && events.length > 0 && account){
            loadEventData(provider, tickets, events, dispatch)
        }
    }, [provider, tickets, events, account, buyingSuccess, returningSuccess, dispatch])

    useEffect(() => {
    if (showAlert && !buyLoading && !returnLoading) {
        const timer = setTimeout(() => setShowAlert(false), 3000)
        return () => clearTimeout(timer)
    }
}, [showAlert, buyLoading, returnLoading])

    return(
        <div id='events' className='events_list'>
            {events.map(event => (
                <div className='card' key={event.eventId}>
                    <div className='card_left'>
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
                        <button className="buy" onClick={() => buyHandler(event.eventId)} disabled={buyLoading}>
                            {buyLoading ? <span className="spinner"></span> : 'Buy'}
                        </button>
                        <button
                            className={`return ${balanceOf[event.eventId] === 0 ? "disabled" : ""}`}
                            onClick={() => returnHandler(event.eventId)}
                            disabled={balanceOf[event.eventId] === 0 || returnLoading}
                        >
                            {returnLoading ? <span className="spinner"></span> : 'Return'}
                        </button>
                        
                        <p className='event_meta'> Your Owned Tickets: {balanceOf[event.eventId]}</p>
                    </div>
                </div>
            ))} 
            {isLoading ? (
                <Alert
                    message="Transaction Pending..."
                    transactionHash={null}
                    variant="info"
                    onClose={() => setShowAlert(false)}
                />
                ) : txType === "buy" && buyingSuccess && showAlert ? (
                <Alert
                    message="Purchase Successful"
                    transactionHash={buyTransactionHash}
                    variant="success"
                    onClose={() => setShowAlert(false)}
                />
                ) : txType === "return" && returningSuccess && showAlert ? (
                <Alert
                    message="Return Successful"
                    transactionHash={returnTransactionHash}
                    variant="success"
                    onClose={() => setShowAlert(false)}
                />
                ) : txType === "buy" && showAlert && !buyingSuccess && !buyLoading ? (
                <Alert
                    message="Purchase Failed"
                    transactionHash={null}
                    variant="danger"
                    onClose={() => setShowAlert(false)}
                />
                ) : txType === "return" && showAlert && !returningSuccess && !returnLoading ? (
                <Alert
                    message="Return Failed"
                    transactionHash={null}
                    variant="danger"
                    onClose={() => setShowAlert(false)}
                />
                ) : null}
        </div>
    )
}

export default Events;