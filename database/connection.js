const mongoose = require("mongoose");
require("dotenv").config()

exports.connectDB = async ()=>{
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017")
        
        if(connection) {
            console.log("DB Connected successfully.");  
        }
    } catch (error) {
        console.log(error);
        console.log("error while connecting to DB."); 
    }
}