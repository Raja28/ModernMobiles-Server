const { default: mongoose, Schema } = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "UserModel"
    },
    cartId: [{
        type: Schema.Types.ObjectId,
        ref: "CartModel"
    }],

    address: {
        type: Schema.Types.ObjectId,
        ref: "AddressModel"
    },

    totalPrice: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        date:  Date
    },
}, {timestamps: true})

module.exports = mongoose.model("OrderModel", orderSchema)