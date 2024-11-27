const { default: mongoose } = require("mongoose");

const addressSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    state:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    pinCode:{
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
    
})

module.exports = mongoose.model("AddressModel", addressSchema)