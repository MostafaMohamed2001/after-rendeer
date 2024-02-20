
const Product = require('../models/productSchema');
const Slide = require('../models/slideSchema');
const moment = require('moment');

const asyncHandler = require('express-async-handler');
const ApiError = require('./../utils/apiError');

exports.viewProduct = asyncHandler(async (req, res) => {
  const product = await Product.find();
  res.render("dashboard/products/indexProduct", { product, moment });
});

exports.addProductView = asyncHandler((req, res) => {
  res.render('dashboard/products/add')
});
exports.addProduct =asyncHandler(async (req, res,next) => {  
  await Product.create({
    Name: req.body.Name,
    price: req.body.price,
    priceDisscount: req.body.priceDisscount,
    category: req.body.category,
    img: req.body.img,
    productDetails: req.body.productDetails,
  });
 
  res.redirect('/dashboard/products')
}) ;



exports.productDetails = asyncHandler(async (req, res) => {

  const product = await Product.findById(req.params.id);
  
  if (!product) {
    res.status(404).json(
      {
        status: 'fail',
        message: `No Category for this ${req.params.id}` 
      }
    )
  }
  res.render("dashboard/products/viewProductDetails", { product, moment });
});


exports.editProductView = asyncHandler( async (req, res) => {
  
    

  const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json(
        {
          status: 'fail',
          message: `No Category for this ${req.params.id}` 
        }
      )
    }
    res.render("dashboard/products/editProduct", { product, moment });

});


exports.editProduct = asyncHandler(async (req, res) => {

  
  const product = await Product.findById(req.params.id);
  const { Name, price, priceDisscount, category, img ,productDetails,stock} = req.body;
  if(Name) product.Name = Name
  if(price) product.price = price
  if(priceDisscount) product.priceDisscount = priceDisscount
  if(category) product.category = category
  if(img) product.img = req.body.img;
  if(productDetails) product.productDetails = req.body.productDetails;
  if (stock) product.stock = stock;
  await product.save();
  res.redirect("/dashboard/products");

});

exports.deleteProduct = asyncHandler(async (req, res) => {
  

  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404).json(
      {
        status: 'fail',
        message: `No Category for this ${req.params.id}` 
      }
    )
  }
  res.redirect('/dashboard/products');

});

exports.productSearch =asyncHandler( async (req, res) => {
  console.log(req.body);
  const searchBox = req.body.searchBox.trim();
 
    const product = await Product.find({
      $or: [
        {
          Name: searchBox
        },
        {
          category: searchBox
        },
        {
          stock:searchBox
        }

      ]
    });
  
    res.render('dashboard/products/search', { product, moment })


});

exports.changeSlidePage = asyncHandler(async (req, res) => {

  const slide = await Slide.findById(req.params.id);
    res.render('dashboard/Components/changeSlide', { slide })

});
exports.changeSlide = asyncHandler(async (req, res,next) => {
 
  const slide = await Slide.findById(req.params.id);
  const { title, description,img } = req.body;
  if (title) slide.title = title;
  if (description) slide.description = description;
  if (img) slide.img = img;
  await slide.save();
  res.redirect('/dashboard/updateSlide/65cba6604cf32dfc374018a0');
   
});



// router.delete('/deleteAll', async(req, res) => { 
//   await product.deleteMany();
//   res.redirect("/PhoneShop")
// })
