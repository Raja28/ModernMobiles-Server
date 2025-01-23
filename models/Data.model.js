const { default: mongoose } = require("mongoose");

const data = mongoose.Schema({

    brand: {
        type: String,
        required: true, d: true,
    },
    model: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    imageURLLarge: {
        type: String,
        required: true
    },
    deliveryCost: {
        type: String,
        required: true
    },
    series: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    // battery: {
    //     type: String,
    //     required: true
    // },
    // internalStorage: {
    //     type: String,
    //     required: true
    // },
    // camera: {
    //     type: String,
    //     required: true,
    // },

    category: {
        type: String,
        enum: ["flagship", "premium"],
        required: true,
    },

    spec: [
        {
            type: String,
            required: true,
        },
    ],

    colorsAvailable: [
        {
            type: String,
            required: true
        },
    ],

    modelNumber: {
        type: String,
        required: true
    },

    imageGallery: [
        {
            type: Object,
            required: true
        },
    ],

    additionalInformation: {
        type: Object,
        required: true
    },
    reviewVideoLink: {
        type: Object,
        required: true
    },
    rating: {
        type: Number
    }
})

module.exports = mongoose.model("DataModel", data)