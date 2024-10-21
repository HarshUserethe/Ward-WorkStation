const mongoose = require('mongoose');

// Define the Hospital schema
const schoolSchema = new mongoose.Schema({
    schoolName: {
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
        mobileNumber: {
            type: String,
            required: false
        }
    }]
}, { collection: 'school', timestamps: true }); // Specify the collection name here

// Create a Hospital model using the schema
const School = mongoose.model('School', schoolSchema);

module.exports = School;
