import {React,useRef} from "react"
import {Link} from 'react-router-dom' // link is used to avoid reloading a page as href relods the page withRouter used to 
import Stack from '@mui/material/Stack';
import "./Menu.css"
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { ThemeContext } from '../../Common/ThemeContext/ThemeContext';
import bookBecho  from "../../Image/BookBecho.png"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useLocation,useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import { isAuthenticated } from "../../Common/auth/auth";
import {Button,TextField} from "@mui/material"
import { useContext } from 'react';
import { itemTotal } from "../Cart/AddItem";
import { Typography,Box,Badge ,InputAdornment} from "@mui/material";
import { getApi } from "../../api"
export default function Menu(){
  const {SnackBar,toggleSnackBar,setSearchData,searchData,searchedProduct,setsearchedProduct,searched,setSearched} = useContext(ThemeContext)
  const navigate = useNavigate();
  //  const jwt=localStorage.getItem("jwt");
    const LinkStyle={
        textDecoration:"none"
    }
    const debounceRef = useRef(null);
    const location=useLocation();
    console.log(location);
    const isActive=(location,path)=>{
           if(location.pathname===path){
            return "white"
           }else{
            return "grey"
           }
    }
    const handleSearch = (event) => {
      const value = event.target.value;
      setSearchData(value);
  
      // Clear previous timer
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      } //  this is used to clear delay of 300ms after every click
  
      // Set new debounce timer
      debounceRef.current = setTimeout(() => {
        getSearchData(value);
      }, 300); // 300ms debounce
    };
  
    const getSearchData = (value) => {
      setSearched(true);
      const query = { search: value };
      const queryString = new URLSearchParams(query).toString();
      getApi(`searchBy?${queryString}`).then(data => {
        if (!data?.error) {
          setsearchedProduct(data);
        }
      });
    };
const SearchBar = () => {
  return (
    <form onSubmit={getSearchData} style={{ width: '100%' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={1}
        sx={{ maxWidth: { xs: '100%', md: '300px' }, width: '100%' }}
      >
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search books..."
          value={searchData}
          onChange={handleSearch}
          InputProps={{
            sx: {
              borderRadius: '20px',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              '& .MuiInputBase-input': { color: 'white', pl: 2 },
              '& fieldset': { border: 'none' },
            },
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  type="submit"
                  sx={{
                    minWidth: '0',
                    p: 0,
                    color: 'white',
                    '&:hover': { bgcolor: 'transparent' },
                  }}
                >
                  <SearchIcon />
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </form>
  );
};
 const user=JSON.parse(isAuthenticated())?.user?.role;
    return (
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1300,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(51, 59, 106, 0.9)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
          p: { xs: '10px 15px', md: '15px 40px' },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          {/* Logo and Nav */}
          <Stack direction="row" alignItems="center" spacing={4} sx={{ flexWrap: 'wrap' }}>
            <Box component="img" src={bookBecho} alt="BookBecho" sx={{ height: 40, width: 120 }} />
  
            <Stack direction="row" spacing={3}>
              {[
                { label: 'Home', path: '/' },
                { label: 'Shop', path: '/shop' },
              ].map((link) => (
                <Link key={link.path} to={link.path} style={LinkStyle}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      position: 'relative',
                      
                      color: isActive(location, link.path),
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: isActive(location, link.path)=="white" ? '100%' : '0%',
                        height: '2px',
                        bottom: '-3px',
                        left: '0',
                        bgcolor: 'white',
                        transition: 'all 0.3s ease-in-out',
                      },
                      '&:hover::after': {
                        width: '100%',
                      },
                    }}
                  >
                    {link.label}
                  </Typography>
                </Link>
              ))}
            </Stack>
          </Stack>
  
          {/* Search, Cart, Account */}
          <Stack direction="row" spacing={2} alignItems="center" mt={{ xs: 1, md: 0 }}>
            {SearchBar()}
            {(JSON.parse(isAuthenticated())==false||JSON.parse(isAuthenticated())?.user?.role === 0)&&<Link to="/Cart" style={LinkStyle}>
              <Badge badgeContent={itemTotal()} color="error">
                <ShoppingCartIcon
                  sx={{
                    color: isActive(location, '/Cart')=="white"?"white":"grey",
                    // bgcolor:isActive(location, '/Cart'),
                    fontSize: 28,
                    transition: 'transform 0.2s ease',
                    '&:hover': { transform: 'scale(1.2)' },
                  }}
                />
              </Badge>
            </Link>}
  
            <Link
              to={
                JSON.parse(isAuthenticated())?.user?.role === 0
                  ? '/user/Dashboard'
                  : '/admin/Dashboard'
              }
              style={LinkStyle}
            >
              <AccountCircleIcon
                sx={{
                  color: isActive(location, JSON.parse(isAuthenticated())?.user?.role === 0
                  ? '/user/Dashboard'
                  : '/admin/Dashboard'),
                  fontSize: 30,
                  transition: 'transform 0.2s ease',
                  '&:hover': { transform: 'scale(1.2)' },
                }}
              />
            </Link>
          </Stack>
        </Stack>
      </Box>
    );
}