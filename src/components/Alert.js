const Alert = ({ message, transactionHash, variant, onClose }) => {
  return (
    <div className={`alert alert-${variant}`}>
      <span>{message}</span>
      {transactionHash && (
        <p>
          {transactionHash.slice(0, 6) + '...' + transactionHash.slice(60, 66)}
        </p>
      )}
      <button className="alert-close" onClick={onClose}>×</button>
    </div>
  )
}

export default Alert
