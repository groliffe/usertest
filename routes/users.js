var express = require('express');
var User = require('../models/user');
var emailValidator = require("email-validator");

var router = express.Router();

// hide mongo specific stuff from returned user
function hideDBSpecific(user) {
	var slimUser = {};
	slimUser.id = user.id;
	slimUser.forename = user.forename;
	slimUser.surname = user.surname;
	slimUser.email = user.email;
	slimUser.created = user.created;
	return slimUser;
}

//hide mongo specific stuff from returned user
function hideDBSpecificList(users) {
	var slimUsers = [];

	users.forEach(function(user) {
		var slimUser = {};
		slimUser.id = user.id;
		slimUser.forename = user.forename;
		slimUser.surname = user.surname;
		slimUser.email = user.email;
		slimUser.created = user.created;
		slimUsers.push(slimUser);
	});
	
	return slimUsers;
}

function validateUser(user) {
	return emailValidator.validate(user.email);
}

router.get('/:id', function(req, res) {
	// Return a user with a specific id.
	if (req.params.id != undefined) {
		db.getDb().findOne({ 'id': req.params.id}, function(err, user) {
			if (err) {
				res.send(500, { error: err });
			} else if (user != null) {
				res.send(hideDBSpecific(user));
			} else {
				res.send(404, { error: 'User with id: ' + req.params.id + ' not found' });
			}
		});
	}
});

router.get('/', function(req, res) {
	// Return users with surname
	if (req.query.surname != undefined) {
		db.getDb().find({ 'surname': req.query.surname}, function(err, users) {
			if (err) {
				res.send(500, { error: err });
			} else if (users.length > 0) {
				res.send(hideDBSpecificList(users));
			} else {
				res.send(404, { error: 'No Users with surname: ' + req.query.surname + ' found' });
			}
		});
	} else {
		// default, get all users
		db.getDb().find({}, function(err, users) {
			if (err) {
				res.send(500, { error: err });
			} else {
				res.send(hideDBSpecificList(users));
			}
		});
	}
});

router.put('/:id', function(req, res) {

	if(!validateUser(req.body)) {
		res.send(400, { error: "Invalid email: '" + req.body.email + "'"});

	} else {
	
		db.getDb().update({ 'id': req.params.id}, 
				{ $set:{ surname: req.body.surname,
				     forename: req.body.forename,
				     email: req.body.email}
				},
				{
					multi: false,
					returnUpdatedDocs: true
				},
				function(err, num, updatedDoc) {
			if (err) {
				res.send(500, { error: err });
			} else if (updatedDoc == undefined) {
				res.send(404, { error: 'User with id ' + req.params.id + ' not found' });
			} else {
				res.send(hideDBSpecific(updatedDoc));
			}
		});
	}
});

router.post('/', function(req, res) {
	
	if(!validateUser(req.body)) {
		res.send(400, { error: "Invalid email: '" + req.body.email + "'"});
	} else {
	
		user = new User();
		user.id = req.body.id;
		user.forename = req.body.forename;
		user.surname = req.body.surname;
		user.email = req.body.email;
		user.created = new Date();
		
		db.getDb().insert(user, function (err, newDoc) {
			if (err) {
				res.send(500, { error: err });
			} else {
				res.send(hideDBSpecific(newDoc));
			}
		});
	}
});

router.delete('/:id', function(req, res) {
	db.getDb().remove({ 'id': req.params.id}, {}, function(err, numDeleted, resp) {
		if (err) {
			res.send(500, { error: err });
		} else if (numDeleted == 0) {
			res.send(404, { error: 'User with id '+req.params.id + ' not found'})
		} else {
			myresp = {};
			myresp.deleted = true;
			res.send(myresp);
		}
	});
});

module.exports = router;
