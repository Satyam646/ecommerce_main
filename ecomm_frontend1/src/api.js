import { API } from "./config";

export const getApi = (path) =>{
    return fetch(`${API}${path}`,{
        method:"GET"
    }).then(response=>{
        return response.json();
    }).catch(err => console.log(err));   
}
export const getApiAuth = (path,Auth) =>{
    return fetch(`${API}${path}`,{
        method:"GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization':`Bearer ${Auth}`,
        },
    }).then(response=>{
        return response.json();
    }).catch(err => console.log(err));   
}
export const postProductApi = (path,body) =>{
    return fetch(`${API}${path}`,{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(body)
    }).then(response=>{
        return response.json();
    }).catch(err => console.log(err));   
}
export async function postFormData(path,body,Auth){
    const response = await fetch(`${API}${path}`, {
        method: 'POST',
        body:body,
        headers: {
            'Authorization':`Bearer ${Auth}`,
            // 'Content-Type':'multipart/form-data;boundary=<calculated when request is sent>'// not required in the case of uploading data
        },
        
    });

    // if (!response.ok) {
    //     throw new Error(`HTTP error! Status: ${response}`);
    // }
    const result = await response;
    // console.log('Data posted successfully:', result);
    return result; // Return the parsed result
}
export async function putFormData(path,body,Auth){
    const response = await fetch(`${API}${path}`, {
        method: 'PUT',
        body:body,
        headers: {
            'Authorization':`Bearer ${Auth}`,
            // 'Content-Type':'multipart/form-data;boundary=<calculated when request is sent>'// not required in the case of uploading data
        },
        
    });

    // if (!response.ok) {
    //     throw new Error(`HTTP error! Status: ${response}`);
    // }
    const result = await response;
    // console.log('Data posted successfully:', result);
    return result; // Return the parsed result
}
export async function postAuthApi(path,body,Auth){
    const response = await fetch(`${API}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${Auth}`
        },
        body: JSON.stringify(body),
    });

    // if (!response.ok) {
    //     throw new Error(`HTTP error! Status: ${response}`);
    // }
    const result = await response;
    // console.log('Data posted successfully:', result);
    return result; // Return the parsed result
}

export async function postApi(path,body){
        const response = await fetch(`${API}${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        // if (!response.ok) {
        //     throw new Error(`HTTP error! Status: ${response}`);
        // }
        const result = await response;
        // console.log('Data posted successfully:', result);
        return result; // Return the parsed result
}
export const updateOrderStatus = (userId,token,orderId,status) =>{
    return fetch(`${API}order/${orderId}/status/${userId}`,{
        method:"PUT",
        headers:{
            Accept:"application/json",
            "Content-Type":'application/json',
            Authorization:`Bearer ${token}`
        },
        body:JSON.stringify({status,orderId})
    }, 
   ).then(response=>{
   return response.json(); 
   }).catch(err=>console.log(err));
}

