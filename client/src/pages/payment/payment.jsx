import React, { useState } from 'react';

function PaymentPage() {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handleCardNumberChange = (event) => {
    setCardNumber(event.target.value);
  };

  const handleExpiryDateChange = (event) => {
    setExpiryDate(event.target.value);
  };

  const handleCvvChange = (event) => {
    setCvv(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform payment processing logic here
  };

  return (
    <div>
      <h1>Payment Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Card Number:</label>
          <input
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
          />
        </div>
        <div>
          <label>Expiry Date:</label>
          <input
            type="text"
            value={expiryDate}
            onChange={handleExpiryDateChange}
          />
        </div>
        <div>
          <label>CVV:</label>
          <input type="text" value={cvv} onChange={handleCvvChange} />
        </div>
        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
}

export default PaymentPage;