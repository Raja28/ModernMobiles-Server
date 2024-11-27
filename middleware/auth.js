
const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.authorize = async (req, res, next) => {
    try {
        
        const token = req.body.token || req.header('Authorization').replace("Bearer ", "")
        
        if (!token) {
            return res.status(401).json({
                sucess: "false",
                message: "token missing"
            })
        }

        try {
            const tokenData = jwt.verify(token, process.env.JWT_SECRET)
            req.user = tokenData

            next()

        } catch (error) {
            console.log(error);

            res.status(403).json({
                success: false,
                message: "invalid token or expired"
            })
        }

    } catch (error) {
        console.log(error);

        res.status(401).json({
            success: false,
            message: "error while validating token"
        })
    }
}