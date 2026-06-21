const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer_content">
        
        <div className="footer_left">
          <h3>SYBER TICKETS</h3>
          <p>Decentralized event ticketing powered by blockchain.</p>
        </div>

        <div className="footer_middle">
          <a href="#events">Browse Events</a>
          <a href="#">Create Event</a>
          <a href="#">FAQ</a>
        </div>

        <div className="footer_right">
          <p>© {new Date().getFullYear()} Syber Tickets</p>
          <p>All rights reserved</p>
        </div>

      </div>
    </footer>
  )
}

export default Footer