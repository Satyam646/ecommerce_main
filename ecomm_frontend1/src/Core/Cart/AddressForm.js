import { Stack, TextField, Typography } from "@mui/material";

export default function AddressForm({ address, setAddress }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Stack spacing={2}>
            <Typography variant="h6">Shipping Address</Typography>
            {["street", "city", "state", "pincode"].map(field => (
                <TextField
                    key={field}
                    name={field}
                    label={field[0].toUpperCase() + field.slice(1)}
                    variant="outlined"
                    fullWidth
                    value={address[field]}
                    onChange={handleChange}
                />
            ))}
        </Stack>
    );
}
