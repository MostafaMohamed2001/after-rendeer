const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please Insert Username"],
    unique:true
  },
  fullname: {
    type: String,
    required: [true, "Please Insert Full name"],
  },
  email: {
    type: String,
    required: [true, "Please Insert email"],
    unique:true,
    validate:[validator.isEmail,"Please provide valid email"]
  },
  password: {
    type: String,
    required: [true, "Please Insert Password"],
    min: 8,
    select:false
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please Confirm your Password"],
    validate: {
      validator: function (el) {
        return el === this.password
      },
      message:"passwords not the same"
    }
  },
  passwordChangeAt: {
    type:Date,
  },
  roles: {
    type: String,
    enum:["user","admin"],
    default:"user",
  },
  passwordResetToken: String,
  passwordResetExpires: {
    type:Date
  },
  active: {
    type: Boolean,
    default: true,
    select:false
  }
}, {
  timestamps:true
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

//This for password reset token in reset password by email
userSchema.pre('save', async function (next) { 
  if(!this.isModified('password') || this.isNew) return next();
  next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changePasswordAfter = function (jwtTimeStamp) {
  if (this.passwordChangeAt) {
    const changeTime = parseInt(this.passwordChangeAt.getTime() /1000);
    console.log(changeTime, jwtTimeStamp);
    return jwtTimeStamp < changeTime;
  }

  return false;
}
userSchema.methods.createRessetToken = function () {

  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60  * 1000;
  console.log(resetToken + " " + this.passwordResetToken);
  return resetToken;
}

const User = mongoose.model('User', userSchema);
module.exports = User; 