const mongoose = require('mongoose');

// Define the Hospital schema
const hospitalSchema = new mongoose.Schema({
    hospitalName: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: false
    },
    landmark: {
        type: String,
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
        post: {
            type: String,
            required: false
        },
        mobileNumber: {
            type: String,
            required: false
        }
    }]
}, { collection: 'hospital', timestamps: true }); // Specify the collection name here

// Create a Hospital model using the schema
const Hospital = mongoose.model('Hospital', hospitalSchema);

module.exports = Hospital;
