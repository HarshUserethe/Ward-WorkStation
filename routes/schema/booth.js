const mongoose = require('mongoose');


const boothSchema = new mongoose.Schema({
    boothName: {
        type: String,
        required: true,
        unique: false
    },
    address: {
        type: String,
        required: false
    },
    boothnumber: {
        type: Number,
        required: true,
        unique:true
    },
    ward: {
        type: Number,
        required: true
    },
    members: [{
        name: {
            type: String,
            required: false
        },
        mobileNumber: {
            type: String,
            required: false
        }
    }]
}, { collection: 'booth', timestamps: true }); // Specify the collection name here

// Create a Hospital model using the schema
const Booth = mongoose.model('Booth', boothSchema);

module.exports = Booth;
