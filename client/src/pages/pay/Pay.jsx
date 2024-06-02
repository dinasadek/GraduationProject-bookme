import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
// Assuming Navbar and other necessary components are imported correctly
import Navbar from "../../components/navbar/Navbar";
import "./pay.css";

const Pay = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const { loading, error, dispatch } = useContext(AuthContext); // Must be inside the component
  const navigate = useNavigate();

  const handlePaymentSubmit = async (e) => { // Marked as async
    e.preventDefault();
    const credentials = { cardNumber, expiryDate, cvv }; // Defined credentials based on state
    dispatch({ type: "PAYMENT_START" });
    try {
        const res = await axios.post("/auth/payment", credentials);
        
        dispatch({ type: "PAYMENT_SUCCESS", payload: res.data.details });
        navigate("/");
    } catch (err) {
        dispatch({ type: "PAYMENT_FAILURE", payload: err.response.data });
    }
};

  

  return (
    <div>
      <Navbar />
      <div className="page-style">
        <div className="payment-container">
          <h2> Pay Here ! </h2>
          <h3 className="pay-here"> Enter Your payment details </h3>
          <form onSubmit={handlePaymentSubmit}>
            <div className="form-group">
              <label className="plabel" htmlFor="cardNumber">Card Number</label>
              <input className="pinput"
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="Enter card number"
                required
              />
            </div>
            <div className="form-group">
              <label className="plabel" htmlFor="expiryDate">Expiry Date</label>
              <input className="pinput"
                type="text"
                id="expiryDate"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
                required
              />
            </div>
            <div className="form-group">
              <label className="plabel" htmlFor="cvv">CVV</label>
              <input className="pinput"
                type="text"
                id="cvv"
                value={cvv}
                
            onChange={(e) => setCvv(e.target.value)}
            placeholder="Enter CVV"
            required
          />
        </div>
        <button className="pbutton" type="submit"> Submit </button>
      </form>
    
    </div>
     
    <button disabled={loading} onClick={handlePaymentSubmit} className="pbutton">
                    Payment
                </button><br/><br/>
      
     {error && <span>{error.message}</span>}
    </div>
   
    
    
  
  
    </div>
  );
  };

export default Pay;