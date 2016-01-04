var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
	username: {
		type: String
	},
	email: {
		type: String
	},
	password: {
		type: String
	},
	name: {
		type: String
	},
	join_date: {
		type: Date
	},
	updatedAt: {
		type: Date,
		default: Date.now
	}
});

var User = module.exports = mongoose.model('user', UserSchema);

module.exports.getUserById = function(id, callback) {
	User.findById(id, callback);
}


module.exports.comparePassword = function(password, hash, callback) {
	bcrypt.compare(password, hash, function(err, isMatch) {
		if(err){
			return callback(err);
		}else{
			callback(null, isMatch);
		}
	});
}

module.exports.addUser = function(user, callback){
	User.create(user, callback);
}