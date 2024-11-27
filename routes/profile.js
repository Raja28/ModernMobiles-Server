const express = require("express")
const router = express.Router()

const { addAddress, updateAddress, deleteAddress, updateUser } = require("../controller/profile")
const { authorize } = require("../middleware/auth")


router.post("/update-user", authorize, updateUser)
router.post("/add-address",authorize,  addAddress)
router.post("/update-address", authorize, updateAddress)
router.post("/delete-address", authorize, deleteAddress)

module.exports = router