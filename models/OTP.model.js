const { default: mongoose } = require("mongoose");
const { otpMailSender } = require("../utils/mailSender");

const otpSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60
    },
   
})

async function sendMail(email, otp) {
    try {
        const res = await otpMailSender(email, "ModernMobiles Verification OTP", otp);
    } catch (error) {
        console.log(error);
        throw error

    }
}

otpSchema.pre("save", async function (next) {
    await sendMail(this.email, this.otp)
    next()
})

module.exports = mongoose.model("OTPModel", otpSchema)