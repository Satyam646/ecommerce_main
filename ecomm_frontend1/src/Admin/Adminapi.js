import { API } from "../config";

export const getAllProducts = () =>{
    return fetch(`${API}product?limit=undefined`,{
        method:"GET",
        headers:{
            Accept:"application/json",
            // "Content-Type":"application/json",
            // Authorization: `Bearer ${token}`
        },
    }).then(response=>{
        return response.json();
    })
    .catch(err=>console.log(err));
};

export const getSingleProduct = (productId) =>{
    return fetch(`${API}product/${productId}`,{
        method:"GET",
        // headers:{
        //     Accept:"application/json",
        //     "Content-Type":"application/json",
        //     Authorization: `Bearer ${token}`
        // },
    }).then(response=>{
        return response.json();
    })
    .catch(err=>console.log(err));
};
export const DeleteProduct = (productId,userId,token) =>{
    return fetch(`${API}product/delete/${userId}/${productId}`,{
        method:"DELETE",
        headers:{
            Accept:"application/json",
            "Content-Type":'application/json',
            Authorization:`Bearer ${token}`
        },
    }, 
   ).then(response=>{
   return response.json(); 
   }).catch(err=>console.log(err));
}
export const UpdateProduct = (productId,userId,token,product) =>{
    return fetch(`${API}product/${productId}/${userId}`,{
        method:"PUT",
        headers:{
            Accept:"application/json",
            // "Content-Type":'application/json',
            Authorization:`Bearer ${token}`
        },
        body:product
    }, 
   ).then(response=>{
   return response.json(); 
   }).catch(err=>console.log(err));
}