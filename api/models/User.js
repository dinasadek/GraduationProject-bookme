import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    country: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    reviews:[{
      userId:{type:String},
      date:{type:String},
      hotelName: {type:String},
      rating: {type:Number},
      comment: {type:String}
    }],
    CurrentBookings:[{
        fromDate: {type:String},
        toDate: {type:String},
        city: {type:String},
        numberOfAdults: {type:Number},
        numberOfChildren: {type:Number},
        hotelName: {type:String},
        numberOfRooms: {type:Number},
        roomNames: {type:Array},
        ReservationDetails: {type:Array},
        totalCost: {type:Number}
    }
  ],
    HistoryBookings:{
      type:Array
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
