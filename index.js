const { connectDB } = require("./database/connection");

const express = require("express")
const bodyParser = require("body-parser");
const DataModel = require("./models/User.model");

const app = express()
app.use(bodyParser.json())
app.use(express.json())
require("dotenv").config()
PORT = process.env.PORT || 4000

const cors = require("cors")
app.use(cors())

app.get("/modern-mobiles", (req, res) => {
    res.status(200).json({
        message: "Default route - ModernMobiles",
        success: true
    })
})

const productRoutes = require("./routes/products");
const authUser = require("./routes/User")
const { uploadData } = require("./controller/uploadData");
const profileRoutes = require("./routes/profile");
const paymentRoutes = require("./routes/payment");

// app.use("/modern-mobiles/productList/", productRoutes)
app.use("/modern-mobiles/product/", productRoutes)
app.post("/modern-mobiles/upload/", uploadData)
app.use("/modern-mobiles/auth/", authUser)
app.use("/modern-mobiles/profile/", profileRoutes)
app.use("/modern-mobiles/payment/", paymentRoutes)

connectDB()

app.listen(PORT, () => {
    console.log("Modern mobiles server running on port", PORT);
})

