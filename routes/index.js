var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login'});
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Create Account' });
});

router.post('/register', function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email must be valid').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Password do not match').equals(password);


  var errors = req.validationErrors();
  if(errors){
  	res.render('register', {
  		errors: errors,
  		title: "Create Account"
  	});
  }else{
  	passport.authenticate('local-register', {
      successRedirect: '/dashboard',
      failureRedirect: '/',
      failureFlash: true // to show message on fail
    })(req, res, next);
  }
  
});

router.post('/login', function(req, res, next){
  var username = req.body.username;
  var password = req.body.password;

  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();

  passport.authenticate('local-login', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
    failureFlash: true,
  })(req, res, next);

});

router.get('/logout', function(req, res, next){
  req.logout();
  req.flash('success', 'Logged out successfully');
  res.redirect('/');
});



router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', { title: 'Dashboard' , layout: 'dashboard_layout'});
});


module.exports = router;
