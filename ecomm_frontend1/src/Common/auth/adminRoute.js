import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./auth";
export const AdminRoute = ({ children }) => {
    return (
        isAuthenticated() && JSON.parse(isAuthenticated())?.user?.role == 1 ? children : <Navigate to="/signin" replace />
    );
};