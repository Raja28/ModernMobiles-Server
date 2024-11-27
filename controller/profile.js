const AddressModel = require("../models/Address.model")
const UserModel = require("../models/User.model")

exports.updateUser = async (req, res) => {
    try {
        const { firstName = "", lastName = "", contact = '', email = "" } = req.body
        const { user } = req

        if (!firstName && !lastName && !contact && !email) {
            return res.status(403).json({
                success: false,
                message: 'user data required'
            })
        }

        const userData = await UserModel.findOne({ email: user.email })
        if (firstName) {
            userData.firstName = firstName
        }
        if (lastName) {
            userData.lastName = lastName
        }
        if (contact) {
            userData.contact = parseInt(contact)
        }
        if (email) {
            userData.email = email
        }

        userData.save()

        res.status(200).json({
            success: true,
            message: " Address updated successfully",
            user: userData
        })

    } catch (error) {
        console.log("error updating user data ", error);

        res.status(500).json({
            success: false,
            message: "Error while updating user"
        })
    }
}

exports.addAddress = async (req, res) => {

    try {
        const { firstName, lastName, contact, address, state, city, pinCode } = req.body
        const { user } = req

        if (!firstName || !lastName || !contact || !address || !state || !city || !pinCode) {
            return res.status(403).json({
                success: false,
                message: 'All feilds are required'
            })
        }

        const newAddress = await AddressModel.create({
            firstName,
            lastName,
            contact: parseInt(contact),
            address,
            state,
            city,
            pinCode
        })

        const userData = await UserModel.findOneAndUpdate({ email: user.email }, {
            $push: {
                address: newAddress._id
            }
        },
            { "new": true }
        ).populate({
            path: "address",
            options:{sort: {'createdAt': -1}}
        })
        // .sort({createdAt: -1})
        //.populate({path: 'address', options: { sort: {createdAt: -1} } })
        // const sortedAddress = userData.address.sort((add1, add2) => add2.createdAt - add1.createdAt)

        if (userData) {
            res.status(200).json({
                success: true,
                message: "Address Added Successfully",
                address: userData.address
                // address: userData.address
            })
        }

    } catch (error) {
        console.log(error);

        return res.status(501).json({
            success: false,
            message: "error while saving (501). Try again"
        })


    }
}

exports.deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.body
        const { user } = req


        const deletedAddress = await AddressModel.findByIdAndDelete(addressId);
        // console.log("deletedAddress", deletedAddress);

        const userData = await UserModel.findOneAndUpdate({ _id: user._id },
            {
                $pull: {
                    address: addressId
                }
            }
        ).populate("address");

        // console.log("userData", userData);

        const sortedAddress = userData?.address.sort((add1, add2) => add2.createdAt - add1.createdAt)
        // console.log("sortedAddress", sortedAddress);

        res.status(200).json({
            success: true,
            message: " Address removed successfully",
            address: sortedAddress,
            deletedAddress
        })

    } catch (error) {
        console.log("error removing address ", error);

        res.status(500).json({
            success: false,
            message: "Error while deleting address"
        })

    }
}

exports.updateAddress = async (req, res) => {
    try {

        const { firstName, lastName, contact, address, state, city, pinCode, addressId } = req.body
        const { user } = req;

        if (!addressId) {
            return res.status(404).json({
                success: false,
                message: "Address Id Required"
            })
        }

        const addressData = await AddressModel.findById(addressId)

        if (firstName) {
            addressData.firstName = firstName
        }
        if (lastName) {
            addressData.lastName = lastName
        }
        if (contact) {
            addressData.contact = contact
        }
        if (contact) {
            addressData.address = address
        }
        if (state) {
            addressData.state = state
        }
        if (city) {
            addressData.city = city
        }
        if (pinCode) {
            addressData.pinCode = pinCode
        }
        addressData.save()

        const userData = await UserModel.findOne({ email: user.email }).populate("address")
        // .sort({createdAt: -1})
        //.populate({path: 'address', options: { sort: {createdAt: -1} } })
        const sortedAddress = userData.address.sort((add1, add2) => add2.createdAt - add1.createdAt)

        res.status(200).json({
            success: true,
            message: "Address Upadated Successfully",
            address: sortedAddress
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to Updated Address",
        })
    }
}