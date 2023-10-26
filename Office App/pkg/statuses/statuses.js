const mongoose = require("mongoose");

const statusesOffice = new mongoose.Schema({
    user: {
        type: String,
    },
    content: {
        type: String,
    },
    time: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "users"
    },
    image: {
        type: String,
      }
});

module.exports = mongoose.model("office", statusesOffice, "OfficeApp");