import react, { useEffect,useState } from "react"
import { Box, Button, Stack, TextField, Typography } from "@mui/material"
import { getProductOnCart } from "./AddItem"
import Grid from "@mui/material/Grid2";
import Card from "../Home/Cards";
import { isAuthenticated } from "../../Common/auth/auth";
import { useNavigate } from "react-router-dom";
import { getApiAuth } from "../../api";
import DropIn from 'braintree-web-drop-in-react';
import { postAuthApi } from "../../api";
export default function Cart(){
    const [products,setProducts] = useState();
    const navigate = useNavigate();
    const [data,setData] = useState({
        success:false,
        clientToken:null,
        error:'',
        instance:{},
        address:'',
    });
    const userId=JSON.parse(isAuthenticated())?.user._id;
    const token= JSON.parse(isAuthenticated())?.token;
    const UpdateProducts = ()=>{
    let arr=getProductOnCart();
    setProducts(arr);
    }
    const buy = () =>{
        let nonce;
        let getNonce = data.instance?.requestPaymentMethod().then(data=>{
            console.log("data",data)
            nonce = data.nonce
            const paymentData ={
                paymentMethodNonce: nonce,
                amount:getTotal(),
            };
            processPayment(paymentData);
            console.log('send nonce and total to process: ',nonce,getTotal());
        }).catch(error=>{
            console.log('dropin error: ', error)
            setData({...data,error:error})
        })
    }
   const manageOrders = async (id,amount) =>{
   const createOrder = {
    products:products,
    transaction_id:id,
    amount:amount,
    address:data.address,

   }
   const token=JSON.parse(isAuthenticated()).token;
   const result = await postAuthApi(`order/create/${userId}`,createOrder,token);
   //console.log(result);
   const res=await result.json(); 
   if(!result.ok){
    console.log("response",res);
   } else{
    console.log("response",res);
   }
   }
   const processPayment = async (paymentData) =>{
                //    const body={
                //      name:values.name
                // braintree/payment/
                //    }      
                   const token=JSON.parse(isAuthenticated()).token;
                   const result = await postAuthApi(`braintree/payment/${userId}`,paymentData,token);
                   //   console.log(result);  
                   const res=await result.json(); 
                   if(!result.ok){
                     // console.log("err",await result.json());
                     console.log("response",res);
                     setData({...data,error:res?.error,loading:false})
                   }else{
                    console.log("response",res);
                     setData({...data,success:true,loading:false});
                     manageOrders(res?.transaction?.id,res?.transaction?.amount);
                     emptyCart();
                     window.location.reload();
                   }
    };
    const emptyCart=()=>{
        //   if(typeofwindow()!=undefined){
            localStorage.removeItem('cart');
            // window.location.reload();
        //   }
    }
    const getTotal = () =>{
        const value= products?.reduce((acc,currval) => acc+(currval.count*currval.price),0);
        // setValue(value);
        return value;
    }
    const getToken = () => {
               getApiAuth(`braintree/getToken/${userId}`,token).then(data=>{
                                 if(data?.error){
                                    setData({...data,error:data?.error});
                                 }else{
                                     setData({clientToken:data?.clientToken});
                                 }
                             })
    }
    const handleAddress = (event) =>{
      setData({...data,address:event.target.value});
    }
const checkOut= () =>{
   return (
    <Stack>
       <Typography variant="h5">Total Item Summary</Typography>
       <Typography>Total Price:${getTotal()}</Typography>
       <Typography>Add Address</Typography>
       <textarea name="address" label="address" rows="4" cols="50" onChange={handleAddress}></textarea>
       {data.success&&<Stack sx={{bgcolor:"green",height:"30px",color:"White",padding:"2px 0px 0px 10px",boxSizing:"border-box"}}><Typography sx={{}}>Payment successfull!!</Typography></Stack>}
       {isAuthenticated()&&showDropIn()}
       {!isAuthenticated()&&<Button variant="contained" onClick={()=>{
        navigate("/signin")
       }}>please Signin..</Button>}
    </Stack>
   )
    }
    useEffect(()=>{
        UpdateProducts();
        getToken();
    },[])
    const showDropIn = () =>{
        return (
            (data?.clientToken!=null&&products.length>0)?(
                <div>
                         {data?.clientToken&&<DropIn options={{
                            authorization: data?.clientToken,
                            googlePay: {
                                // environment: "TEST",
                                // googlePayVersion: 2,
                                // transactionInfo: {
                                // totalPriceStatus: 'FINAL',
                                // totalPrice: '1',
                                // currencyCode: 'USD'
                                // },
                                flow:"vault"
                            }
                         }} 
                         onInstance={(instance) =>{ data.instance=instance
                            // console.log("DropIn instance created", instance);
                            // setData({...data,instance:instance})}}
                         }}
                          /> }
                         <Button variant="contained" sx={{alignSelf:"left",bgcolor:"green"}} onClick={buy} fullWidth>Pay</Button>
                </div>
            ):null
        )
    }
    console.log(data?.clientToken,"hii")
    return (
        <Stack minHeight="70vh" sx={{padding:"5px"}}>
            {products?.length==0?<h5>Your Cart is empty... continue shopping</h5>:
            <Grid container spacing={1}>
            <Grid size={4}>
                <Stack spacing={1} sx={{padding:"0px 120px 0px 0px"}}>
                {products?.map((product,indx)=>
                         <Card key={indx} product={product} onCart={false} UpdateCart={UpdateProducts}/>
                )}
                </Stack>
            </Grid>
            <Grid  size={8}>
                {checkOut()}
            </Grid>
        </Grid>}
        </Stack>
    )
}

