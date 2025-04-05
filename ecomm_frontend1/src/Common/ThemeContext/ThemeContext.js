
import React,{createContext,useState} from 'react'

export const  ThemeProvider = ({children}) =>{
const [searchData,setData] = useState(""); 
const [searchedProduct,setsearchedProduct]=useState([]); 
const [searched,setSearched] = useState(false);  
const [SnackBar,setSnackBar] = useState({
    open:false,
    message:"",
});
const setSearchData = (message) =>{
    setData(message);
}
const toggleSnackBar = (open,message) =>{
      setSnackBar({...SnackBar,message:message,open:open});
}

return (
    <ThemeContext.Provider value={{SnackBar,toggleSnackBar,setSearchData,searchData,searchedProduct,setsearchedProduct,searched,setSearched}}>
        {children}
    </ThemeContext.Provider>
)

};

export const ThemeContext = createContext();

