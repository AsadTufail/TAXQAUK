const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        phone: {
            type: String,
            unique: true
        },
        payment: {
            type: Boolean,
            default: false
        },
        amount: {
            type: String
        }
    },
    { timestamps: true }
);
  
  module.exports = mongoose.model('User', userSchema);