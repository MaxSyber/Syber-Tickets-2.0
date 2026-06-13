import logo from './logo.svg';
import './App.css';

import Navbar from './componets/Navbar';

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

    // Fetch current account from Metamask when changed
    window.ethereum.on('accountsChanged', async () => {await loadAccount(dispatch)})

  return (
    <div className="App">
      <Navbar />
    </div>
  );
}

export default App;
