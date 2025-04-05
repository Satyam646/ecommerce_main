import React from "react"
import {Link, } from 'react-router-dom' // link is used to avoid reloading a page as href relods the page withRouter used to 
import Stack from '@mui/material/Stack';
import "./Menu.css"
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import IconButton from '@mui/material/IconButton';
import { signout } from "../../Common/auth/auth";
import { ThemeContext } from '../../Common/ThemeContext/ThemeContext';
// import { Typography } from "@mui/material";
import bookBecho  from "../../Image/BookBecho.png"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useLocation,useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import { isAuthenticated } from "../../Common/auth/auth";
import {Button,TextField} from "@mui/material"
import { useContext } from 'react';
import { itemTotal } from "../Cart/AddItem";
import { Typography } from "@mui/material";
import { getApi } from "../../api"
export default function Menu(){
  const {SnackBar,toggleSnackBar,setSearchData,searchData,searchedProduct,setsearchedProduct,searched,setSearched} = useContext(ThemeContext)
  const navigate = useNavigate();
  //  const jwt=localStorage.getItem("jwt");
    const LinkStyle={
        textDecoration:"none"
    }
    const location=useLocation();
    console.log(location);
    const isActive=(location,path)=>{
           if(location.pathname===path){
            return "white"
           }else{
            return ""
           }
    }
    const handleSearch=(event)=>{
      console.log("val",event.target.value);
      setSearchData(event.target.value);
      getSearchData(event.target.value);
  }
    const getSearchData=(e)=>{
      // e.preventDefault();
      setSearched(true);
      const query={search:searchData}
      const queryString = new URLSearchParams(query).toString();
      getApi(`searchBy?${queryString}`).then(data=>{
          if(data?.error){
            //  setValues({...values,error:data?.error});
          }
          else {
            setsearchedProduct(data);
          }
      })
     }
  const SearchBar=()=>{
    return(
    
       <form onSubmit={getSearchData}>
           <Stack direction="row" alignItems="center" justifyContent="flex-end"  >
       {/* <Stack> */}
       {/* <FormControl sx={{width:"100px"}}>
           <InputLabel>Select </InputLabel> */}
    {/* <Select
          value={selectedCategory}
          label="Select"
          onChange={handleCategory}
    >
   {categories?.map((data,indx)=>
    (<MenuItem key={indx} value={data?._id}>{data?.name}</MenuItem>)
   )}
   </Select> */}
   {/* </FormControl> */}
   {/* </Stack> */}
    <TextField  
      sx={{color:"white",input: { color: 'white' }}}
      variant="standard"
      size="small"
   //    label="Search"
      placeholder="search"
      value={searchData}
      onChange={handleSearch} />
      <Button variant="" type="submit"><SearchIcon sx={{color:"white"}}/></Button>
      </Stack>
      </form>

    )
}
 const user=JSON.parse(isAuthenticated())?.user?.role;
    return (
      <Stack   direction="row"  alignItems="center"  justifyContent="space-between" sx={{height:"10vh",bgcolor:"#333B6A", padding:"20px 20px 0px 10px",boxSizing:"border-box",position: "sticky",
        top: 0 }} >
        <Stack direction="row" spacing={5} alignItems="center">
        <Stack>
        <img src={bookBecho} alt="/" height="30px" width="90px" />
        </Stack>
       {/* {isAuthenticated()===false&&<Stack sx={{bgcolor:isActive(location,"/signin")}} ><Link to="/signin"   style={LinkStyle}>Signin</Link></Stack>}
       {isAuthenticated()===false&&<Stack sx={{bgcolor:isActive(location,"/signup")}}><Link to="/signup" style={LinkStyle}>Signup</Link></Stack>}
       {<Stack sx={{bgcolor:isActive(location,"/Dashboard")}}><Link to="/Dashboard" style={LinkStyle}>Dashboard</Link></Stack>} */}
       <Stack direction="row" spacing={3}>
       <Stack><Link to="/" style={LinkStyle}><Typography sx={{borderBottom:isActive(location,"/")?`2px solid ${isActive(location,"/")}`:"",color:isActive(location,"/")}}>Home</Typography></Link></Stack>
       <Stack><Link to="/shop" style={LinkStyle} ><Typography sx={{borderBottom:isActive(location,"/shop")?`2px solid ${isActive(location,"/shop")}`:"",color:isActive(location,"/shop")}}>Shop</Typography></Link></Stack>
       </Stack>
       </Stack>
       <Stack direction ="row" spacing={2} alignItems="center">
       {SearchBar()}
       <Stack ><Link to="/Cart" style={LinkStyle}><ShoppingCartIcon sx={{borderBottom:isActive(location,"/Cart")?`2px solid ${isActive(location,"/Cart")}`:"",color:isActive(location,"/Cart")}}/><sup>{itemTotal()}</sup></Link></Stack>
       <Stack ><Link to={JSON.parse(isAuthenticated())?.user?.role==0?"/user/Dashboard":"/admin/Dashboard"} style={LinkStyle}><AccountCircleIcon sx={{color:isActive(location,"/Dashboard")}}/></Link></Stack>
       {/* {isAuthenticated()&&<Stack sx={{bgcolor:'red', cursor:"pointer"}}  onClick={()=>{signout(navigate)}}>signout</Stack>} //will be on user page */}
       </Stack>
      </Stack>
    )
}