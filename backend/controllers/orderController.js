const ErrorHandler = require("../utils/errorhandleer")
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFetures = require("../utils/apiFetures");
const Order = require("../models/orderModels");
const Product = require("../models/productModel");


//Create new Order

exports.newOrder = catchAsyncErrors(async (req, res, next) => {

    const { shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success: true,
        order,
    })
});


//get Single Order

exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    //for populate understand 4:22:00
    const order = await Order.findById(req.params.id).populate("user", "name  email");

    if (!order) {
        return next(new ErrorHandler(`Order not found with this Id`, 404));
    }

    res.status(200).json({
        success: true,
        order
    })
})


//Login Users Order

exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        orders
    })
})



//Get All Order --ADMIN

exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})



//Update Order Status --ADMIN

exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler(`Order not found with ${req.params.id} this Id`, 404));
    }
    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler(`You have already delivered this order`, 404));
    }

    if (req.body.status === "Shipped") {
        order.orderItems.forEach(async (o) => {
            await updateStock(o.product, o.quantity);
        });
    }

    order.orderStatus = req.body.status

    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now()
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    })
})

async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
}



//Delete Order --ADMIN

exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler(`Order not found with this Id`, 404));
    }
    await order.deleteOne();

    res.status(200).json({
        success: true,
    })
})