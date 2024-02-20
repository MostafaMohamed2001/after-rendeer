const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: [true, 'Product Name Is Required'],
  },
  price: {
    type: String,
    required:[true,'Please entert product price']
  },
  priceDisscount: String,
  img: {
    type: String,
    required: [true,'Please enter photo']
  },
  category: {
    type: String,
    required: [true, 'Please Choose Category'],
    enum:[ "iphone" , "andriod", "accessories","used","airpodAndSmartWatch"]
  },
  productDetails: {
    type: String
  },
  stock: {
    type: Boolean,
    default:true
  },
}, {
  timestamps:true
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product; 