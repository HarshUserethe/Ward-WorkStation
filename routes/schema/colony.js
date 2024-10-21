const mongoose = require('mongoose');

// Define the Colony schema
const colonySchema = new mongoose.Schema({
    colonyName: {
        type: String,
        required: true,
        unique: true
    },
    mohalla: {
        type: String,
        required: false,
        default:""
    },
    landmark: {
        type: String,
        required: false,
        default:""
    },
    ward: {
        type: Number,
        required: true
    },
    members: [{
        name: {
            type: String,
            required: false,
            default:""
        },
        mobileNumber: {
            type: String,
            required: false,
            default:""
        }
    }]
}, { collection: 'colony', timestamps: true  }); // Specify the collection name here

// Create a Colony model using the schema
const Colony = mongoose.model('Colony', colonySchema);

module.exports = Colony;
