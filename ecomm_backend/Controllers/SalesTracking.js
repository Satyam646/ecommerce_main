const { Order } = require('../Models/order');

exports.getSalesSummary = async (req, res) => {
  try {
    const orders = await Order.find({ status: { $ne: "Cancelled" } });
    // console.log(orders);
    let totalRevenue = 0, totalItems = 0;

    orders.forEach(order => {
      if(order?.amount){
        totalRevenue+=order?.amount;
         console.log(totalRevenue);
      }
      order.products.forEach(item => {
        // totalRevenue += item?.amount;
        totalItems += item.count;
      });
    });

    const totalOrders = orders.length;
    const averageOrderValue = totalOrders ? (totalRevenue / totalOrders).toFixed(2) : 0;
    console.log(totalRevenue);
    res.json({ totalRevenue, totalOrders, totalItemsSold: totalItems, averageOrderValue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch sales summary" });
  }
};
exports.getSalesByDay = async (req, res) => {
  try {
    const dailySales = await Order.aggregate([
      {
        $match: { status: { $ne: "Cancelled" } }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: "$amount" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json(dailySales.map(day => ({ date: day._id, total: day.total })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch sales by day" });
  }
};
exports.getTopSellingProducts = async (req, res) => {
  try {
    const orders = await Order.find({ status: { $ne: "Cancelled" } });
    const productMap = {};
    orders.forEach(order => {
      order.products.forEach(item => {
        const name = item.name;
        if (!productMap[name]) {
          productMap[name] = 0;
        }
        productMap[name] += item.count;
      });
    });

     sortedProducts = Object.entries(productMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.json(sortedProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch top products" });
  }
};
exports.getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("amount status createdAt");

    const formatted = orders.map(o => ({
      orderId: o._id,
      amount: o.amount,
      status: o.status,
      date: o.createdAt.toISOString().split('T')[0]
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch recent orders" });
  }
};

