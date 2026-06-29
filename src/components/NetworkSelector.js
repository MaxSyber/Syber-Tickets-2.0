import { NETWORKS } from "./Networks"
import { switchNetwork } from '../store/interactions'

const NetworkSelector = () => {

  const handleChange = async (e) => {
    const selected = e.target.value
    const network = NETWORKS[selected]

    await switchNetwork(network)
  }

  return (
    <select onChange={handleChange} defaultValue="baseSepolia">
      <option value="baseSepolia">🌐 Base Sepolia</option>
      <option value="localhost">🛠 Localhost</option>
    </select>
  )
}

export default NetworkSelector