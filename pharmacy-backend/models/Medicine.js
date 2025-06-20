import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    brand : {
        type : String,
        required : true,
    },
    name : {
        type : String,
        required : true,
    },
    batchNumber : {
        type : String,
        required : true,
    },
    quantity : {
        type : Number,
        required : true,
    },
    expiryDate : {
        type : Date,
        required : true,
    },
    category : {
        type : String,
        required : true,
    }
} ,
{timestamps : true})

export default mongoose.model("Medicine" , medicineSchema);


