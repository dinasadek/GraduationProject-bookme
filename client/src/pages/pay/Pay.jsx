import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./pay.css";

const Pay = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    paymentMethod: 'fawry',
    mobileNumber: '',
    amount: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  

  const handleSubmit = (e) => {
    e.preventDefault();
    
    
    const { paymentMethod, mobileNumber } = formData;
    
    if ((paymentMethod === 'fawry' || paymentMethod === 'vodafone_cash') && 
        mobileNumber.length === 11 ) {
      alert('Payment completed successfully');

      // Clear the form fields after successful payment message
      setFormData({
        paymentMethod: 'fawry',
        mobileNumber: '',
        amount: ''
      });

      navigate('/');

    } else {
      alert('Failed to submit payment. Please check your input and try again.');
    }
  };

  return (
    <div className="pay-here">
      <h1 className="pay-here__title">Pay Here</h1>
      <form className="pay-here__form" onSubmit={handleSubmit}>
        <div className="pay-here__form-group">
          <label className="pay-here__label" htmlFor="paymentMethod">
            Payment Method:
          </label>
          <select
            className="pay-here__input"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleInputChange}
          >
            <option value="fawry">Fawry</option>
            <option value="vodafone_cash">Vodafone Cash</option>
          </select>
        </div>
        <div className="pay-here__form-group">
          <label className="pay-here__label" htmlFor="mobileNumber">
            Mobile Number:
          </label>
          <input
            className="pay-here__input"
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
          />
        </div>
        <button className="pay-here__submit-btn" type="submit">
          Submit Payment
        </button>
      </form>
    </div>
  );
};

export default Pay;
