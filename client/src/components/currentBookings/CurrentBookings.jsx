import React from 'react';
//import { FaStar } from 'react-icons/fa'; // Import star icon from react-icons/fa
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const CurrentBookings = () => {
    const { user} = useContext(AuthContext);
    const userId =user._id;
    const [currentBookings, setcurrentBookings] = useState([]);
  
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

    return(
        <div className="current-bookings">
        <h2>Current Bookings</h2>
        <ul>
          {currentBookings.map(booking => (
            <li key={booking.id}>
              <div className="booking-details">
                <div>
                  <span className="booking-date"><strong>From: </strong>{booking.fromDate}</span>{'  '}<strong>{','}</strong>{'  '}
                  <span className="booking-date"><strong>To: </strong> {booking.toDate}</span>
                </div>
                <div>
                  <span className="booking-location">City: {booking.city}</span>{'  '}
                  <span className="booking-status">Total Cost:${booking.totalCost}</span>
                </div>
                <div>
                  <span className="booking-details">Adults: {booking.numberOfAdults}</span>
                  <span className="booking-details">Children: {booking.numberOfChildren}</span>
                  <span className="booking-details">Rooms: {booking.numberOfRooms}</span>
                </div>
                <div>
                  <span className="booking-details">Hotel: {booking.hotelName}</span>
                  <span className="booking-details"><li>
                        Room Names:</li>
                        {booking.ReservationDetails.map((detail, index) => (
                            <React.Fragment key={index}>
                                {index > 0 && <li>{', '}</li>} {/* Add comma for all items except the first one */}
                                <li>{detail.selectedRoomsNums.join(', ')} {'=>'} {detail.roomtitle}</li>
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

export default CurrentBookings;
