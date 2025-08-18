import React, { useEffect, useState } from "react";
import { Box, Button, Stack, TextField, Typography, Paper } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { getProductOnCart } from "./AddItem";
import Card from "../Home/Cards";
import { isAuthenticated } from "../../Common/auth/auth";
import { useNavigate } from "react-router-dom";
import { getApiAuth, postAuthApi } from "../../api";
import DropIn from 'braintree-web-drop-in-react';
export default function Cart() {
    const [products, setProducts] = useState([]);
    const [data, setData] = useState({
        success: false,
        clientToken: null,
        error: '',
        instance: null,
        address: { street: '', city: '', state: '', pincode: '' }
    });
    const [showPaymentUI, setShowPaymentUI] = useState(false);

    const navigate = useNavigate();
    const userId = JSON.parse(isAuthenticated())?.user._id;
    const token = JSON.parse(isAuthenticated())?.token;

    const updateProducts = () => {
        const arr = getProductOnCart();
        setProducts(arr || []);
    };

    const handleAddressChange = (event) => {
        const { name, value } = event.target;
        setData(prev => ({
            ...prev,
            address: { ...prev.address, [name]: value }
        }));
    };

    const getTotal = () => products.reduce((acc, curr) => acc + (curr.count * curr.price), 0);

    const proceedToPayment = () => {
        const { street, city, state, pincode } = data.address;
        if (!street || !city || !state || !pincode) {
            alert("Please fill all address fields.");
            return;
        }
        setShowPaymentUI(true);
    };

    const buy = () => {
        if (!data.instance) return;

        data.instance.requestPaymentMethod().then(paymentData => {
            const paymentInfo = {
                paymentMethodNonce: paymentData.nonce,
                amount: getTotal()
            };
            processPayment(paymentInfo);
        }).catch(error => {
            console.log('DropIn error:', error);
            setData(prev => ({ ...prev, error }));
        });
    };

    const processPayment = async (paymentData) => {
        const result = await postAuthApi(`braintree/payment/${userId}`, paymentData, token);
        const res = await result.json();

        if (!result.ok) {
            console.error("Payment Error:", res);
            setData(prev => ({ ...prev, error: res?.error }));
        } else {
            setData(prev => ({ ...prev, success: true }));
            manageOrders(res.transaction.id, res.transaction.amount);
            emptyCart();
            window.location.reload();
        }
    };

    const manageOrders = async (transactionId, amount) => {
        const { street, city, state, pincode } = data.address;
        const combinedAddress = `${street}, ${city}, ${state} - ${pincode}`;

        const order = {
            products,
            transaction_id: transactionId,
            amount,
            address: combinedAddress
        };

        const result = await postAuthApi(`order/create/${userId}`, order, token);
        const res = await result.json();
        console.log("Order Response:", res);
    };

    const emptyCart = () => {
        localStorage.removeItem('cart');
    };

    const getToken = () => {
        getApiAuth(`braintree/getToken/${userId}`, token).then(response => {
            if (response?.error) {
                setData(prev => ({ ...prev, error: response.error }));
            } else {
                setData(prev => ({ ...prev, clientToken: response.clientToken }));
            }
        });
    };

    const showDropIn = () => (
        data.clientToken && products.length > 0 && (
            <Box mt={2}>
                <DropIn
                    options={{ authorization: data.clientToken, googlePay: { flow: "vault" } }}
                    onInstance={(instance) => setData(prev => ({ ...prev, instance }))}
                />
                <Button variant="contained" color="success" onClick={buy} fullWidth>
                    Pay Now
                </Button>
            </Box>
        )
    );

    useEffect(() => {
        updateProducts();
        getToken();
    }, []);

    return (
        <Stack minHeight="70vh" sx={{ padding: "16px" }}>
            {products.length === 0 ? (
                <Typography variant="h6">Your Cart is empty... continue shopping!</Typography>
            ) : (
                <Grid container spacing={30}>
                    <Grid xs={12} md={3}>
                        <Stack spacing={2}>
                            {products.map((product, index) => (
                                <Card
                                    key={index}
                                    product={product}
                                    onCart={false}
                                    UpdateCart={updateProducts}
                                />
                            ))}
                        </Stack>
                    </Grid>

                    <Grid xs={12} md={9} display="flex">
                        <Stack elevation={3} sx={{ padding: 3, width: "800px" }}>
                            <Typography variant="h5" gutterBottom>Order Summary</Typography>
                            <Typography variant="subtitle1">Total Price: ${getTotal()}</Typography>

                            {!showPaymentUI ? (
                                <Box>
                                    <Box>
                                        <Typography variant="h6" mt={2}>Shipping Address</Typography>
                                        <Stack spacing={2} mt={1}>
                                            <TextField
                                                label="Street Address"
                                                name="street"
                                                value={data.address.street}
                                                onChange={handleAddressChange}
                                                fullWidth
                                            />
                                            <TextField
                                                label="City"
                                                name="city"
                                                value={data.address.city}
                                                onChange={handleAddressChange}
                                                fullWidth
                                            />
                                            <TextField
                                                label="State"
                                                name="state"
                                                value={data.address.state}
                                                onChange={handleAddressChange}
                                                fullWidth
                                            />
                                            <TextField
                                                label="Pincode"
                                                name="pincode"
                                                value={data.address.pincode}
                                                onChange={handleAddressChange}
                                                fullWidth
                                            />
                                        </Stack>
                                        {isAuthenticated() ? (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={proceedToPayment}
                                                fullWidth
                                                sx={{ mt: 3 }}
                                            >
                                                Proceed to Pay
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                onClick={() => navigate("/signin")}
                                                fullWidth
                                                sx={{ mt: 3 }}
                                            >
                                                Please Sign In
                                            </Button>
                                        )}
                                    </Box>


                                </Box>
                            ) : (
                                <>
                                    {showDropIn()}
                                    {data.success && (
                                        <Stack sx={{ bgcolor: "green", color: "white", p: 1, borderRadius: 1, mt: 2 }}>
                                            <Typography>Payment Successful!</Typography>
                                        </Stack>
                                    )}
                                </>
                            )}
                        </Stack>
                    </Grid>
                </Grid>
            )}
        </Stack>
    );
}
