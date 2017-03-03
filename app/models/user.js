var mongoose = require('mongoose');
var dataTables = require('mongoose-datatables');
var bcrypt = require('bcrypt-nodejs');
// var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;
var Schema = mongoose.Schema;

var userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastlogged: { type: Date, default: Date.now }
});

userSchema.plugin(dataTables, {
  totalKey: 'recordsTotal',
  dataKey: 'data'
});

userSchema.pre('save', function(next) {
  var user = this;
  var SALT_FACTOR = 5;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};


var User = mongoose.model('user', userSchema);

module.exports = User;
