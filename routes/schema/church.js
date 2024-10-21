const mongoose = require('mongoose');

// Define the Hospital schema
const churchSchema = new mongoose.Schema({
    churchName: {
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
}, { collection: 'church', timestamps: true }); // Specify the collection name here

// Create a Hospital model using the schema
const Church = mongoose.model('Church', churchSchema);

module.exports = Church;
