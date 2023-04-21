const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Product Name."],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please Enter Description."]
    },
    price: {
        type: Number,
        required: [true, "Please Enter Product Price."],
        maxLength: [8, "Price cannnot exceed 8 Chracters."]
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please Enter Product Category."]
    },
    stock: {
        type: Number,
        required: [true, "Please Enter Product Stock."],
        maxLength:[4,"Stock cannnot exceed 4 characters."]
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[{
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true,
        },
        name:{
            type:String,
            required:true
        },
        rating:{
            type:Number,
            required:true,
        },
        comment:{
            type:String,
            required:true
        }
    }],

    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})


module.exports = mongoose.model("Product",productSchema);