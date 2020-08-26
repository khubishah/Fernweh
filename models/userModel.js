const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');


// name, email, photo (string), password, passwordConfirm

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name needed'],
  },
  email: {
    type: String,
    required: [true, 'Email needed'],
    unique: true,
    lowercase: true, // converts to lowercase
    validate: [validator.isEmail, 'Please provide a valid email.'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'admin',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE AND SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same.',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false, // hide it
  },
});

//hook
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // call the next middleware if password wasn't modified

  //hashing the password - decrypt algorithm to protect brute force attacks
  this.password = await bcrypt.hash(this.password, 12); // 12 refers to CPU intensiveness
  // hash is async function
  // delete the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('/^find/', function(next) {
  // this points to the current query (query middleware)
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    //console.log(this.passwordChangedAt, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  // not changed
  return false;
};

//instance method: method available on all documents of a given collection
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  // encrypt this reset token
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  //console.log(resetToken, this.passwordResetToken, this.passwordResetExpires);
  return resetToken;
}

const User = mongoose.model('User', userSchema);
module.exports = User;
