import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useEffect, useState } from "react";

import "./table.scss";

const List = ({ userId }) => {
  const [historyBookings, setHistoryBookings] = useState([]);

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

  return (
    <TableContainer component={Paper} className="table">
      {historyBookings.length === 0 ? (
        <div className="noDataMessage">There is no history bookings yet</div>
      ) : (
        <Table sx={{ minWidth: 650 }} aria-label="history bookings table">
          <TableHead>
            <TableRow>
              <TableCell className="tableCell">From Date</TableCell>
              <TableCell className="tableCell">To Date</TableCell>
              <TableCell className="tableCell">City</TableCell>
              <TableCell className="tableCell">Number of Adults</TableCell>
              <TableCell className="tableCell">Number of Children</TableCell>
              <TableCell className="tableCell">Hotel Name</TableCell>
              <TableCell className="tableCell">Number of Rooms</TableCell>
              <TableCell className="tableCell">Room Names</TableCell>
              <TableCell className="tableCell">Total Cost</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historyBookings.map((booking, index) => (
              <TableRow key={index}>
                <TableCell className="tableCell">{booking.fromDate}</TableCell>
                <TableCell className="tableCell">{booking.toDate}</TableCell>
                <TableCell className="tableCell">{booking.city}</TableCell>
                <TableCell className="tableCell">{booking.numberOfAdults}</TableCell>
                <TableCell className="tableCell">{booking.numberOfChildren}</TableCell>
                <TableCell className="tableCell">{booking.hotelName}</TableCell>
                <TableCell className="tableCell">{booking.numberOfRooms}</TableCell>
                <TableCell className="tableCell">{booking.roomNames.join(", ")}</TableCell>
                <TableCell className="tableCell">{booking.totalCost}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default List;
