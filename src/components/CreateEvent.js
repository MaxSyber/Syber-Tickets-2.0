import { newEvent } from "../store/interactions";
import { useState } from "react";
import { ethers } from "ethers";
import { useSelector } from "react-redux";


const CreateEvent = ({close}) => {
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [price, setPrice] = useState("");
    const [returnPrice, setReturnPrice] = useState("");
    const [maxSupply, setMaxSupply] = useState("");

    const provider = useSelector(state => state.provider.connection)
    const account = useSelector((state) => state.provider.account)
    const tickets = useSelector(state=> state.syberTickets.contract)

    const handleCreateEvent = async (e) => {
    e.preventDefault();

    try {
        if (Number(returnPrice) > Number(price)) {
        alert("Return price must be <= ticket price");
        return;
        }

        if (Number(maxSupply) <= 9.9 || Number(maxSupply) > 225) {
        alert("Max supply must be between 10 and 5000");
        return;
        }

        const eventDate = Math.floor(new Date(date).getTime() / 1000);
        const buyAmount = ethers.utils.parseUnits(price, "ether");
        const returnAmount = ethers.utils.parseUnits(returnPrice, "ether");

        await newEvent(provider, tickets, name, eventDate, buyAmount, returnAmount, maxSupply);

        close();

    } catch (err) {
        console.error("Create event failed:", err);
    }
    }

  return (
    <div className="overlay" onClick={close}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mod_title">Create New Event</h2>
        <p className="mod_hint">*Ticket price must be greater than return price</p>
        <p className="mod_hint">*Max Supply must be within 10-225</p>

        <form onSubmit={handleCreateEvent}>
          <input
            className="form_input"
            type="text"
            placeholder="Event Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input 
            className="form_input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <input
            className="form_input"
            type="number"
            placeholder="Ticket Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <input
            className="form_input"
            type="number"
            placeholder="Return Price"
            value={returnPrice}
            onChange={(e) => setReturnPrice(e.target.value)}
            required
          />

          <input
            className="form_input"
            type="number"
            placeholder="Max Supply"
            value={maxSupply}
            onChange={(e) => setMaxSupply(e.target.value)}
            required
          />

            <button className = 'create_button' type="submit" disabled={!account}>
                {account ? 'Create Event' : 'Connect Metamask Wallet to Submit'}
            </button>
        </form>

        <button className = 'close_button' onClick={close}>Close</button>
      </div>
    </div>
  );
}

export default CreateEvent