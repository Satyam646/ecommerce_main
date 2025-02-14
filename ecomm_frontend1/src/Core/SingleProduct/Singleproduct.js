import react,{useState,useEffect} from "react"
import { Stack } from "@mui/material"
import { getApi } from "../../api"
import { useLocation } from "react-router-dom";
export default function SingleProduct(){
    const currentLocation = useLocation().pathname.split("/")[2];
    console.log("currentlocation",currentLocation);
    
    const [values,setValues] = useState({
        error:"",
        product:{},
    });

    const getProduct = ()=>{      
        getApi(`product/${currentLocation}`).then(data=>{
            if(data?.error){
               setValues({...values,error:data?.error});
            }else{
                setValues({...values,product:data});
            }
        })
    }
   useEffect(()=>{
    getProduct();
   },[])

    const showForm=()=>{
        return (
            <Stack>
            
            
            </Stack>
        )
     }
    return (
        <Stack>
        {JSON.stringify(values?.product)}
        </Stack>
    )
}
