const User = require('../Models/users'); // importing models
const braintree = require('braintree');
require('dotenv').config()

// conection with braintree
const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox, // Ensure correct spelling
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

exports.generateToken = (req, res) => {
    gateway.clientToken.generate({}, (err, response) => {
        if (err) {
            return res.status(500).json({ error: "Failed to generate token", details: err });
        }
        res.status(200).json({ clientToken: response.clientToken });
    });
};
exports.processPayment = (req,res) =>{
    let nonceFromTheClient = req.body.paymentMethodNonce;
    let amountFromTheClient = req.body.amount;
    //charge
    let newTransaction = gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce:nonceFromTheClient,
        options:{
        submitForSettlement: true
        }
    },(error,result) => {
        if(error){
            res.status(500).json(500)
        }else{
            res.json(result);
        }
    })




}

