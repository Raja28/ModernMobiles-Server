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
                // message: "Purchase Successfull",
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
           
            
            // .populate("wishlist")
            //     .populate({
            //         path: "address",
            //         options: {
            //             sort: { createdAt: -1 }
            //         }
            //     })
            //     .populate("orders")
            //     .populate({
            //         path: "orders",
            //         populate: {
            //             path: "cartId",
            //             populate: {
            //                 path: "product"
            //             }
            //         }
            //     })
            //     .populate({
            //         path: "orders",
            //         populate: {
            //             path: "address",
            //             options: {
            //                 sort: { createdAt: -1 }
            //             }
            //         }
            //     })
            //     .exec()

            // console.log("userData after orderCreation", userDetail);
            // console.log("orderDetail", orderDetail)

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

// exports.createOrder = async (user, amount, res) => {
//     try {
//         const { email, _id } = user
//         const { deliveryAddressId } = req.body

//         if (!email || !_id) {
//             return res.status(501).json({
//                 success: false,
//                 message: "Please Provide User Email or ID"
//             })
//         }
//         if (!deliveryAddressId) {
//             return res.status(501).json({
//                 success: false,
//                 message: "Please Provide Delivery Address"
//             })
//         }

//         const userData = await UserModel.findById(_id)
//         console.log("creating order");

//         const orderDetail = await OrdersModel.create({
//             user: _id,
//             cartId: [...userData.cart],
//             address: deliveryAddressId,
//             totalPrice: amount
//         })

//         userData.cart = []
//         userData.save()
//         console.log("userData after orderCreation", userData);

//         return orderDetail

//     } catch (error) {

//     }
// }

// exports.TestingCode = async (req, res) => {
//     try {
//         const { id } = req.body

//         if (!id) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User Id Required"
//             })
//         }

//         const userDetail = await UserModel.findById(id).select("orders")
//             // .populate("orders")
//             .populate({
//                 path: "orders",
                
//                 populate: {
//                     path: "cartId",

//                     populate: {
//                         path: "product",
//                     },
//                 },
//             })
//             .populate({
//                 path: "orders",
//                 options: { sort: { createdAt: -1 } },
//                 populate: {
//                     path: "address",
//                     // options: {
//                     //     sort: { 'createdAt': -1 }
//                     // }
//                 }
//             })
//             .exec()


//         res.status(200).json({
//             success: true,
//             message: "Data Fetched Successfully",
//             orderDetail: userDetail
//         })

//     } catch (error) {
//         res.status(501).json({
//             success: false,
//             message: "Error Fetching order Details"
//         })
//     }
// }