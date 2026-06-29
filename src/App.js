import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Navbar from './components/Navbar';
import Intro from './components/Intro'
import Events from './components/Events'
import Footer from './components/Footer';
import {loadProvider, loadNetwork, loadAccount, loadTickets} from './store/interactions'

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

    await loadTickets(provider, chainId, dispatch)
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  return (
    <div className="App">
      <Navbar />

      <Intro />

      <Events />

      <Footer />
      
    </div>
  );
}

export default App;