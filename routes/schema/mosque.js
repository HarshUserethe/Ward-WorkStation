const mongoose = require('mongoose');

// Define the Hospital schema
const mosqueSchema = new mongoose.Schema({
    mosqueName: {
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
}, { collection: 'mosque', timestamps: true }); // Specify the collection name here

// Create a Hospital model using the schema
const Mosque = mongoose.model('Mosque', mosqueSchema);

module.exports = Mosque;
