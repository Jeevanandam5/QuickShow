import mongoose from "mongoose";

const bookinSchema = new mongoose.Schema({
    user : {
        type : String,
        required : true,
        ref : "User"
    },
    show : {
        type : String,
        required : true,
        ref : "Show"
    },
    amount : {
        type : Number,
        required : true,
    },
    bookedSeats : {
        type : [String],
        required : true,
    },
    isPaid : {
        type : Boolean,
        default : false,
    },
    paymentLink : {
        type : String,
    },
},{
    timestamps : true
})

const Booking = mongoose.model("Booking" , bookinSchema);

export default Booking