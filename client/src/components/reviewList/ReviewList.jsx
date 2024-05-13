// ReviewList.jsx
import React, { useContext, useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa'; // Import star icon from react-icons/fa
import { Link } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import NewReview from '../../pages/newReview/NewReview.jsx';
import "./reviewList.css";

const ReviewList = () => {
  const { user} = useContext(AuthContext);
  
  const userId =user._id;
  const [userReviews, setUserReviews] = useState([]);
  
  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const response = await fetch(`http://localhost:8800/api/users/${userId}/reviews`);
        if (!response.ok) {
          throw new Error("Failed to fetch user reviews");
        }
        const data = await response.json();
        setUserReviews(data);
      } catch (error) {
        console.error("Error fetching user reviews:", error.message);
      }
    };
  
    fetchUserReviews();
  }, [userId]);

  return (
    <div className="review_list">
      <h2>Reviews</h2>
      <br></br>
      <ul>
        {userReviews.map(review => (
          <li key={review.userId}>
            <div>
              <span>{review.date}</span>{'                                                                              '}
              <div className="rating">
                {[...Array(review.rating)].map((_, index) => (
                  <FaStar key={index} className="star" />
                ))}
              </div>
            </div>
            <p>Hotel: {review.hotelName}</p>
            <p>{review.comment}</p>
            <br></br>
          </li>
        ))}

      </ul>
      <Link to="/new-review">
          <button className="Rbutton" onClick={NewReview}>Add Review</button>
          </Link>
    </div>
  );
};

export default ReviewList;
