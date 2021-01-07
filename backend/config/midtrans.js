import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

const generatepaymentmidtrans = async () => {
    const midtransclient = require('midtrans-client');

    const snap = new midtransclient.Snap({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY
    })

    const order = await Order
    const user = await User

    const parameter = {
        "transaction_details": {
            orderid: order._id,
            grossammount: order.totalPrice
        },
        "credit_card": {
            "secure": true
        },
        "customer_details": {
            first_name: user.name,
            last_name: user.name,
            email: user.email,
            phone: 0
        }
    };

    snap.createTransaction(parameter)
        .then((transaction) => {
            // transaction token
            const transactionToken = transaction.token;
           console.log(transactionToken)
        })

}

export default generatepaymentmidtrans;