
# 🛍️ Modern Mobiles (Server)

Welcome to **Modern Mobiles**! This is a full-stack e-commerce web application built using **node JS**, **Express** and **MongoDB** for Database. The app also features **OTP-based authentication** for a security.

---

## 📦 Project Overview

This app allows users to:
- Browse and filter products by **category** and **rating**
- Add items to **Cart** and **Wishlist**
- **Register and log in** using a **secure OTP system sent via email**
- **Make payments** using **Razorpay**

---

## Demo Link
Visit the website: [ModernMobiles](https://modern-mobiles.vercel.app/)

## Demo Video
Watch the short video (5 mins): [Loom Video](https://www.loom.com/share/704f6558ec294d14936c3a08c6e7c0a5?sid=6fb5a8ef-a03a-4fa8-8b1c-33a6766d5c2d)

---

## 🧰 Tech Stack

- **Backend:** Node JS, Express
- **Database:** MongoDB
- **Authentication:** JWT

---

📡 API Endpoints
These are the backend API routes that power the e-commerce application.

**1. Auth**

- Endpoint: POST /auth/sendOTP <br>
  Description: Sends and OTP to users mail.

- Endpoint: POST /auth/signup <br>
  Description: Performs signup procedure for user.

- Endpoint: POST /auth/login <br>
  Description: Logs in users in there account.

**2. Product**

- Endpoint: GET /product/get/:brand <br>
  Description: Get details of one product.

- Endpoint: POST /product/addWishlist <br>
  Description: Add product to users wishlist.

- Endpoint: POST /product/removeFromWishlist <br>
  Description:  Remove product to users wishlist.

- Endpoint: POST /product/add-to-cart <br>
  Description:  Add product to users cart.
  
- Endpoint: POST /product/remove-from-cart <br>
  Description:  Remove product to users cart.

- Endpoint: POST /product/product-quantity <br>
  Description:  Handles product to quantity.

- Endpoint: GET /product/orderDetails <br>
  Description:  Fetch order details.

**2. Payment**

- Endpoint: POST /payment/capturePayment <br>
  Description: Process details for payment.

- Endpoint: POST /payment/verifyPayment <br>
  Description: Verify payment details.



## 📝 Quick Start
To run the app locally we need front part and can get from the repo [Client](https://github.com/Raja28/ModernMobiles.git) and must add required data like  VITE_RAZORPAY_KEY and REACT_APP_RAZORPAY_SECRET

### SERVER
```
git clone: https://github.com/Raja28/ModernMobiles-Server.git
npm install
npm run dev
```

### CLIENT
Clone the repo with given line below and create env file add VITE_RAZORPAY_KEY and REACT_APP_RAZORPAY_SECRET

```
git clone: https://github.com/Raja28/ModernMobiles.git
npm install
npm run dev
```


