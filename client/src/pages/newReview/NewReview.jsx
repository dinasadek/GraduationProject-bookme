import React, { useContext, useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import { AuthContext } from "../../context/AuthContext";
import './newReview.css';

const NewReview = () => {
  const { user } = useContext(AuthContext);
  const userId = user._id;
  const [historyBookings, setHistoryBookings] = useState([]);
  const [review, setReview] = useState({
    userId: user._id,
    date: new Date().toISOString().slice(0, 10),
    hotelName: '',
    rating: 0,
    comment: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistoryBookings = async () => {
      try {
        const response = await fetch(`http://localhost:8800/api/users/${userId}/historyBookings`);
        if (!response.ok) {
          throw new Error("Failed to fetch history bookings");
        }
        const data = await response.json();
        setHistoryBookings(data);
      } catch (error) {
        console.error("Error fetching history bookings:", error.message);
      }
    };

    fetchHistoryBookings();
  }, [userId]);

  const hotelNames = historyBookings.map(booking => booking.hotelName);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview(prevReview => ({
      ...prevReview,
      [name]: value
    }));
  };

  const updateUserReviews = async (review) => {
    try {
      const url = `http://localhost:8800/api/users/${user._id}/reviews`;
      const basicAuth = 'Basic ' + btoa('lamya:12345');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': basicAuth,
          'User-Agent': 'insomnia/8.6.1'
        },
        body: JSON.stringify({ userid: user._id, reviewContent: review })
      });

      if (!response.ok) {
        throw new Error('Failed to update user reviews');
      }

    } catch (error) {
      console.error('Error updating user reviews:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!review.hotelName || review.rating === 0 || !review.comment) {
      alert('Please fill in all the review fields first');
      return;
    }
    updateUserReviews(review);
    navigate('/profile');
  };

  return (
    <div>
      <Navbar />
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
