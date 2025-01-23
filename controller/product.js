const { findByIdAndUpdate } = require("../models/Address.model");
const CartModel = require("../models/Cart.model");
const DataModel = require("../models/Data.model");
const UserModel = require("../models/User.model");


exports.getProductsByBrand = async (req, res) => {
    const allProduct = 'View All'
    try {
        const { brand } = req.params

        if (brand == allProduct) {
            const response = await DataModel.find()
            return res.status(200).json({
                success: true,
                message: "Data fetched successfully",
                response
            })
        }


        const response = await DataModel.find({ brand: brand });

        if (response.length === 0) {
            return res.status(200).json({
                success: true,
                message: "no data available",
                response
            })
        }

        res.status(200).json({
            success: true,
            message: "Data fetched successfully",
            response
        })
    } catch (error) {
        console.log("contoller->products->getProductsByBrand:", error);
        res.status(500).json({
            success: false,
            message: "failed to fetch products"
        })

    }
}

exports.getProductById = async (req, res) => {
    try {
        const { productId } = req.body

        const product = await DataModel.findById(productId)

        if (!product) {
            return res.status(500).json({
                success: false,
                message: "products not available"
            })
        }

        res.status(200).json({
            success: true,
            message: "product fetched successfully",
            product
        })

    } catch (error) {
        console.log("contoller->products->getProductById:", error);
        res.status(500).json({
            success: false,
            message: "failed to fetch product"
        })
    }
}

exports.addWishlist = async (req, res) => {
    try {
        const { productId } = req.body
        const { user } = req


        const userData = await UserModel.findOneAndUpdate({ email: user.email },
            {
                $push: {
                    wishlist: productId
                }
            },
            { "new": true }
        ).populate("wishlist")

        res.status(200).json({
            success: true,
            message: "item added in wishlist",
            wishlist: userData?.wishlist
        })


    } catch (error) {
        console.log("addWishlist", error);

        res.status(400).json({
            success: false,
            message: "failed to add in wishlist"
        })
    }
}

exports.removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const { user } = req

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product Id required"
            })
        }

        const data = await UserModel.findOneAndUpdate({ email: user.email },
            {
                $pull: {
                    wishlist: productId
                }
            },
            { new: true }
        ).populate("wishlist")


        if (data) {
            res.status(200).json({
                success: true,
                message: "product removed from wishlist",
                data
            })
        }
    } catch (error) {
        console.log("removeFromWishlist", error);
        res.status(400).json({
            success: false,
            message: "something went wrong"
        })

    }

}

exports.fromWishlistToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const { user } = req

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product Id missing."
            })
        }

        const newCart = await CartModel.create({
            product: productId,
            user: user?._id,
        })

        const userData = await UserModel.findOneAndUpdate({ email: user.email }, {
            $pull: {
                wishlist: productId
            },
            $push: {
                cart: newCart._id
            }
        },
            { new: true })
            .populate("wishlist")
            .populate({
                path: "cart",
                populate: {
                    path: "product"
                }
            })
            .populate({
                path: "address",
                options: {
                    sort: { createdAt: -1 }
                }
            }
            )
            .exec()

        res.status(200).json({
            success: true,
            message: "Added to cart & removed from wishlist",
            cart: userData.cart,
            wishlist: userData.wishlist
        })

    } catch (error) {
        console.log("fromWishlistToCart", error);
        res.status(400).json({
            success: false,
            message: "error adding to cart "
        })

    }
}

exports.fromCartToWishlist = async (req, res) => {
    try {
        const { productId, cartId } = req.body;
        const { user } = req

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product Id missing."
            })
        }

        const deletedCart = await CartModel.findByIdAndDelete(cartId)

        const userData = await UserModel.findOneAndUpdate({ email: user.email }, {
            $pull: {
                cart: cartId
            },
            $push: {
                wishlist: productId
            }
        }, { new: true })
            .populate("wishlist")
            .populate({
                path: 'address',
                options: {
                    sort: { createdAt: -1 }
                },
            })
            .populate({
                path: "cart",
                populate: {
                    path: "product"
                }
            })
            .exec();

        res.status(200).json({
            success: true,
            message: "Added to wishlist & removed from cart",
            cart: userData.cart,
            wishlist: userData.wishlist
        })

    } catch (error) {
        console.log("fromCartToWishlist", error);
        res.status(400).json({
            success: false,
            message: "Unable to add in wishlist, Try Again "
        })

    }
}

exports.addToCart = async (req, res) => {

    try {

        const { productId } = req.body;
        const { user } = req

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product Id required"
            })
        }

        const newCart = await CartModel.create({
            product: productId,
            user: user?._id,
        })

        const userData = await UserModel.findByIdAndUpdate(user?._id, {
            $push: {
                cart: newCart?._id
            }
        }, { new: true }).populate({
            path: "cart",
            populate: {
                path: "product"
            }
        })

        if (userData) {
            res.status(200).json({
                success: true,
                message: "Added to Cart",
                cart: userData.cart
            })
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "Failed to add in Cart"
        })
    }

}

exports.removeFromCart = async (req, res) => {
    try {

        const { cartModelId } = req.body

        const { user } = req

        if (!cartModelId) {
            return res.status(400).json({
                success: false,
                message: "product Id required"
            })
        }

        const userData = await UserModel.findOneAndUpdate({ email: user.email },
            {
                $pull: {
                    cart: cartModelId
                }
            },
            { new: true }
        ).populate({
            path: 'address',
            options: {
                sort: { createdAt: -1 }
            },
        })
            .populate("wishlist")
            .populate({
                path: "cart",
                populate: {
                    path: "product"
                }
            })
            .exec();

        const cart = await CartModel.findByIdAndDelete(cartModelId)


        if (userData) {
            res.status(200).json({
                success: true,
                message: "product removed from cart",
                cart: userData.cart
            })
        }


    } catch (error) {
        console.log("removeFromCart", error);
        res.status(400).json({
            success: false,
            message: "Failed to remove from cart"
        })

    }
}

// Quantity
exports.productQuantity = async (req, res) => {
    try {

        const { cartId, operation } = req.body


        if (!cartId) {
            return res.status(404).json({
                success: false,
                message: "cart Id requires"
            })
        }

        const cart = await CartModel.findById(cartId)

        // increse
        if (operation == "1") {

            cart.quantity = cart.quantity + 1
            cart.save()

            if (cart) {
                return res.status(200).json({
                    success: true,
                    message: "quantity increased",
                    data: cart
                })
            }

        } else {
            // dec
            cart.quantity = cart.quantity - 1
            cart.save()

            if (cart) {
                return res.status(200).json({
                    success: true,
                    message: "quantity decreased",
                    data: cart
                })
            }

        }


    } catch (error) {
        console.log(error);
        res.status(501).json({
            success: false,
            message: "Unable to update quantity"
        })

    }
}


exports.fetchOrders = async (req, res) => {
    try {
        const { user } = req

        if (!user._id || !user.email) {
            return res.status(500).json({
                success: false,
                message: "User Id or Email required"
            })
        }

        const orderDetail = await UserModel.findById(user._id).select("orders")

            .populate({
                path: "orders",

                populate: {
                    path: "cartId",
                    populate: {
                        path: "product",
                    },
                },
            })
            .populate({
                path: "orders",
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: "address",
                }
            })
            .exec()

        res.status(200).json({
            success: true,
            message: "Orders Fetched Successfully",
            orders: orderDetail.orders
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed To Fetch Orders"
        })

    }
}