const express = require('express');
const {getHome, getIphone,getandroid,getaccessories,getairpodAndsmartwatch,getused ,getProductDetails} = require('../controller/viewController.js');

const router = express.Router();



router.get('/',getHome );
router.get('/iphone', getIphone);
router.get('/android', getandroid);
router.get('/accessories', getaccessories);
router.get('/airpodAndsmartwatch', getairpodAndsmartwatch);
router.get('/used', getused);
router.get('/productDetails/:id', getProductDetails);
   
module.exports = router;
 
  