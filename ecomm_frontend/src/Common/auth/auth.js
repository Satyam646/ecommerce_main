import React from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../config";
export function signout(navigate) {
    return fetch((`${API}/signout`), {
        method: "GET"
    }).then(response => {
        navigate("/signin");
        localStorage.removeItem("jwt");
    }).catch(err => { console.log(err) });
}
export const authentication = (data) => {
    localStorage.setItem("jwt", JSON.stringify(data));
    localStorage.setItem("userId", data.user._id);
}
export const isAuthenticated = () => {
    const user = localStorage.getItem("jwt");
    if (user) {
        return user;
    } else {
        return false;
    }
}

