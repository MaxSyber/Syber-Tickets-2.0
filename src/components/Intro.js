import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import CreateEvent from './CreateEvent';

const Intro = () => {
    const [isOpen, setIsOpen] = useState(false);
    const browseHandler = () => {
        console.log('Browse Clicked')
    }

    const createHandler = () => {
        setIsOpen(true)
    }
    // Put this into componet to log state
    //const state = useSelector(state => state)
    //console.log("ACTUAL STATE:", state)

    return(
        <div>
            <div className='info'>
                <h2 className='info_header'>Welcome to Syber Tickets!</h2>
                <div className='info_text'>Syber Tickets is a web 3.0 ticketing application that's reshaping the very essence of event ticketing. 
                    Powered by the smart contracts on the Polygon Network, Syber Tickets uses the concept of soulbound NFTs to issue non-transferable event tickets.
                </div>
                <div className='info_butts'>
                    <button className="infoButton" onClick ={browseHandler}>Browse Events</button>
                    <button className="infoButton" onClick ={createHandler}>Create Event</button>
                </div>	 		
            </div>
            {isOpen && (
                <CreateEvent close={() => setIsOpen(false)} />
            )}
        </div>
    )
}

export default Intro;