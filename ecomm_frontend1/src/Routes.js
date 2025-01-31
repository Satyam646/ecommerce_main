import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Signin from "./user/Signin"
import Signup from "./user/Signup"
import Home from "./Core/Home/Home"
import Menu from "./Core/Menu/Menu";

export default function Path(){
     return (
        <BrowserRouter>
        <Menu/>
        <Routes>
           
          <Route path='/'  element={<Home/>} /> 
          <Route path='/Signin'  element={<Signin/>} />  
          <Route path='/Signup'  element={<Signup/>} />  
        </Routes>
        </BrowserRouter>
     )
}


