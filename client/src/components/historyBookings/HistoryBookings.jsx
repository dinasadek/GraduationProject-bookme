import React from 'react';
//import { FaStar } from 'react-icons/fa'; // Import star icon from react-icons/fa
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const HistoryBookings = () => {
    const { user} = useContext(AuthContext);
    const userId = user._id;
    const [currentBookings, setcurrentBookings] = useState([]);
    const [historyBookings, sethistoryBookings] = useState([]);


    const deleteOldDatesFromRoomAvailability = async () => {
      try {

        const res = await axios.delete('http://localhost:8800/api/rooms/deleteoldAvailability');
        return res.data ; // Assuming the server returns a message upon successful deletion
        
      } catch (error) {
        console.error("Error deleting old dates from room availability:", error.message);
      }
    };
   
  
    useEffect(() => {
        const fetchcurrentBookings = async () => {
            try {
                const response = await fetch(`http://localhost:8800/api/users/${userId}/currentBookings`);
                if (!response.ok) {
                    throw new Error("Failed to fetch current bookings");
                }
                const data = await response.json();
                setcurrentBookings(data);
            }catch (error) {
                console.error("Error fetching current bookings:", error.message);
            }
        };
  
        fetchcurrentBookings();
    }, [userId]);

    useEffect(() => {
        const fetchhistoryBookings = async () => {
            try {
                const response = await fetch(`http://localhost:8800/api/users/${userId}/historyBookings`);
                if (!response.ok) {
                    throw new Error("Failed to fetch current bookings");
                }
                const data = await response.json();
                sethistoryBookings(data);
            }catch (error) {
                console.error("Error fetching current bookings:", error.message);
            }
        };
  
        fetchhistoryBookings();
    }, [userId]);

    function isBookingOld(booking) {
        const toDate = Date.parse(booking.toDate.split(", ").join(" "));
        const currentDate = Date.parse( new Date().toDateString() );
         
  
        return toDate < currentDate;
    };

    const addHistoryBookingCard = async (bookingCard) => {
        try { 
          const response = await fetch(`http://localhost:8800/api/users/${userId}/historybookings`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({bookingCard:bookingCard})
          });
    
          
          if (!response.ok) {
            throw new Error('Failed to add booking');
          }else{
            await removeCurrentBookingFromUser(bookingCard.id);
            console.log("This booking became old:", bookingCard);
          }
          
        } catch (error) {
          console.error('Error adding booking:', error.message);
        }

      };
      
      const removeCurrentBookingFromUser = async ( bookingId) => {
        try {
          const response = await fetch(`http://localhost:8800/api/users/${userId}/currentbookings`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({bookingId:bookingId})
            
          });
      
          if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage || 'Failed to remove booking');
          }

          console.log('Booking removed successfully');
      
          return await response.json();
        } catch (error) {
          console.error(error);
          throw error;
        }
      };

      
      currentBookings.forEach(async booking => {
        if (isBookingOld(booking)) {
          await addHistoryBookingCard(booking);
          await deleteOldDatesFromRoomAvailability();
        }
      });
      
    

    

      return (
        <div className="history-bookings">
          <h2>History Bookings</h2>
          <ul>
            {historyBookings.map((booking) => (
              <li key={booking.id}>
                <div className="booking-details">
                  <div>
                    <span className="booking-date">
                      <strong>From: </strong>
                      {booking.fromDate}
                    </span>{' '}
                    <strong>,</strong>{' '}
                    <span className="booking-date">
                      <strong>To: </strong>
                      {booking.toDate}
                    </span>
                  </div>
                  <div>
                    <span className="booking-location">City: {booking.city}</span>{' '}
                    <span className="booking-status">Total Cost: ${booking.totalCost}</span>
                  </div>
                  <div>
                    <span className="booking-details">Adults: {booking.numberOfAdults}</span>
                    <span className="booking-details">Children: {booking.numberOfChildren}</span>
                    <span className="booking-details">Rooms: {booking.numberOfRooms}</span>
                  </div>
                  <div>
                    <span className="booking-details">Hotel: {booking.hotelName}</span>
                    <span className="booking-details">
                      Room Names:{' '}
                      {booking.ReservationDetails.map((detail, index) => (
                        <React.Fragment key={index}>
                          {index > 0 && <b>, </b>}
                          {detail.selectedRoomsNums.join(', ')} =&gt; {detail.roomtitle}
                        </React.Fragment>
                      ))}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
    };

export default HistoryBookings;


