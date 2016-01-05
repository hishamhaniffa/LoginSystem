var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bcrypt = require('bcryptjs');


module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		User.getUserById(id, function(err, user) {
			done(err, user);
		});
	});

	//Register
	passport.use('local-register', new LocalStrategy({
		passReqToCallback: true
	}, function(req, username, password, done) {
		findOrCreateUser = function() {
			//find a user with this username
			User.findOne({
				username: username
			}, function(err, user) {
				if (err) {
					console.log("Error" + err);
					return done(null, false, {message: err});
				}

				if (user) {
					console.log('User already exists');
					return done(null, false, {message: 'user already exists'});
				} else {
					var newUser = new User();
					newUser.username = username;
					newUser.password = createHash(password);
					newUser.email = req.param('email');
					newUser.name = req.param('name');
					newUser.join_date = new Date();

					User.addUser(newUser, function(err, user) {
						if (err) {
							console.log('Error: ' + err);
							throw err;
						} else {
							req.flash('success', 'Your are now registered and logged in');
							return done(null, newUser);
						}
					});
				}

			});
		};
		process.nextTick(findOrCreateUser);
	}));

	passport.use('local-login', new LocalStrategy({
		passReqToCallback: true
	}, function(req, username, password, done){
		User.getUserByUsername(username, function(err, user){
			if(err){
				console.log('Error' + err);
				return done(err);
			}
			
			if(!user){
				console.log('Error : user not found')
				return done(null, false, req.flash('error', 'User not found'));
			}

			if(!isValidPassword(user, password)){
				return done(null, false, req.flash('error', 'Invalid password'));
			}

			
			return done(null, user, req.flash('success', 'You are now logged in'));
		});
	}));

	var createHash = function(password) {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
	}

	var isValidPassword = function(user, password){
		return bcrypt.compareSync(password, user.password);
	}
}