import { Button, Stack, Typography, CircularProgress } from "@mui/material";
export default function CheckoutSummary({ total, addressValid, onPay, loading }) {
    return (
        <Stack spacing={2}>
            <Typography variant="h5">Total: ${total}</Typography>
            {addressValid ? (
                ""
            ) : (
                <Typography variant="body2" color="error">Please fill out the address.</Typography>
            )}
        </Stack>
    );
}
