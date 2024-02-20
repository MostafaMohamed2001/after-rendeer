const { promisify } = require('util')
const ApiError = require('../utils/apiError');
const User = require('./../models/userModel');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
// const sendEmail = require('./../utils/email');
const crypto = require('crypto');
const signToken = (id) => jwt.sign({ id: id }, process.env.JWT_SECERT, {
  expiresIn: process.env.jWT_EXPIRES_IN
});
const createSignTokenWithRes = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.jWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly:true,
  }
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt',token,cookieOptions)
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user
    }
  }); 
}
const filterObj = (obj, ...allowFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
}
exports.signupView = asyncHandler(async (req, res) => {
  res.render('auth/signup.ejs')
})
exports.signup = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  const token = createSignTokenWithRes(user, 200, res);

});
exports.loginView = (req, res) => {
  res.render('auth/login.ejs')
};

exports.login = asyncHandler(async (req, res,next) => {
  const { email, password } = req.body;
  if (!email || !password) { 
    return next(new ApiError('Please provide email and password',404));
  }
  const user = await User.findOne({ email}).select('+password');
  if (!user || !(await user.correctPassword(password,user.password))) {
    return next(new ApiError('Wrong Email or password',404));
  } 
  const token = createSignTokenWithRes(user, 200, res);

});
exports.logout = async (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 1000),
    httpOnly:true
  })
  res.status(200).json({
    status:"success"
  })
 };

exports.protect = asyncHandler(async (req, res, next) => {
  // Check if there are token 
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  };
  
  if (!token) {
    return next(new ApiError('You Are Not Login, Please Login to access.', 401));
  };
  // verfiry token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECERT);
  // console.log(decoded);

  //check if there are user
  const freshUser = await User.findById(decoded.id);
  // console.log(freshUser);
  if (!freshUser) {
    return next(new ApiError('User belong to this token doeas not exist', 401));
  };

  // check if user change pass after token making
  if (freshUser.changePasswordAfter(decoded.iat)) {
    return next(new ApiError('User recently change password ! please login again', 401));
  }
  req.user = freshUser;
  next();
});
exports.isLogged = async (req, res, next) => {
  let token;
  // get token and check it 
  if (req.cookies.jwt) {
      try {
       
          //check if user still exist
          const freshUser = await User.findById(decoded.id);
          if (!freshUser) {
              return next();
          }
          // check if user changed password after token 
          if (freshUser.changePasswordAfter(decoded.iat)) {
              return next();
          }
          // there is logged in user
          res.locals.user = freshUser;
          return next();
      }
      catch (err) {
          return next();
      }
  }
  next();
};
exports.CheckIfLoggedShowPage =(async (req, res, next) => {
  let token;
  // get token and check it 
  if (req.cookies.jwt) {
      try {
       
          //check if user still exist
          const freshUser = await User.findById(decoded.id);
          if (!freshUser) {
              return next();
          }
          // check if user changed password after token 
          if (freshUser.changePasswordAfter(decoded.iat)) {
              return next();
          }
          // there is logged in user
          res.locals.user = freshUser;
          return next();
      }
      catch (err) {
          return next();
      }
  }
  return res.redirect('/auth/login')
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.roles)) {
      return next(new ApiError('You  Are  Not Have Permision to do that', 403));
    };
    next();
  };
};


exports.forgotPassword = asyncHandler(async (req, res,next) => {
  // check the entered email is exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError('There are not have user with this email', 404));
  }
  console.log(user);
  // create a random reset token
  const resetToken = user.createRessetToken();
  await user.save({ validateBeforeSave: false });
  console.log("after saved token");
 
  // //send email
  // const resetURL = `${req.protocol}://${req.get(
  //   'host'
  // )}/api/v1/users/resetPassword/${resetToken}`;

  // const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  // try {
  //   await sendEmail({
  //     email: user.email,
  //     subject: 'Your password reset token (valid for 10 min)',
  //     message
  //   });

  //   res.status(200).json({
  //     status: 'success',
  //     message: 'Token sent to email!'
  //   });
  // } catch (err) {
  //   console.log(err);
  //   user.passwordResetToken = undefined;
  //   user.passwordResetExpires = undefined;
  //   await user.save({ validateBeforeSave: false });

  //   return next(
  //     new ApiError('There was an error sending the email. Try again later!'),
  //     500
  //   );
  // }
});
 
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // get user based on token param shoild i hash it to compare it with in db
  const hashedToekn = crypto.createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');
  
  const user = await User.findOne({
    passwordResetToken: hashedToekn,
    passwordResetExpires: { $gt: Date.now() }
  });

  // if token not expire
  if (!user) {
    return next(new ApiError('The Token Was Expire Please Try again', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // change password at by pre midd

  /// send new token after set new pass

  const token = createSignTokenWithRes(user, 200, res);
});

exports.changePassword = asyncHandler(async (req, res,next) => {
  // get user pased is login 

  const user = await User.findById(req.user.id).select('+password');

  // check if the posted cuurent passs = my pass in db
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new ApiError('Your Current password is incorrect', 401));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //send token
  createSignTokenWithRes(user, 200, res);

}); 
 
exports.updateMe = asyncHandler(async (req, res, next) => {
  // errors
  if (req.body.password || req.body.passwordConfirm) {
    return next(new ApiError('This route not for update pass please use change password', 400));
  }
  const filterBody = filterObj(req.body, 'fullname', 'email', 'username');
  const user = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: "success",
    data: {
      user: user
    }
  });
})

exports.deleteMe = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(200).json({
    status: "success",
    data: null
  });
})