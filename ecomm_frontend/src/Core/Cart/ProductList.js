import { Stack } from "@mui/material";
import Card from "../Home/Cards";

export default function ProductList({ products, updateCart }) {
    return (
        <Stack spacing={2}>
            {products.map((product, index) => (
                <Card key={index} product={product} onCart={false} UpdateCart={updateCart} />
            ))}
        </Stack>
    );
}
