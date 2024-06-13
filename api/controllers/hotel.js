import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

export const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);

  try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (err) {
    next(err);
  }
};
export const updateHotel = async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    next(err);
  }
};
export const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel has been deleted.");
  } catch (err) {
    next(err);
  }
};
export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
};
export const getHotels = async (req, res, next) => {
  const { min, max, ...others } = req.query;
  try {
    const hotels = await Hotel.find({
      ...others,
      cheapestPrice: { $gt: min | 1, $lt: max || 999 },
    }).limit(req.query.limit);
    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
};
export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");
  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city: city });
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};
export const countByType = async (req, res, next) => {
  try {
    const hotelCount = await Hotel.countDocuments({ type: "hotel" });
    const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
    const resortCount = await Hotel.countDocuments({ type: "resort" });
    const villaCount = await Hotel.countDocuments({ type: "villa" });
    const cabinCount = await Hotel.countDocuments({ type: "cabin" });

    res.status(200).json([
      { type: "hotels", count: hotelCount },
      { type: "apartments", count: apartmentCount },
      { type: "resorts", count: resortCount },
      { type: "villas", count: villaCount },
      { type: "cabins", count: cabinCount },
    ]);
  } catch (err) {
    next(err);
  }
};

export const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room);
      })
    );
    res.status(200).json(list)
  } catch (err) {
    next(err);
  }
};
export const getHotelNames = async (req, res, next) => {
  try {
    const hotels = await Hotel.find({}, 'name'); // Retrieve only the 'name' field
    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
};

// Fetch all rooms with offers and the hotel name
export const getRoomsWithOffers = async (req, res, next) => {
  try {
    const hotels = await Hotel.find().populate("rooms");
    const roomsWithOffers = [];

    for (const hotel of hotels) {
      for (const roomId of hotel.rooms) {
        try {
          const room = await Room.findById(roomId);
          if (room && room.offers && room.offers.length > 0) {
            roomsWithOffers.push({
              hotelId: hotel._id,
              hotelName: hotel.name,
              hotelPhotos:hotel.photos,
              hotelAddress:hotel.address,
              hotelDistance:hotel.distance,
              hotelCheapestPrice:hotel.cheapestPrice,
              hotelCity:hotel.city,
              roomTitle:room.title,
              offerKind:hotel.offers[0].offerKind,
              ...room._doc
            });
          }
        } catch (error) {
          console.error(`Error fetching room with ID ${roomId}:`, error);
        }
      }
    }

    res.status(200).json(roomsWithOffers);
  } catch (error) {
    console.error("Error fetching rooms with offers:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


