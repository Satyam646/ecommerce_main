import React from "react";
import {Typography,Stack,Container} from "@mui/material"

const Footer = () => (
    <Stack height="20vh" width="100%"sx={{ backgroundColor: "#333B6A", color: "white", py: 3 ,boxSizing:"border-box", textAlign: "center" }}>
      <Typography variant="h6">Book Becho</Typography>
      <Typography variant="body2">Your trusted marketplace for buying and selling books</Typography>
      <Typography variant="body2">Contact: support@bookbecho.com | +91 98765 43210</Typography>
      <Typography variant="body2">&copy; {new Date().getFullYear()} Book Becho. All Rights Reserved.</Typography>
    </Stack>
  );
  export default Footer;
