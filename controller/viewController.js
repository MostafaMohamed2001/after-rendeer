
const asyncHandler = require('express-async-handler');
const Product = require('../models/productSchema');
const Slide = require('../models/slideSchema');



// @get Home method
exports.  getHome = async (req, res) => {
  const product = await Product.find();
  const slide = await Slide.find();
  res.render('phoneShop/indexShop',{slide,product});

};
// @get iphone method
exports.getIphone = asyncHandler(async (req, res) => {
    const getIphone = await Product.find({ category: "iphone" });
    res.render('phoneShop/iphone', { getIphone });
 
});
 
// @get andriod method
exports.getandroid = asyncHandler( async (req, res) => {

  const getIandriod = await Product.find({ category: "andriod" });
  res.render('phoneShop/andriod', { getIandriod });
});

// @get accessories method
exports.getaccessories = asyncHandler(async (req, res) => {
    const getAccess = await Product.find({ category: "accessories" }); 
    res.render('phoneShop/accessories', { getAccess });

});

// @get airpodansmartwatch method
exports.getairpodAndsmartwatch = asyncHandler(async (req, res) => {
    const getSmartAirpod = await Product.find({ category: "airpodAndSmartWatch" });
    res.render('phoneShop/airpodAndsmartwatches', { getSmartAirpod });

});

// @get used method
exports.getused = asyncHandler(async (req, res) => {
    
  const getUsed = await Product.find({ category: "used" });
  res.render('phoneShop/used', { getUsed });

});

exports.getProductDetails = asyncHandler(async (req, res) => { 
  const getProd = await Product.findById(req.params.id);
  const getAllProduct = await Product.find();
  
  res.render('phoneShop/productDeatailsView',{getProd,getAllProduct});
});