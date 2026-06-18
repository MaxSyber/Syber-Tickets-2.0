import { useSelector, useDispatch } from 'react-redux'

const browseHandler = () => {
    console.log('Browse Clicked')
}

const createHandler = () => {
    console.log('Create Event Clicked')
}
// Put this into componet to log state
//const state = useSelector(state => state)
//console.log("ACTUAL STATE:", state)
const Intro = () => {
    return(
        <div style={{ paddingTop: "100px", color: "white" }}className=''>
            <div>Syber Tickets is a web 3.0 ticketing application that's reshaping the very essence of event ticketing. 
				Powered by the smart contracts on the Polygon Network, Syber Tickets uses the concept of soulbound NFTs to issue non-transferable event tickets.
            </div>
            <div>
                <button className="infoButton" onClick ={browseHandler}>Browse Events</button>
                <button className="infoButton" onClick ={createHandler}>Create Event</button>
            </div>	 		
        </div>
    )
}

export default Intro;