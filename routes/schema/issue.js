const mongoose = require('mongoose');

// Define the Hospital schema
const issueSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true,
        unique: false
    },
    landmark: {
        type: String,
        required: false
    },
    issueType: {
        type: String,
        required: true,
        // Ensure that issueType is always treated as a single string
        set: val => val.toString() // Convert array to string
    },
    description: {
        type: String,
        required: false
    },
    priority: {
        type: String,
        required: true,
        // Ensure that priority is always treated as a single string
        set: val => val.toString() // Convert array to string
    },
    image: {
        type: String,
        required: false
    },
    workerName: {
        type: String,
        required: false
    },
    workerMobile: {
        type: String,
        required: false
    },
    ward: {
        type: Number,
        required: true
    },
    resolve: {
        type: Boolean,
        default: false
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { collection: 'issue', timestamps: true }); // Specify the collection name here

// Create a Hospital model using the schema
const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;
