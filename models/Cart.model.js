const { default: mongoose, Schema } = require("mongoose");

const cartSchema = new mongoose.Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "DataModel"
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "UserModel"
    },
    quantity: {
        type: Number,
        default: 1
    },
    totalPrice: {
        type: Number
    }
})

module.exports = new mongoose.model("CartModel", cartSchema)