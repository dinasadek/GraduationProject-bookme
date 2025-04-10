import CreditCardIcon from "@mui/icons-material/CreditCard";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import StoreIcon from "@mui/icons-material/Store";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./widget.scss";

const Widget = ({ type }) => {
  const [userCount, setUserCount] = useState(0);
  const [hotelCount, setHotelCount] = useState(0);
  const [roomCount, setRoomCount] = useState(0);
  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetch('http://localhost:8800/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUserCount(data.length);
      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    };
    getUsers();
  }, []);

  useEffect(() => {
    const getRooms = async () => {
      try {
        const response = await fetch('http://localhost:8800/api/rooms');
        if (!response.ok) {
          throw new Error('Failed to fetch rooms');
        }
        const data = await response.json();
        setRoomCount(data.length);
      } catch (error) {
        console.error('Error fetching rooms:', error.message);
      }
    };
    getRooms();
  }, []);

  useEffect(() => {
    const getHotels = async () => {
      try {
        const response = await fetch('http://localhost:8800/api/hotels');
        if (!response.ok) {
          throw new Error('Failed to fetch hotels');
        }
        const data = await response.json();
        setHotelCount(data.length);
      } catch (error) {
        console.error('Error fetching hotels:', error.message);
      }
    };
    getHotels();
  }, []);

  let data;

  let amount;
  
  switch (type) {
    
    case "user":
      amount=userCount;
      data = {
        title: "USERS",
        isMoney: false,
        link: "See all users",
        to:'/users',
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "hotel":
      amount=hotelCount;
      data = {
        title: "HOTELS",
        isMoney: false,
        link: "View all hotels",
        to:'/hotels',
        icon: (
          <StoreIcon 
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "room":
      amount=roomCount;
      data = {
        title: "ROOMS",
        isMoney: false,
        link: "View all rooms",
        to:'/rooms',
        icon: (
          <CreditCardIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "$"} {amount}
        </span>
        <Link to={data.to} style={{ textDecoration: "none" }}> 
        <span className="link">{data.link}</span>
        </Link>
      </div>
      <div className="right">
        <div className="percentage positive">
          <KeyboardArrowUpIcon />
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
