const express = require("express")
const router = express.Router()

const { getProductsByBrand,
    getProductById,
    addWishlist,
    removeFromWishlist,
    fromWishlistToCart,
    fromCartToWishlist,
    addToCart,
    removeFromCart,
    productQuantity, 
    fetchOrders} = require("../controller/product")

const { authorize } = require("../middleware/auth")
const { TestingCode } = require("../controller/payment")

router.get("/get/:brand", getProductsByBrand)
router.post("/productDetails/", authorize, getProductById)
router.post("/addWishlist", authorize, addWishlist)
router.post("/removeFromWishlist", authorize, removeFromWishlist)

router.post("/add-to-cart", authorize, addToCart)

router.post("/remove-from-cart", authorize, removeFromCart)
router.post("/wishlist-to-cart", authorize, fromWishlistToCart)
router.post("/cart-to-wishlist", authorize, fromCartToWishlist)

router.post("/product-quantity/", authorize, productQuantity)

router.get("/orderDetails", authorize, fetchOrders)

// router.post("/place-order", authorize,)
// router.get("/get-orderDetails", TestingCode)



module.exports = router