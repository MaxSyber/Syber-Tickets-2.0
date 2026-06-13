import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import Navbar from './components/Navbar';

import {loadProvider, loadNetwork, loadAccount} from './store/interactions'

function App() {
  const dispatch = useDispatch()

  const loadBlockchainData = async () => {
    // Initiate provider
    const provider = await loadProvider(dispatch)

    // Fetch current network's chainId
    const chainId = await loadNetwork(provider, dispatch)

    // Reload page when network changes
    window.ethereum.on('chainChanged', () => {
      window.location.reload()
    })

    window.ethereum.on('accountsChanged', async () => {await loadAccount(dispatch)})
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  return (
    <div className="App">
      <Navbar />

      
    </div>
  );
}

export default App;
