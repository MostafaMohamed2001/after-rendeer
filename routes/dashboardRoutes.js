const express = require('express');
const { addProductView, addProduct, viewProduct,productDetails,editProductView,editProduct,deleteProduct,changeSlide,changeSlidePage,productSearch } = require('../controller/dashboardController');
const {CheckIfLoggedShowPage} =require('./../controller/authController')
const router = express.Router();

router.use(CheckIfLoggedShowPage);
// For IPHONE
router.get('/products', viewProduct);
router.get('/add-product', addProductView);
router.post('/add-Product',addProduct);
router.get('/view-product-details/:id', productDetails)
router.get('/edit-product/:id', editProductView)
router.put('/edit-product/:id', editProduct);
 

router.delete('/deleteProduct/:id',deleteProduct)

router.get('/updateSlide/:id', changeSlidePage);
router.put('/updateSlide/:id',changeSlide);

router.post("/searchProduct", productSearch);
 



module.exports = router;

