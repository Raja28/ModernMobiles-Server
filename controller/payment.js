const { instance } = require("../config/razorpay")
const crypto = require("crypto")
const OrdersModel = require("../models/Orders.model");
const UserModel = require("../models/User.model");
const path = require("path");
const { orderEmail } = require("../utils/mailTemplates/orderTemplate");
const { orderMailSender } = require("../utils/mailSender");

require("dotenv").config()


exports.capturePayment = async (req, res) => {

    try {
        const { total } = req.body
        const user = req

        if (!total) {
            return res.status(500).json({
                success: false,
                message: "Product Price Required"
            })
        }
        if (!total) {
            return res.status(500).json({
                success: false,
                message: "Product sum required (Total)"
            })
        }
        const uniqueIdForReceipt = crypto.randomUUID().split("-").join("")
        const options = {
            currency: "INR",
            amount: total * 100,
            receipt: uniqueIdForReceipt
        }

        try {
            const paymentResponse = await instance.orders.create(options)

            return res.status(200).json({
                success: true,
                data: paymentResponse

            })

        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: "Could not Initiate Order"
            })

        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error While Capturing Paymant"
        })

    }
}

exports.verifyPaymnet = async (req, res) => {

    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            amount,
            receipt,
            deliveryAddressId
        } = req.body

        const { user } = req

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !user?._id) {
            return res.status(500).json({
                success: false,
                message: "Payment Failed"
            })
        }

        let body = razorpay_order_id + "|" + razorpay_payment_id

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body.toString())
            .digest("hex")

        if (expectedSignature === razorpay_signature) {

            const userData = await UserModel.findById(user._id)

            const orderDetail = await OrdersModel.create({
                user: user._id,
                cartId: [...userData.cart],
                address: deliveryAddressId,
                totalPrice: amount
            })

            const userDetail = await UserModel.findByIdAndUpdate(user._id,
                {
                    $set: {
                        cart: []
                    },
                    $push: {
                        orders: orderDetail._id
                    }
                },
                { new: true }
            )

            const mailResponse = await orderMailSender(user.email, 
                "Order Confirmation",
                orderEmail(`${userData.firstName} ${userData.lastName}` ,razorpay_order_id, amount, receipt)
            )

     

            return res.status(200).json({
                success: true,
                message: "Payment Verified Successfully",
            })

        } else {

            return res.status(500).json({
                success: false,
                message: "Signature Mismatch"
            })


        }
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Error While Verifying Signature"
        })
    }
}
