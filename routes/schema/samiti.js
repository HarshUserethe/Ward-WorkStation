const mongoose = require('mongoose');

// Define the Colony schema
const samitiSchema = new mongoose.Schema({
    samitiName: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: false,
        unique: true,
        sparse: true
    },
    samitiType:{
        type: String,
        required: true,
        unique: false,
    },
    boothnumber: {
        type: Number,
        required: false
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
}, { collection: 'samiti', timestamps: true  }); // Specify the collection name here

// Create a Colony model using the schema
const Samiti = mongoose.model('Samiti', samitiSchema);

module.exports = Samiti;
