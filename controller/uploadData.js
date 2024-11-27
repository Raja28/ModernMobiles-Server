const DataModel = require("../models/Data.model");
const fs = require("fs")

const jsonData = fs.readFileSync("appleData.json", "utf-8")
const mobileData = JSON.parse(jsonData)

exports.uploadData = async (req, res) => {
    // console.log("uploading files");

    try {
        for (const mobile of mobileData) {
            // console.log(mobile);

            const respone = await DataModel.create({
                brand: mobile.brand,
                model: mobile.model,
                series: mobile.series,
                title: mobile.title,
                imageURLLarge: mobile.imageURLLarge,
                deliveryCost: mobile.deliveryCost,
                rating: mobile.rating,

                spec: [...mobile.spec],
                price: mobile.price,
                category: mobile.category,
                colorsAvailable: [...mobile.colorsAvailable],
                modelNumber: mobile.modelNumber,
                imageGallery: mobile.imageGallery,
                additionalInformation: { ...mobile.additionalInformation },
                reviewVideoLink: mobile.reviewVideoLink
            })

            // console.log(res);
        }
        res.status(200).json({
            success: true,
            message: "DATA SEEDED SUCCESSFULLY"
        })
    } catch (error) {
        console.log(error);

    }
}