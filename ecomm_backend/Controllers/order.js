
const {CartItem, Order } = require("../Models/order");
exports.create = async (req,res) => {
    try {
        req.body.user = req.profile;
        const order = new Order(req.body);
        const data = await order.save();
        res.json(data);
    } catch (error) {
        res.status(400).json({
            error: error,
        });
    }
};
exports.orderById = async (req, res, next, id) => {
    try {
        const order = await Order.findById(id).populate("products.product", "name price").exec();
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        req.order = order;
        next();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.listOrders = async (req,res) =>{
 try{ 
    // find() It will display all orders in the database.
     const order=await Order.find().populate('user',"_id name address").sort({createdAt:-1});
     return res.status(200).json(order);
    } catch(error){
          return res.status()
    }
}
exports.getStatusValues = (req,res) => {
    return res.status(200).json(Order.schema.path('status').enumValues);
}
exports.updateOrderStatus = async (req,res) => {
    try{
     const order=await Order.findByIdAndUpdate({_id:req.body.orderId},{$set:{status:req.body.status}});
     return res.status(200).send(order);
    }
    catch(error){
        console.log(error);
    return res.status(400).json(error);
    }
}
