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
import  AddCategory from "./Admin/AddCategory";
import { AdminRoute } from "./Common/auth/adminRoute"
import AddProduct from "./Admin/AddProduct";
import Shop from "./Core/Shop/shop";
import SingleProduct from "./Core/SingleProduct/Singleproduct";
import Cart from "./Core/Cart/Cart";
import Orders from "./Admin/order";
import Profile from "./user/Profile";
import ManageProducts from "./Admin/ManageProduct";
import UpdateProduct from "./Admin/UpdateProduct";
import Footer  from "./Core/Footer/Footer";
import SalesDashboard from "./Core/SalesTracking/SalesDashboard"; 
export default function Path() {
  // const [user, setUser] = useState(null); // Initialize to null or some default value
  // useEffect(() => {
  //   // Fetch the authenticated user's role
  //   const fetchUserRole = async () => {
  //     // try {
  //       const authenticatedUser = await JSON.parse(isAuthenticated());
  //       setUser(authenticatedUser?.user?.role);
  //     // } catch (error) {
  //     //   console.error('Error fetching user role:', error);
  //     //   setUser(null); // Handle error case
  //     // }
  //   };
  //   fetchUserRole();
  // }, []);
  const user=JSON.parse(isAuthenticated())?.user?.role;
  // solve this error later that first time it is not showing that category name and user info
  return (
    <BrowserRouter>
      <Menu />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/shop' element={<Shop/>} />
        <Route
          path='/user/Dashboard'
          element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path='/admin/Dashboard'
          element={
            <AdminRoute>
              <AdminDashboard /> 
            </AdminRoute>
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
          path='/admin/ManageProducts'
          element={
            <AdminRoute>
              <ManageProducts/>
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
        <Route
          path='/admin/orders'
          element={
            <AdminRoute>
              <Orders/>
            </AdminRoute>
          }
        />
        <Route
          path='/admin/product/update/:productId'
          element={
            <AdminRoute>
              <UpdateProduct/>
            </AdminRoute>
          }
        />
        <Route
          path='/profile/:userId'
          element={
            <PrivateRoute>
             <Profile />
            </PrivateRoute>
          }
        />
         <Route
          path='/Cart'
          element={
            <PrivateRoute>
             <Cart/> 
            </PrivateRoute>
          }
        />
        {/* <Route path="/Cart" element={<Cart/>} /> */}
        <Route path="/product/:productId" element={<SingleProduct/>} />
        <Route path="/product/:productId" element={<SingleProduct/>} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/Signup' element={<Signup />} />
        <Route path='/SalesDashboard' element={<SalesDashboard />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}


