const Razorpay = require('razorpay');
const Order = require('../models/order');
const sequelize = require('../util/database');


exports.purchasePremium = (async (req, res, next) => {

  try {
    var instance = new Razorpay({
      key_id: 'rzp_test_j490ZZAacXNHrx',
      key_secret: 'SSoDTAFJjBe28wQW0gSo7F2i'
    });


    var options = {
      amount: 2500,  // amount in the smallest currency unit
      currency: "INR"
    };
    instance.orders.create(options, function(err, order) {
      if(err){
        throw new Error(JSON.stringify(err));
      }
      req.user.createOrder({orderid: order.id, status: 'PENDING'})
      .then((order)=>{
        return res.status(201).json({ order, key_id: instance.key_id });
      })
      .catch(()=>{
        throw new Error(err);
      })
    });
  }
  catch (err) {
    return res.status(403).json({ message: 'Somthing went wrong', error: err});  
  }
})


exports.updateTransactionStatus = (async (req, res, next) => {
  try {
    const t = await sequelize.transaction();
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ where: { orderid: order_id } });
    await order.update({ paymentid: payment_id, status: 'SUCCESSFUL' }, {transaction: t});
    await req.user.update({ isPremiumUser: true }, {transaction: t});
    await t.commit();
    return res.status(202).json({ isPremiumUser: true, success: true, message: 'Transaction successful' });
  }
  catch (error) {
    await t.rollback();
    console.log(error);
  }
})


