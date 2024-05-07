import Navbar from '../../components/navbar/Navbar';
import MailList from '../../components/mailList/MailList';
import Footer from '../../components/footer/Footer';
import { useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

import React, { useState } from 'react';
import "./payment.css";
const Settings = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const { user } = useContext(AuthContext);
  const userId =user._id;
  const [image, setImage] = useState();
    
  useEffect(() => {


    const getUserImage = async () => {
        try {
          const response = await fetch(`http://localhost:8800/api/users/${userId}`);
          if (response.ok) {
            const user = await response.json();
            if (user.img!==""){

                setImage(user.img);
            }else{
                setImage(null);
            }
            
          } else {
            throw new Error("Failed to fetch user image");
          }
        } catch (error) {
          console.error("Error fetching user image:", error);
        }
      };
      getUserImage();
    }, [userId]);
    

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    // Handle payment submission logic here
    console.log('Payment submitted!');
  };

  return (
    <div>
     <Navbar image={image}/>
    <div className="page-style">
    <div className="payment-container">
      <h2> Pay Here ! </h2>
      <h3 className="pay-here"> Enter Your payment details </h3>
      <form onSubmit={handlePaymentSubmit}>
        <div className="form-group">
          <label htmlFor="cardNumber">CardNumber</label>
          <input
            type="text"
            id="cardNumber"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="Enter card number"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="expiryDate">ExpiryDate</label>
          <input
            type="text"
            id="expiryDate"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            placeholder="MM/YY"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cvv">CVV</label>
          <input
            type="text"
            id="cvv"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            placeholder="Enter CVV"
            required
          />
        </div>
        <button type="submit"> Submit </button>
      </form>
    
    </div>
    
    </div>
   
    
    <div className="End_Page">
        <MailList />
        <Footer />
        </div>
  
    </div>
  );
};

export default Settings;



 
          
