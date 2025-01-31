import React from "react";
import {API} from "../config"
export default function Signin(){
   console.log("API REQUEST",process.env.REACT_APP_API_URL)
    return (
        <div>
        signin page...
        <div>{API}</div>
        <div>{process.env.REACT_APP_API_URL}</div>
        </div>
    )
}
