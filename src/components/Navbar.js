import { useSelector, useDispatch } from 'react-redux'
import { loadAccount } from '../store/interactions'
import Logo from '../assets/logo.png'

const Navbar = () => {
    const provider = useSelector(state => state.provider.connection)
    const chainId = useSelector(state => state.provider.chainId)
    const account = useSelector(state => state.provider.account)
    const dispatch = useDispatch()

    const connectHandler = async () => {
		await loadAccount(dispatch)
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
				<li className='topic'><a href='' className='topicLink'>About</a></li>
				<li className='topic'><a href='' className='topicLink'>Browse Events</a></li>
				<li className='topic'><a href='' className='topicLink'>Create Event</a></li>
				<li className='topic'><a href ='' className='topicLink'>F.A.Q</a></li>
			</ul>
		</div>
    )
}

export default Navbar;