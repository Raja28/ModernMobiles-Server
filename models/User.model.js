const { default: mongoose } = require("mongoose");


const userSchema = new mongoose.Schema({
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
    email: {
        type: String,
        required: true
    },
    wishlist:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "DataModel"
    }],
    address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "AddressModel"
    }],
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "CartModel"
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderModel"
    }]
})

module.exports = mongoose.model("UserModel", userSchema)