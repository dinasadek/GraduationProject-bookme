import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import "./currentBookings.css";

const CurrentBookings = () => {
    const { user } = useContext(AuthContext);
    const userId = user._id;
    const [currentBookings, setCurrentBookings] = useState([]);
    const [showAlert, setShowAlert] = useState(false); // State to control alert visibility

    const getDatesInRange = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const date = new Date(start.getTime());
        const dates = [];

        while (date <= end) {
            dates.push(new Date(date).toDateString());
            date.setDate(date.getDate() + 1);
        }

        return dates;
    };

    const removeCurrentBookingFromUser = async (bookingId) => {
        try {
            const response = await fetch(`http://localhost:8800/api/users/${userId}/currentbookings`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bookingId: bookingId }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || 'Failed to remove booking');
            }

            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const deleteDatesFromRooms = async (roomDetails, dates) => {
        try {
            const response = await fetch('http://localhost:8800/api/rooms/deletecanceledAvailability', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ roomDetails, dates }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete dates from rooms');
            }

            const data = await response.json();
            console.log(data); // Output: 'Selected dates have been deleted from room availability.'
        } catch (error) {
            console.error('Error deleting dates from rooms:', error.message);
        }
    };

    const handleDeleteBooking = async (booking) => {
        await removeCurrentBookingFromUser(booking._id);
        const dates = getDatesInRange(booking.fromDate, booking.toDate);
        deleteDatesFromRooms(
            booking.ReservationDetails.map((room) => ({ roomid: room.roomid, selectedRoomsId: room.selectedRoomsId })),
            dates
        );

        setCurrentBookings((prevBookings) => prevBookings.filter((prevBooking) => prevBooking._id !== booking._id));
        setShowAlert(true); // Show alert after booking cancellation
        setTimeout(() => setShowAlert(false), 2000); // Hide alert after 2 seconds
    };

    useEffect(() => {
        const fetchcurrentBookings = async () => {
            try {
                const response = await fetch(`http://localhost:8800/api/users/${userId}/currentBookings`);
                if (!response.ok) {
                    throw new Error('Failed to fetch current bookings');
                }
                const data = await response.json();
                setCurrentBookings(data);
            } catch (error) {
                console.error('Error fetching current bookings:', error.message);
            }
        };

        fetchcurrentBookings();
    }, [userId]);

    return (
        <div className="current-bookings">
            <h2>Current Bookings</h2>
            {showAlert && <div className="alert">Your reservation has been canceled</div>}
            <ul>
                {currentBookings.map((booking) => (
                    <li key={booking._id}>
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
                                            {index > 0 && <b className="bold">, </b>}
                                            {detail.selectedRoomsNums.join(', ')} =&gt; {detail.roomtitle}
                                        </React.Fragment>
                                    ))}
                                </span>
                                <br />
                                <span>
                                    <button className='CRbutton' onClick={() => handleDeleteBooking(booking)}>Cancel Reservation</button>
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
