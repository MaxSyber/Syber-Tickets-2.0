import { useSelector, useDispatch } from 'react-redux'
import { loadAccount } from '../store/interactions'
import { useState } from 'react'
import CreateEvent from './CreateEvent'
import Information from './Information'
import Logo from '../assets/logo.png'

const Navbar = () => {
    //const provider = useSelector(state => state.provider.connection)
    //const chainId = useSelector(state => state.provider.chainId)
    const account = useSelector(state => state.provider.account)
    const dispatch = useDispatch()
	const [isOpen, setIsOpen] = useState(false)
	const [infoOpen, setInfoOpen] = useState(false)

    const connectHandler = async () => {
		await loadAccount(dispatch)
	} 

	const infoHandler = async (e) => {
		e.preventDefault()
    	setInfoOpen(true)
	} 

	const createHandler = (e) => {
		e.preventDefault()
		setIsOpen(true)
	}

    return(
        <div>
			<div className='navbar'>
			<img src= {Logo} className='logo' alt='Logo'/>
			<div className='title'>
				<span>SYBER TICKETS</span>
			</div>
		 		<div>
		 			{account ? (
		 				<button className='account'>
		 					{account.slice(0,5) +'...' + account.slice(38,42)}
		 				</button>
		 			) : (
		 				<button className='connect' onClick={connectHandler}>Connect</button>
		 			)}
		 		</div>	 		
			</div>
			<ul className='navTopics'>
				<li className='topic'><a href='#about' className='topicLink'>About</a></li>
				<li className='topic'><a href='#events' className='topicLink'>Browse Events</a></li>
				<li className='topic'><a href='!#' className='topicLink' onClick ={createHandler}>Create Event</a></li>
				<li className='topic'><a href ='!#' className='topicLink' onClick={infoHandler}>F.A.Q</a></li>	
			</ul>
			{isOpen && (
                <CreateEvent close={() => setIsOpen(false)} />
            )}
			{infoOpen && (
				<Information close = {() => setInfoOpen(false)} />
			)}
		</div>
    )
}

export default Navbar;