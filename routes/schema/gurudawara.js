const mongoose = require('mongoose');

// Define the Hospital schema
const gurudawaraSchema = new mongoose.Schema({
    gurudawaraName: {
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
}, { collection: 'gurudawara', timestamps: true }); // Specify the collection name here

// Create a Hospital model using the schema
const Gurudawara = mongoose.model('Gurudawara', gurudawaraSchema);

module.exports = Gurudawara;
