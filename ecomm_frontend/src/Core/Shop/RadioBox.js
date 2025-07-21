import react,{ useState } from "react"
import {Stack,FormControl,FormControlLabel,RadioGroup,Radio,FormLabel} from "@mui/material"
export default  function RadioBox({prices,handleFilters}){
    const [checkedData,setCheckedData] = useState(prices[0]?.id||0);
    const handleChange=(event)=>{
        console.log(event.target.value);
        setCheckedData(event.target.value);
        handleFilters(event.target.value,"price")
    }
    return (
    <Stack>
    <FormControl>
    <FormLabel>Filter By Prices</FormLabel>
    <RadioGroup
    value={checkedData}
    onChange={handleChange}
    >
    {prices.map((p,i)=>
        <FormControlLabel key={i} value={p.id} control={<Radio />} label={p.name} />
    )}
    </RadioGroup>
    </FormControl>
    </Stack>
    )
}