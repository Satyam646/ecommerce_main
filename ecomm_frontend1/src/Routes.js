import React, { useEffect,useState } from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Signin from "./user/Signin"
import Signup from "./user/Signup"
import Home from "./Core/Home/Home"
import Menu from "./Core/Menu/Menu"
import UserDashboard from "./user/userDashboard";
import { PrivateRoute }  from "./Common/auth/PrivateRoutes"
import { isAuthenticated } from "./Common/auth/auth";
import  AdminDashboard from "./user/AdminDashboard";
import AddCategory from "./Admin/AddCategory";
import { AdminRoute } from "./Common/auth/adminRoute"
import AddProduct from "./Admin/AddProduct";

export default function Path() {
  const [user, setUser] = useState(null); // Initialize to null or some default value
  useEffect(() => {
    // Fetch the authenticated user's role
    const fetchUserRole = async () => {
      // try {
        const authenticatedUser = await JSON.parse(isAuthenticated());
        setUser(authenticatedUser?.user.role);
      // } catch (error) {
      //   console.error('Error fetching user role:', error);
      //   setUser(null); // Handle error case
      // }
    };
    fetchUserRole();
  }, []);
  
  return (
    <BrowserRouter>
      <Menu />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route
          path='/Dashboard'
          element={
            <PrivateRoute>
              {user === 1 ? <AdminDashboard /> : <UserDashboard />}
            </PrivateRoute>
          }
        />
        <Route
          path='/admin/AddCategory'
          element={
            <AdminRoute>
              <AddCategory/>
            </AdminRoute>
          }
        />
        <Route
          path='/admin/AddProduct'
          element={
            <AdminRoute>
              <AddProduct/>
            </AdminRoute>
          }
        />
        <Route path='/Signin' element={<Signin />} />
        <Route path='/Signup' element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}


