var Datastore = require('nedb');
var User = require('../models/user');

var datafile = 'userdata';

var db;

function DB() {
	//this.db = new Datastore({ filename: datafile, autoload: true });
	this.db = new Datastore({ filename: datafile });

}

DB.prototype.getDb = function() {
	this.db.loadDatabase();
	return this.db;
}

/**
 * Create some initial dummy users
 */
DB.prototype.loadInitialData = function () {
	var newUser1 = new User();
	newUser1.id = '1';
	newUser1.forename = 'Fred';
	newUser1.surname = 'Smith';
	newUser1.email = 'fred.smith@dummy.email.address'
	newUser1.created = new Date();

	this.db.insert(newUser1, function (err, newDoc) {   // Callback is optional
		if (err){
				console.log('Error in Saving user: '+err);
		}
	});

	var newUser2 = new User();
	newUser2.id = '2';
	newUser2.forename = 'Ann';
	newUser2.surname = 'Withaney';
	newUser2.email = 'annw@dummy.email.address'
	newUser2.created = new Date();

	this.db.insert(newUser2, function (err, newDoc) {   // Callback is optional
		if (err){
				console.log('Error in Saving user: '+err);
		}
	});

	var newUser3 = new User();
	newUser3.id = '3';
	newUser3.forename = 'Jim';
	newUser3.surname = 'Fergason';
	newUser3.email = 'fergi@dummy.email.address';
	newUser3.created = new Date();

	this.db.insert(newUser3, function (err, newDoc) {   // Callback is optional
		if (err){
				console.log('Error in Saving user: '+err);
		}
	});
}

module.exports = DB;