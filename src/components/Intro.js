import { useState } from 'react'
import CreateEvent from './CreateEvent';

const Intro = () => {
    const [isOpen, setIsOpen] = useState(false);
    const browseHandler = () => {
        const pan = document.getElementById("events")
        if (pan) {
        pan.scrollIntoView()
        }
    }

    const createHandler = () => {
        setIsOpen(true)
    }

    return(
        <div id='about'>
            <div className='info'>
                <h2 className='info_header'>Welcome to Syber Tickets!</h2>
                <div className='info_text'>Syber Tickets is a Web3 ticketing application that reimagines event access using smart 
                    contracts and soulbound NFTs to issue non-transferable tickets, helping reduce scalping and unauthorized resale.
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
