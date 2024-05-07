import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import { createError } from "../utils/error.js";

export const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  const newRoom = new Room(req.body);

  try {
    const savedRoom = await newRoom.save();
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json(savedRoom);
  } catch (err) {
    next(err);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedRoom);
  } catch (err) {
    next(err);
  }
};
export const updateRoomAvailability = async (req, res, next) => {
  try {
    await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $push: {
          "roomNumbers.$.unavailableDates": req.body.dates
        },
      }
    );
    res.status(200).json("Room status has been updated.");
  } catch (err) {
    next(err);
  }
};
export const deleteRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  try {
    await Room.findByIdAndDelete(req.params.id);
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: req.params.id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json("Room has been deleted.");
  } catch (err) {
    next(err);
  }
};
export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};
export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
};

export const getRoomsByIds = async (req, res, next) => {
  try {
    const roomIds = req.body.roomIds; // Assuming the array of room IDs is passed in the request body
    const rooms = await Room.find({ _id: { $in: roomIds } });

    // Extract room titles from the fetched rooms
    const roomTitles = rooms.map(room => room.title);

    res.status(200).json(roomTitles);
  } catch (err) {
    next(err);
  }
};

export const deleteOldDatesFromRooms = async (req, res, next) => {
  try {
    // Define the threshold date for old dates (e.g., today's date minus 1 day)
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - 1);

    // Update all rooms to remove old dates from unavailableDates
    await Room.updateMany(
      { 'roomNumbers.unavailableDates': { $lt: thresholdDate } }, // Find rooms with old dates
      { $pull: { 'roomNumbers.$.unavailableDates': { $lt: thresholdDate } } } // Remove old dates
    );

    res.status(200).json('Old dates have been deleted from room availability.');
  } catch (err) {
    next(err);
  }
};
