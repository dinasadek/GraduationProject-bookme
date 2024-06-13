// NewReview.jsx
import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import './newReview.css';
//import { SearchContext } from "../../context/SearchContext";
import { useContext } from "react";
//import { v4 as uuidv4 } from 'uuid';
//import { AuthProvider } from './AuthContext';
import { useEffect } from 'react';
//import Footer from "../../components/footer/Footer";
//import MailList from "../../components/mailList/MailList";
import Navbar from "../../components/navbar/Navbar";



const NewReview = () => {

  /*const generateCustomUUID = () => {
    const uuid = uuidv4();
    // Remove hyphens and return the first 22 characters
    if (!user.reviews.some(review => review.id === uuid.replace(/-/g, '').substring(0, 22))) {
      // If the ID is not found in any of the reviews, return the ID
      return uuid.replace(/-/g, '').substring(0, 22);
    }
  };*/
  //const {hotel} = useContext(AuthContext);
  const { user  } = useContext(AuthContext);
  

  const [hotelNames, setHotelNames] = useState([]);
  
  useEffect(() => {
    const fetchHotelNames = async () => {
      try {
        const response = await fetch('http://localhost:8800/api/hotels/name'); // Assuming your API endpoint to get hotel names is /api/hotels
        if (!response.ok) {
          throw new Error('Failed to fetch hotel names');
        }
        const data = await response.json();
        setHotelNames(data.map(hotel => hotel.name));
      } catch (error) {
        console.error('Error fetching hotel names:', error.message);
      }
    };

    fetchHotelNames();
  }, []);
    


  

  const currentDate = new Date().toISOString().slice(0, 10);
  const [review, setReview] = useState({
    //reviewId: generateCustomUUID(),
    userId:user._id,
    date:currentDate,
    hotelName: '',
    rating: 0,
    comment: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview(prevReview => ({
      ...prevReview,
      [name]: value
    }));
  };
  const navigate = useNavigate();
  const updateUserReviews = async (review) => {
    try {
      //dispatch({ type: 'UPDATE_USER_REVIEWS', payload: user.reviews });
     

      // Alternatively, you can send a request to your backend API to update the user's reviews in the database
      // Example using fetch API
      const id = user._id;
      //const userid = user._id;
      const url = `http://localhost:8800/api/users/${id}/reviews` ;
      const basicAuth = 'Basic ' + btoa('lamya : 12345');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': basicAuth,
          'User-Agent' :'insomnia/8.6.1'
        },
        body: JSON.stringify( {userid:user._id , reviewContent: review } )
        
      });

      if (!response.ok) {
        throw new Error('Failed to update user reviews');
      }

      const data = await response.json();
      console.log(data); // Log the response from the API
      
      
    
    } catch (error) {
      console.error('Error updating user reviews:', error);
    }
  };



  //const { dispatch } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure user.reviews is defined and accessible
    // Assuming user.reviews is an array, you can push the new review into it
    if (!review.hotelName || review.rating === 0 || !review.comment) {
      alert('Please fill in all the review fields first');
      return;
    }
    updateUserReviews(review);
    // Navigate to the profile page or wherever needed
    return navigate('/profile');
  };

  //const handleSubmit = (e) => {
    
  //  e.preventDefault();
  //  console.log(review);
  //  console.log(user.reviews);
  //  user.reviews=[user.reviews,review];
  //  console.log(user.reviews);
  //  return (navigate("/profile"));
    //const currentDate = new Date().toISOString().slice(0, 10);
    //const reviewWithDate = { ...review, date: currentDate };
    // Handle form submission (e.g., send data to backend)
  //};

  return (
    <div>
    <Navbar/>
    <div className="new-review-container">
      <h2>Add a New Review</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="hotelName">Hotel Name:</label>
        <select id="hotelName" name="hotelName" value={review.hotelName} onChange={handleChange}>
          <option value="">Select Hotel</option>
          {hotelNames.map((hotel, index) => (
            <option key={index} value={hotel}>{hotel}</option>
          ))}
        </select>

        <label htmlFor="rating">Rating:</label>
        <div className="rating">
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              className={index < review.rating ? "star selected" : "star"}
              onClick={() => handleChange({ target: { name: "rating", value: index + 1 } })}
            />
          ))}
        </div>

        <label htmlFor="comment">Comment:</label>
        <textarea id="comment" name="comment" value={review.comment} onChange={handleChange} maxLength={300} />
        <button type="submit">Submit</button>
      </form>
    </div>
    </div>
  );
};

export default NewReview;
