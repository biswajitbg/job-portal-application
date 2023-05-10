

//-----------------------------JOB SCHEMA-------------------------------



const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId;


const jobSchema = new mongoose.Schema({

    company: {
        type: String,
        required: true,

    },
    position: {
        type: String,
        required: true,
        maxlength: 100,

    },

    status: {
        type: String,
        enum: ['pending', 'reject', 'interview'],
        default: 'pending',

    },

    worktype: {
        type: String,
        enum: ['full-time', 'part-time', 'internship'],
        default: 'full-time',

    },
    worklocation: {
        type: String,
        required: true,
        default: "bangalore"
    },
    userId: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },



}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);