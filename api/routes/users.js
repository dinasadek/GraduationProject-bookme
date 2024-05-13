import express from "express";
import {
  addCurrentBookingToUser,
  addHistoryBookingToUser,
  addReviewToUser,
  createUsers,
  deleteUser,
  getUser,
  getUserCurrentBookings,
  getUserHistoryBookings,
  getUserReviews,
  getUsers,
  removeCurrentBookingFromUser,
  updateUser
} from "../controllers/user.js";

import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";
//const user = require("../models/User.js")
const router = express.Router();

router.post("/register", createUsers);


// router.get("/checkauthentication", verifyToken, (req,res,next)=>{
//   res.send("hello user, you are logged in")
// })

// router.get("/checkuser/:id", verifyUser, (req,res,next)=>{
//   res.send("hello user, you are logged in and you can delete your account")
// })

// router.get("/checkadmin/:id", verifyAdmin, (req,res,next)=>{
//   res.send("hello admin, you are logged in and you can delete all accounts")
// })

//UPDATE
router.put("/:id", updateUser);

//DELETE
router.delete("/:id", verifyUser, deleteUser);

//GET
router.get("/:id", getUser);

//GET ALL
router.get("/", verifyAdmin, getUsers);


//ADD REVIEW
router.post("/:id/reviews", addReviewToUser)

// Define route to get all reviews of a specific user
router.get('/:id/reviews', getUserReviews);

router.post("/:id/currentbookings",addCurrentBookingToUser);
router.delete("/:id/currentbookings",removeCurrentBookingFromUser);
router.get('/:id/currentBookings', getUserCurrentBookings);

router.post("/:id/historybookings",addHistoryBookingToUser);
router.get("/:id/historybookings",getUserHistoryBookings);


export default router;
