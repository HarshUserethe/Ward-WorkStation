const mongoose = require('mongoose');

// Define the Hospital schema
const mandirSchema = new mongoose.Schema({
    mandirName: {
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
}, { collection: 'mandir', timestamps: true }); // Specify the collection name here

// Create a Hospital model using the schema
const Mandir = mongoose.model('Mandir', mandirSchema);

module.exports = Mandir;
