const OTPModel = require("../models/OTP.model")
const UserModel = require("../models/User.model")
const otpGenerator = require("otp-generator")
const jwt = require("jsonwebtoken")


require("dotenv").config()

exports.sendOTP = async (req, res) => {

    try {
        const { email } = req.body
        // console.log(otpGenerator.timestamp.format());

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "email required"
            })

        }


        let otp = otpGenerator.generate(4, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });

        let checkOTPExist = await OTPModel.findOne({ otp: otp })

        //generating unique otp

        if (checkOTPExist) {
            otp = otpGenerator.generate(4, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            });

            checkOTPExist = await OTPModel.findOne({ otp: otp })
        }

        const newOTP = await OTPModel.create({ email, otp })

        res.status(200).json({
            success: true,
            message: "otp send successfully"
        })

    } catch (error) {
        console.log("contoller -> sendOTP:", error);
        res.status(500).json({
            success: false,
            message: "failed to send otp"
        })

    }
}

exports.signup = async (req, res) => {
    try {

        const { firstName, lastName, otp, email, contact } = req.body
  

        if (!firstName || !lastName || !otp || !email || !contact) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }


        const checkUserExist = await UserModel.findOne({ email: email })

        if (checkUserExist) {
            return res.status(409).json({
                success: false,
                message: "user already registered, please login"
            })
        }

        //finding most recent otp
        const recentOTP = await OTPModel.find({ email }).sort({ createdAt: -1 }).limit(1)

        if (recentOTP.length === 0) {
            return res.status(400).json({
                success: false,
                message: "otp not found or expired!"
            })
        }
     

        if (recentOTP[0].otp !== parseInt(otp)) {
            return res.status(400).json({
                success: false,
                message: "invalid otp"
            })
        }

        const newUser = await UserModel.create({
            firstName,
            lastName,
            email,
            contact
        })

        if (newUser) {
            res.status(200).json({
                success: true,
                message: "user registered successfully"
            })
        }


    } catch (error) {
        console.log("singup failed ", error);
        return res.status(500).json({
            success: false,
            message: "Error while signup. Try again"
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, otp } = req.body

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "email or otp missing"
            })
        }

        const user = await UserModel.findOne({ email: email })
            .populate({
                path: 'address',
                options: {
                    sort: { createdAt: -1 }
                },
            })
            .populate("wishlist")
            .populate({
                path: "cart",
                populate: {
                    path: "product"
                }
            })
            .exec();
        // console.log(user);



        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user not registered, please signup"
            })
        }

        const recentOTP = await OTPModel.find({ email }).sort({ createdAt: -1 }).limit(1)

        if (recentOTP.length === 0) {
            return res.status(400).json({
                success: false,
                message: "otp not found"
            })
        }


        if (recentOTP[0].otp !== parseInt(otp)) {
            return res.status(400).json({
                success: false,
                message: "invalid otp"
            })
        } else {

            const jwtPayload = {
                _id: user._id,
                email: user.email
            }

            const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: "7d" })

            user.token = token;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }

            res.cookie("token", token, options).status(200).json({
                success: true,
                message: "login successfull",
                user,
                token
            })

        }

    } catch (error) {
        console.log("singup failed ", error);
        return res.status(500).json({
            success: false,
            message: "Error while login. Try again"
        })
    }
}

