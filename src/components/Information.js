const Information = ({ close }) => {
  return (
    <div className="info_overlay" onClick={close}>

      <div
        className="info_modal"
        onClick={(e) => e.stopPropagation()}
      >

        <button className="info_close" onClick={close}>
          ×
        </button>

        <div className="info_item">
          <h3>What is Syber Tickets?</h3>
          <p>
            Syber Tickets is a Web3 ticketing platform that uses smart contracts
            and soulbound NFTs to create non-transferable event tickets, reducing
            scalping and ensuring fair access to events.
          </p>
        </div>

        <div className="info_item">
          <h3>How do I create an event?</h3>
          <p>
            Event creators define a name, date, ticket price, return price, and max supply.
            Once created, all tickets are minted and managed by the smart contract.
          </p>
        </div>

        <div className="info_item">
          <h3>How many tickets can I buy?</h3>
          <p>
            Each wallet can own a maximum of 2 tickets per event.
          </p>
        </div>

        <div className="info_item">
          <h3>Can I resell my ticket?</h3>
          <p>
            No. Tickets are non-transferable and can only be returned through the contract.
          </p>
        </div>

        <div className="info_item">
          <h3>How do returns work?</h3>
          <p>
            Tickets are returned to the contract and refunded at a fixed return price.
          </p>
        </div>

        <div className="info_item">
          <h3>Why can a purchase fail?</h3>
          <p>
            Failures occur if you exceed 2 tickets, send incorrect ETH, or tickets are unavailable.
          </p>
        </div>

      </div>
    </div>
  )
}

export default Information
