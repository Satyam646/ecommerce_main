import React from "react";
import { Navigate} from "react-router-dom";
import { isAuthenticated } from "./auth";


export const PrivateRoute = ({ children }) => {
    return (
        isAuthenticated() ? children : <Navigate to="/signin" replace/>
      
    );
  };

