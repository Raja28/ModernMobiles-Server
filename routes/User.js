
const express = require("express")
const router = express.Router()

const {sendOTP, signup, login} = require("../controller/auth") 

router.post("/sendOTP", sendOTP)
router.post("/signup", signup)
router.post("/login", login)


module.exports = router