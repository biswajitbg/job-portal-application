

//--------------------------USER SCHEMA-------------------------------------------

const mongoose = require("mongoose")
const validator = require("validator")
//Schema

const userSChema  = new mongoose.Schema({

    fname: {
        type: String,
        required: true,
        
    },
    lname: {
        type: String,
        required:true,
           
    },
    phone: {
        type: Number,
        required:true,
           
    },
    

    email: {
        type: String,
        required: true,
        unique: true,
        validate:validator.isEmail
    },

    password: {
        type: String,
        required: true,
        minLength:6,
        
        
    },

    location: {
        type: String,
        default:"India"
        
    },



},{timestamps:true});


module.exports = mongoose.model("User",userSChema)