//import React, { useState } from 'react';
//import { FaStar } from 'react-icons/fa';
import { useContext } from "react";
import { Link } from 'react-router-dom';
//import { useEffect } from "react";

import Footer from "../../components/footer/Footer";
import './profile.css';
//import MainList from "../../components/mainList/MainList"
import CurrentBookings from '../../components/currentBookings/CurrentBookings.jsx';
import HistoryBookings from '../../components/historyBookings/HistoryBookings.jsx';
import MailList from "../../components/mailList/MailList";
import Navbar from "../../components/navbar/Navbar";
import ReviewList from "../../components/reviewList/ReviewList";
import { AuthContext } from "../../context/AuthContext";
import NewReview from '../newReview/NewReview';
//import useFetch from "../../hooks/useFetch";
//import axios from "axios";

const Profile = () => {
    // Dummy user data (replace with real data from your backend)
    //const { user } = useContext(AuthContext);
    const {user,dispatch} = useContext(AuthContext); // Assuming there's a updateUser function in your context to update user data

    //const userId =user._id;
    //const [image, setImage] = useState();
    //const [userImage, setUserImage] = useState();

    
    

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "upload"); // Replace "your_upload_preset" with your Cloudinary upload preset

    // Upload image to Cloudinary
    try {
        const response = await fetch("https://api.cloudinary.com/v1_1/dqfvmwrye/image/upload", {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          const data = await response.json();
          updateUserImage(data.secure_url.toString()); // Call function to update user image in the database
          const updatedUser = { ...user, img: data.secure_url.toString() };
          dispatch({ type: "LOGIN_SUCCESS", payload: updatedUser });
          
          

        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    };
  
    const updateUserImage = async (imageUrl) => {
      try {
        const response = await fetch(`http://localhost:8800/api/users/${user._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ img: imageUrl }),
        });
        if (response.ok) {
          console.log("User image updated successfully");
        }
      } catch (error) {
        console.error("Error updating user image:", error);
      }
  };
  
    return (
      <div>
        <Navbar/>

        <div className="profile">
  
          <div className="profile-header">
            <label htmlFor="image-upload" className="profile-picture">
        <img src={user.img || "https://i.ibb.co/MBtjqXQ/no-avatar.gif"} alt="avatar" className="profile-picture" />
        {!user.img && <h4 className="upload">Upload image</h4>}
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
      </label>
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-email">{user.email}</p>
          </div>

          <CurrentBookings />
          <HistoryBookings/>
          <ReviewList />

          <Link to="/new-review">
          <button onClick={NewReview}>Add a review</button>
          </Link>
          
        </div>
        <div className="End_Page">
        <MailList />
        <Footer />
        </div>
        
      </div>
    );
  };
  
  
  export default Profile;
