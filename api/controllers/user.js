import User from "../models/User.js";

export const updateUser = async (req,res,next)=>{
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
}
export const deleteUser = async (req,res,next)=>{
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    next(err);
  }
}
export const getUser = async (req,res,next)=>{
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}
export const getUsers = async (req,res,next)=>{
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

export const createUsers = async(req ,res)=>{

  const newuser = new User({name : req.body.name , email : req.body.email , name : req.body.password })
  try{
    const user = await newuser.save()
    res.send("user registered successfully")
  } catch (error){
    return res.status(400).json({error});
  }

};

export const addReviewToUser = async (req, res, next) => {
  const {reviewContent} = req.body; // Assuming the review content is in the request body
  const {userid}=req.body;

  try {
    // Create a new review object
    const newReview = reviewContent;

    // Find the user by ID and update their reviews array
    const user = await User.findByIdAndUpdate(userid, {
      $push: { reviews: newReview },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Review added successfully', user });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getUserReviews = async (req, res, next) => {
  try {
    // Find the user by ID
    const user = await User.findById(req.params.id);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // If user exists, get their reviews
    const userReviews = user.reviews;

    // Respond with user's reviews
    res.status(200).json(userReviews);
  } catch (err) {
    // If any error occurs, pass it to the error handler middleware
    next(err);
  }
};

export const getUserCurrentBookings = async (req, res, next) => {
  try {
    // Find the user by ID
    const user = await User.findById(req.params.id);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // If user exists, get their reviews
    const currentBookings = user.CurrentBookings;

    // Respond with user's reviews
    res.status(200).json(currentBookings);
  } catch (err) {
    // If any error occurs, pass it to the error handler middleware
    next(err);
  }
};

export const addCurrentBookingToUser = async (req, res, next) => {
  const {userId } = req.body;
  const{bookingCard}=req.body;

  try {
    // Create a new booking card object
    const newBooking = bookingCard;

    // Find the user by ID and update their currentBookings array
    const user = await User.findByIdAndUpdate(userId, {
      $push: { CurrentBookings: newBooking },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Booking added successfully', user });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
export const addHistoryBookingToUser = async (req, res, next) => {
  const userId = req.params.id;
  const bookingCard = req.body.bookingCard;

  try {
      // Find the user by ID and update their HistoryBookings array
      let user = await User.findByIdAndUpdate(userId, {
          $push: { HistoryBookings: bookingCard },
      }, { new: true });

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Loop through the user's HistoryBookings to remove duplicate bookings
      const uniqueHistoryBookings = [];
      const existingIds = new Set();

      for (const booking of user.HistoryBookings.reverse()) {
          if (!existingIds.has(booking._id)) {
              uniqueHistoryBookings.push(booking);
              existingIds.add(booking._id);
          }
      }

      // Update user's HistoryBookings array with unique bookings
      user = await User.findByIdAndUpdate(userId, { HistoryBookings: uniqueHistoryBookings }, { new: true });

      res.status(200).json({ message: 'Booking added successfully', user });
  } catch (error) {
      console.error(error);
      next(error);
  }
};

export const getUserHistoryBookings = async (req, res, next) => {
  try {
    // Find the user by ID
    const user = await User.findById(req.params.id);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // If user exists, get their reviews
    const historyBookings = user.HistoryBookings;

    // Respond with user's reviews
    res.status(200).json(historyBookings);
  } catch (err) {
    // If any error occurs, pass it to the error handler middleware
    next(err);
  }
};

export const removeCurrentBookingFromUser = async (req, res, next) => {
  const userId = req.params.id;
  const { bookingId } = req.body; // Remove object destructuring from body

  try {
    // Find the user by ID and update their CurrentBookings array
    const user = await User.findOneAndUpdate(
      { _id: userId, 'CurrentBookings._id': bookingId }, // Find user by ID and bookingId
      { $pull: { CurrentBookings: { _id: bookingId } } }, // Remove the booking with matching ID
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ error: 'User or booking not found' });
    }

    res.status(200).json({ message: 'Booking removed successfully'}); // Return bookingId in response
  } catch (error) {
    console.error(error);
    next(error);
  }
};
export const addMessageToUser = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.Messages.push({ name, email, message });
    await user.save();

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getUserMessages = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userMessages = user.Messages;
    res.status(200).json(userMessages);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

