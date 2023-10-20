const Razorpay = require('razorpay');
const Order = require('../models/order');

exports.purchasePremium = (async (req, res, next) => {
  try {
    var instance = new Razorpay({
      key_id: 'rzp_test_bKFDRxNzZoiW9T',
      key_secret: 'DGRU7DCK7TaXNIdTc3Ix4AHI'
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
    const {payment_id, order_id} = req.body;
    const order = await Order.findOne({where: {orderid: order_id}});
    await order.update({paymentid: payment_id, status: 'SUCCESSFUL'});
    await req.user.update({isPremiumUser: true});
    return res.status(202).json({success: true, message: 'Transaction successful'});
  } 
  catch (error) {
    console.log(error); 
  }
})


