const express = require('express');
const { loginView,login,signupView,signup,protect,restrictTo,forgotPassword,resetPassword,changePassword,updateMe,deleteMe,isLogged,logout } = require('./../controller/authController');
const router = express.Router();

router.get('/signup', signupView);
router.post('/signup',signup)
router.get('/login', loginView);
router.post('/loginpost', login);
 
router.post('/forgotPassword',forgotPassword)
router.post('/resetPassword/:resetToken',resetPassword)
router.post('/changePassword', protect, changePassword);
router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);
router.get('/logout',logout );

 
module.exports = router;   