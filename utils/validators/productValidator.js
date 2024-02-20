const { check } = require('express-validator');
const validateMiddleWare = require('../../middlewares/validatorMiddlewares');


exports.getProductValidator = [
  check('id').isMongoId().withMessage(`Invalid Product Id format`),
  validateMiddleWare
];

exports.createProductValidator = [
  check('Name')
    .notEmpty()
    .withMessage(`Product Required`)
  //   .isLength({ min: 3 })
  // .withMessage(`Too Short Product name`)
  //   .isLength({ max: 32 })
  //   .withMessage(`Too Long Product name`)
  // , check('price')
  // .notEmpty()
  // .withMessage(`Product price Required`)
  //   .isNumeric()
  //   .withMessage(`Product Price must be a number`)
  // , check('category')
  //   .notEmpty()
  //   .withMessage(`Please choose category`)
  //   .isIn(["iphone", "andriod", "accessories", "used", "airpodAndSmartWatch"])
  // , check('img')
  //   .notEmpty()
  // .withMessage("Image Url is required")
  , validateMiddleWare
]