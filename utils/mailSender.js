const nodemailer = require("nodemailer")
require("dotenv").config()

exports.otpMailSender = async (email, title, otp) => {

    try {

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: '"Modern Mobiles || Raja 👻"', // sender address
            to: email, // list of receivers
            subject: "Modern Mobiles", // Subject line
            text: "Verification Mail", // plain text body
            html: `ModernMobiles verification OTP: ${otp} valid for 5 minutes.`, // html body
        });

        // if(info){
        //     res.status(200).json({
        //         success: true,
        //         message: "OTP sent successfully",
        //     })
        // }

        return info

    } catch (error) {

    }

}

exports.orderMailSender = async (email, title, body) => {
    try {
console.log("Sending orderf mail to", email);

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: `"Modern Mobiles👻" <${process.env.MAIL_USER}>` , // sender address
            to: email, // list of receivers
            subject: `${title}`, // Subject line
            html: `${body}`, // html body
        });

        return info

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to Send Order Mail"
        })
    }
}