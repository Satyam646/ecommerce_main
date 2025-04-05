import react,{useState} from "react"
import {Stack,FormGroup,FormControlLabel,Checkbox} from "@mui/material"
let arr=[];
export default function CheckBox({categories,handleFilters}){
    const [selectedCategories, setSelectedCategories] = useState([]);
    const handleChange = (event) => {
        const value = event.target.value;
        if (event.target.checked){
            // Add the value to the array if checked
            arr.push(value);
            console.log(arr,"fggf")
            handleFilters(arr,"category");
            setSelectedCategories((prev) => [...prev, value]);
        }else{
            // Remove the value from the array if unchecked
            arr=arr.filter((item)=>item !== value);
            handleFilters(arr,"category");
            setSelectedCategories((prev) => prev.filter((item) => item !== value));  
        }
    };
   return(
    <Stack>
    <FormGroup>
    <Stack>Filter By Categories</Stack>
    {categories?.map((c,indx)=>(
        <FormControlLabel control={<Checkbox onChange={handleChange} value={c._id}/>}   label={c.name} />
    )  
    )}
    </FormGroup>
    </Stack>
    )
}