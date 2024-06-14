import express from "express";
import {
  countByCity,
  countByType,
  createHotel,
  deleteHotel,
  getHotel,
  getHotelNames,
  getHotelRooms,
  getHotels,
  getHotelsByType,
  getRoomsWithOffers,
  updateHotel
} from "../controllers/hotel.js";
import { verifyAdmin } from "../utils/verifyToken.js";
const router = express.Router();

//CREATE
router.post("/", verifyAdmin, createHotel);

//UPDATE
router.put("/:id", verifyAdmin, updateHotel);
//DELETE
router.delete("/:id", verifyAdmin, deleteHotel);
//GET

router.get("/find/:id", getHotel);
//GET ALL

router.get("/", getHotels);
router.get("/countByCity", countByCity);
router.get("/countByType", countByType);
router.get("/room/:id", getHotelRooms);
router.get("/name", getHotelNames);
// New route to get rooms with offers
router.get("/roomsWithOffers", getRoomsWithOffers);
router.get("/type/:type", getHotelsByType);



export default router;
