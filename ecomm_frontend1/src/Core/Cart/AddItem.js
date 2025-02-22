export const AddItem = (item) =>{
    let cart=[]
    if(typeof window !== 'undefined'){
        if(localStorage.getItem('cart')){
            cart=JSON.parse(localStorage.getItem('cart'))
        }
    }
    cart.push({
        ...item,
        count:1
    })
    //remove duplicates
    //build Array  from new set and turn it back into Array using Array.form
    // so that later we can re-map it
    // new set will only allow unique values in it
    //so pass ids of each object/product
    //if loop tries to add the same value again it,ll get ignored
    //...with the array of ids we got on when first map() was used
    // run map() on it again and return the actual product from the cart
    cart = Array.from(new Set(cart.map((p)=>(p._id)))).map(id=>{
        return cart.find(p=>p._id === id);
    });
    localStorage.setItem('cart',JSON.stringify(cart));
}
export const itemTotal = () =>{  
    if( typeof window !== "undefined"){
        if(localStorage.getItem("cart")){
            return JSON.parse(localStorage.getItem("cart")).length;
        }
    }
    return 0;
}
export const getProductOnCart = () =>{  
    if( typeof window !== "undefined"){
        if(localStorage.getItem("cart")){
            return JSON.parse(localStorage.getItem("cart"));
        }
    }
    return [];
}
export const updateItemCount = (id,value) =>{  
    if( typeof window !== "undefined"){
        if(localStorage.getItem("cart")){
            const cart=JSON.parse(localStorage.getItem("cart"));
            cart.map((products,i)=>{
                if(products._id==id){
                    cart[i].count=value;
                }
        })
        localStorage.setItem('cart',JSON.stringify(cart));
        }
    }
    // return [];
}
export const removeItemFromCart = (id) =>{
     let cart=[];
       if( typeof window !== "undefined" ){
        if(localStorage.getItem("cart")){
             cart = JSON.parse(localStorage.getItem("cart"));
             cart.map((products,i)=>{
                if(products._id==id){
                    cart.splice(i,1);
                }})
            localStorage.setItem("cart",JSON.stringify(cart));
        }
       }
       return cart;
}
