var passport = require('passport');
var flash = require('express-flash');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

module.exports = function (app) {

  var User = require('../models/user');

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
  },function(username, password, done) {
    User.findOne({ email: username }, function(err, user) {
      if (err) return done(err);
      if (!user) return done(null, false, { message: 'Incorrect email.' });
      user.comparePassword(password, function(err, isMatch) {
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password.' });
        }
      });
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  app.get('/login', function(req, res) {
    res.render('pages/login', {
      user: req.user
    });
  });

  app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) return next(err)
      if (!user) {
        req.flash('error', info.message);
        return res.redirect('/login')
      }
      req.logIn(user, function(err) {
        if (err) return next(err);
        return res.redirect('/');
      });
    })(req, res, next);
  });

  app.get('/signup', function(req, res) {
    res.render('pages/signup', {
      user: req.user
    });
  });

  app.post('/signup', function(req, res) {
    if ((req.body.password !== req.body.confirm) || (req.body.password === '')) {
      req.flash('error', 'The passwords do not match');
      return res.redirect('/signup');
    } else {
      var user = new User({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: req.body.password
        });
      user.save(function(err) {
        console.log("err in registration: ", err);
        req.logIn(user, function(err) {
          return res.redirect('/');
        });
      });
    }
  });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  app.get('/forgot', function(req, res) {
    res.render('pages/forgot', {
      user: req.user
    });
  });

  app.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: process.env.MAIL_SERVICE,
          auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
          }
        });
        var mailOptions = {
          to: user.email,
          from: process.env.MAIL_FROM,
          subject: 'Node.js Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      return res.redirect('/forgot');
    });
  });

  app.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('pages/reset', {
        user: req.user
      });
    });
  });

  app.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
          user.save(function(err) {
            req.logIn(user, function(err) {
              done(err, user);
            });
          });
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: process.env.MAIL_SERVICE,
          auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
          }
        });
        var mailOptions = {
          to: user.email,
          from: process.env.MAIL_FROM,
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      return res.redirect('/');
    });
  });

  app.get('/forbidden', function (req, res) {
    res.render('pages/forbidden');
  });

  app.get('/profile', app.auth, function (req, res) {
    res.render('profile', {
      "title" : 'Profile',
      "profile" : req.user
    });
  });

  app.post('/profile', app.auth, function (req, res) {
    User.findOne({_id: req.body.id}, function (err, user) {
      if (err) {
        req.flash('error', 'There was a problem updating the information');
        return res.redirect('/profile');
      }
      user.update({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email
      }, function (err) {
        if (err) {
          req.flash('error', 'There was a problem updating the information');
        }
        else {
          req.flash('success', 'Profile updated successfully.');
        }
        return res.redirect('/profile');
      });
    });
  });

  app.get('/profile/password', app.auth, function (req, res) {
    res.render('profile-password', {
      "title" : 'Profile Password',
      "profile" : req.user
    });
  });

  app.post('/profile/password', app.auth, function (req, res) {
    if ((req.body.password !== req.body.confirm) || (req.body.password === '')) {
      req.flash('error', 'The passwords do not match');
      return res.redirect('/profile/password');
    }
    User.findOne({_id: req.body.id}, function (err, user) {
      if (err) {
        req.flash('error', 'There was a problem updating the password');
        return res.redirect('/profile/password');
      }
      user.password = req.body.password;
      user.save(function (err, done) {
        if (err) {
          req.flash('error', 'There was a problem updating the password');
        }
        else {
          req.flash('success', 'Password updated successfully.');
        }
        return res.redirect('/profile/password');
      });
    });
  });
}
