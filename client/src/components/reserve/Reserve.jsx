import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { SearchContext } from "../../context/SearchContext";
import useFetch from "../../hooks/useFetch";
import "./reserve.css";
//import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const Reserve = ({ setOpen, hotelId }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const roomdata = useFetch(`http://localhost:8800/api/hotels/room/${hotelId}`);
  const hoteldata = useFetch(`http://localhost:8800/api/hotels/find/${hotelId}`);
  const { dates, options } = useContext(SearchContext);
  const { user  } = useContext(AuthContext);

  const generateCustomUUID = () => {
    const uuid = uuidv4();
    // Remove hyphens and return the first 22 characters
    if (!user.CurrentBookings.some(booking => booking.id === uuid.replace(/-/g, '').substring(0, 22))) {
      // If the ID is not found in any of the reviews, return the ID
      return uuid.replace(/-/g, '').substring(0, 22);
    }
  };
  

  const getDatesInRange = (startDate, endDate) => {
    

    const start = new Date(startDate);
    const end = new Date(endDate);

    const date = new Date(start.getTime());

    const dates = [];

    while (date <= end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }

    return dates;
    
  };

  //if (dates[0].startDate===null && dates[0].endDate===null){
    //dates[0].startDate = dates[0].endDate = new Date.now();

  //}
 

  const alldates = getDatesInRange(dates[0].startDate, dates[0].endDate);

  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some((date) =>
      
      alldates.includes(new Date(date).getTime()) 
      
    );



    return !isFound ;
  };

  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value)
    );
  };

  const navigate = useNavigate();
  /*const fetchRoomTitles = async () => {
    try {
      const response = await fetch('http://localhost:8800/api/rooms/getRoomsByIds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomIds:searchRooms(selectedRooms), // Replace with your array of room IDs
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch room titles');
      }
  
      const RoomTitles = await response.json();
      return (RoomTitles); // Array of room titles
    } catch (error) {
      console.error('Error fetching room titles:', error.message);
    }
  };*/
  

  const searchRoomsForHotels = async (hotelRooms, selectedRoomNumbers) => {
    try {
      const roomTitles = [];
  
      // Iterate over each room ID in the hotel
      for (const roomId of hotelRooms) {
        // Find the room by ID
        const room = roomdata.data.find(room => room._id === roomId);
        if (!room) {
          throw new Error(`Room with ID ${roomId} not found`);
        }
  
        // Iterate over each room number in the room
        for (const roomNumber of room.roomNumbers) {
          // Check if the room number matches any selected room number
          if (selectedRoomNumbers.includes(roomNumber._id.toString())) {
            roomTitles.push(room.title);
            // If a match is found, push the room title to the roomTitles array
            break; // No need to search further in this room
          }
        }
      }
      return roomTitles;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to search rooms for hotels');
    }
  };

  const getReservation = async (hotelRooms, selectedRoomNumbers) => {
    try {
      const roomDetails = [];
      let totalPrice = 0; // Initialize total price
  
      // Iterate over each room ID in the hotel
      for (const roomId of hotelRooms) {
        // Find the room by ID
        const room = roomdata.data.find(room => room._id === roomId);
        if (!room) {
          throw new Error(`Room with ID ${roomId} not found`);
        }
  
        // Initialize count of selected rooms and room total price
        let selectedRoomCount = 0;
        let roomTotalPrice = 0;
        const selectedRoomsId =[];
        const selectedRoomsNums=[];
  
        // Iterate over each room number in the room
        for (const roomNumber of room.roomNumbers) {
          // Check if the room number matches any selected room number
          if (selectedRoomNumbers.includes(roomNumber._id.toString())) {
            selectedRoomCount++;
            selectedRoomsId.push(roomNumber._id.toString());
            selectedRoomsNums.push(roomNumber.number);
            roomTotalPrice += room.price; // Add room price to room total price
          }
        }
  
        // Add room total price to the total price
        totalPrice += roomTotalPrice;
  
        // Push room details to the roomDetails array
      
        roomDetails.push({
          hotelId:hotelId,
          roomtitle: room.title,
          roomid:room._id,
          selectedRoomCount,
          selectedRoomsId:selectedRoomsId,
          selectedRoomsNums:selectedRoomsNums,
          roomPrice: roomTotalPrice, // Update to room total price
        });
      }
      
      return {totalPrice,roomDetails} ; // Return both room details and total price
    } catch (error) {
      console.error(error);
      throw new Error('Failed to search rooms for hotels');
    }
  };

  
  
  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24
  function dayDifference(date1, date2) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }
  /*function getFullDayName(abbreviation) {
    const days = {
      Mon: "Monday",
      Tue: "Tuesday",
      Wed: "Wednesday",
      Thu: "Thursday",
      Fri: "Friday",
      Sat: "Saturday",
      Sun: "Sunday"
    };
  
    return days[abbreviation];
  }*/
  
  const days = dayDifference(dates[0].endDate, dates[0].startDate);
  const fparts = dates[0].startDate.toString().split(" ");
  const tparts = dates[0].endDate.toString().split(" ");
  const fromDate = `${fparts[0]}, ${fparts[1]} ${fparts[2]}, ${fparts[3]}`;
  const toDate = `${tparts[0]}, ${tparts[1]} ${tparts[2]}, ${tparts[3]}`;

  
  //console.log(selectedRooms);
  

  const addBookingCard = async () => {
    try {
      
      const roomNames = await searchRoomsForHotels(hoteldata.data.rooms,selectedRooms);
      const roomsTotalPrice = (await getReservation(hoteldata.data.rooms,selectedRooms)).totalPrice;
      const RoomDetails = (await getReservation(hoteldata.data.rooms,selectedRooms)).roomDetails.filter(room => roomNames.includes(room.roomtitle));
  
      const bookingCard={
        id: generateCustomUUID(),
        fromDate: fromDate,
        toDate: toDate,
        city: hoteldata.data.city,    
        numberOfAdults: options.adult,
        numberOfChildren: options.children,
        hotelName: hoteldata.data.name,
        numberOfRooms: selectedRooms.length,
        roomNames: roomNames,
        ReservationDetails: RoomDetails,
        totalCost:  roomsTotalPrice + days * hoteldata.data.cheapestPrice
      };
      const userId = user._id; 
      const response = await fetch(`http://localhost:8800/api/users/${userId}/currentbookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({bookingCard:bookingCard,userId: userId})
      });

  
      if (!response.ok) {
        throw new Error('Failed to add booking');
      }
  
      // Handle success
      setOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Error adding booking:', error.message);
    }
  };

  const handleClick = async () => {
    try {

      if (selectedRooms.length === 0) {
        alert("Please select the rooms before reserving.");
        return; // Exit the function if no rooms are selected
      }

      await Promise.all(
        selectedRooms.map((roomId) => {
          const res = axios.put(`/rooms/availability/${roomId}`, {
            dates: alldates,
          });
          return res.data;
        })
      );
      setOpen(false);
      navigate("/");
    } catch (err) {};
    addBookingCard();
  };
  
  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />
        <span>Select your rooms:</span>
        {roomdata.data.map((item) => (
          <div className="rItem" key={item._id}>
            <div className="rItemInfo">
              <div className="rTitle">{item.title}</div>
              <div className="rDesc">{item.desc}</div>
              <div className="rMax">
                Max people: <b>{item.maxPeople}</b>
              </div>
              <div className="rPrice">{item.price}</div>
            </div>
            <div className="rSelectRooms">
              {item.roomNumbers.map((roomNumber) => (
                <div className="room">
                  <label>{roomNumber.number}</label>
                  <input
                    type="checkbox"
                    value={roomNumber._id}
                    onChange={handleSelect}
                    disabled={!isAvailable(roomNumber)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button onClick={handleClick} className="rButton">
          Reserve Now!
        </button>
      </div>
    </div>
  );
};

export default Reserve;

