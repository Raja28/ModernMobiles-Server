const express = require("express")
const router = express.Router()

const { authorize } = require("../middleware/auth")
const { capturePayment, verifyPaymnet, TestingCode } = require("../controller/payment")



router.post("/capturePayment", authorize, capturePayment)
router.post("/verifyPayment", authorize, verifyPaymnet)
// router.get("/TestingCode", TestingCode)

module.exports = router