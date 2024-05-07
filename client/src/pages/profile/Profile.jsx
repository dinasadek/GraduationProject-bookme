import React from 'react';
//import { useState } from 'react';
//import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom'; 
import { useContext } from "react";
//import { useEffect } from "react";

import './profile.css';
import Footer from "../../components/footer/Footer";
//import MainList from "../../components/mainList/MainList"
import Navbar from "../../components/navbar/Navbar";
import MailList from "../../components/mailList/MailList";
import ReviewList from "../../components/reviewList/ReviewList";
import { AuthContext } from "../../context/AuthContext";
import NewReview from '../newReview/NewReview';
import CurrentBookings from '../../components/currentBookings/CurrentBookings.jsx';
import HistoryBookings from '../../components/historyBookings/HistoryBookings.jsx';
import { useState } from "react";
import { useEffect } from "react";
//import useFetch from "../../hooks/useFetch";
//import axios from "axios";

const Profile = () => {
    // Dummy user data (replace with real data from your backend)
    const { user } = useContext(AuthContext);
    const userId =user._id;
    const [image, setImage] = useState();
    const [userImage, setUserImage] = useState();

    useEffect(() => {
        // Retrieve image URL from local storage
        setUserImage(user.img === "" ? (image) : (user.img));
    }, [image,user]);
    
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
          getUserImage();
        }
      } catch (error) {
        console.error("Error updating user image:", error);
      }
  };
  
    return (
      <div>
        <Navbar image={image}/>

        <div className="profile">
  
          <div className="profile-header">
            <label htmlFor="image-upload" className="profile-picture">
        <img src={userImage || "https://i.ibb.co/MBtjqXQ/no-avatar.gif"} alt="avatar" className="profile-picture" />
        {!image && <h4 className="upload">Upload image</h4>}
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