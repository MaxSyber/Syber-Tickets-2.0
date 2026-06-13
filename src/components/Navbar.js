import { useSelector, useDispatch } from 'react-redux'
import { loadAccount } from '../store/interactions'

const Navbar = () => {
    const provider = useSelector(state => state.provider.connection)
    const chainId = useSelector(state => state.provider.chainId)
    const account = useSelector(state => state.provider.account)
    const dispatch = useDispatch()

    const connectHandler = async () => {
		await loadAccount(dispatch)
	} 

    return(
        <div className=''>
			<div className=''>
				{/*} <img src= {Logo} className='' alt='Logo'/> */}
				<span>SYBER TICKETS</span>
			</div>
		 		<div>
		 			{account ? (
		 				<button className=''>
		 					{account.slice(0,5) +'...' + account.slice(38,42)}
		 				</button>
		 			) : (
		 				<button className='' onClick={connectHandler}>Connect</button>
		 			)}
		 		</div>	 		
		</div>
    )
}

export default Navbar;