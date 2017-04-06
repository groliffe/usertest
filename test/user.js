process.env.NODE_ENV = 'test';

var child_process = require('child_process');

var User = require('../models/user');

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

chai.use(chaiHttp);

describe('Users', () => {

	/**
	 * Before we start, we empty the database
	 */
	before((done) => {

		child_process.exec('rm -f userdata', function (error, stdout, stderr) {

			if (error !== null) {
				console.log('exec error: ' + error);
			}
			done();
		});

	});

	/*
	 * Check the DB to see that it's empty
	 */
	describe('/GET user', () => {
		it('it should GET all the users', (done) => {
			chai.request(server)
			.get('/users')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('array');
				res.body.length.should.be.eql(0);
				done();
			});
		});
	});

	/*
	 * Test the /POST route
	 */
	describe('/POST user', () => {
		it('it should not POST a user with an invalid email', (done) => {
			var user = {
					_id: "1",
					forename: "Fred",
					surname: "Smith",
					email: "a bad email"
			}
			chai.request(server)
			.post('/users')
			.send(user)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.a('object');
				res.body.should.have.property('error');
				res.body.error.should.eql("Invalid email: 'a bad email'");
				done();
			});
		});
		it('it should POST a user ', (done) => {
			var user = {
					_id: "1",
					forename: "Fred",
					surname: "Smith",
					email: "fred.smith@dummy.email.address"
			}
			chai.request(server)
			.post('/users')
			.send(user)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('_id');
				res.body.should.have.property('forename');
				res.body.should.have.property('surname');
				res.body.should.have.property('email');
				res.body.should.have.property('created');
				done();
			});
		});
		it('it should NOT POST a user with a duplicate id', (done) => {
			var user = {
					_id: "1",
					forename: "Fred",
					surname: "Smith",
					email: "fred.smith@dummy.email.address"
			}
			chai.request(server)
			.post('/users')
			.send(user)
			.end((err, res) => {
				res.should.have.status(500);
				res.body.should.be.a('object');
				res.body.should.have.property('error');
				res.body.error.should.have.property('errorType').eql('uniqueViolated');
				done();
			});
		});


	});
	
	/*
	 * Test the /GET/:id route
	 */
	describe('/GET/:id user', () => {
		it('it should GET a user by the given id', (done) => {
			chai.request(server)
			.get('/users/1')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('forename').eql('Fred');
				res.body.should.have.property('surname').eql('Smith');
				res.body.should.have.property('email').eql('fred.smith@dummy.email.address');
				res.body.should.have.property('created');
				res.body.should.have.property('_id').eql('1');
				done();
			});
		});
	});
	
	/*
	 * Test an invalid /GET/:id route
	 */
	describe('/GET/:id user', () => {
		it('it should NOT GET a user by the given invalid id', (done) => {
			chai.request(server)
			.get('/users/97')
			.end((err, res) => {
				res.should.have.status(404);
				res.body.should.be.a('object');
				res.body.should.have.property('error').eql("User with id: 97 not found");
				done();
			});
		});
	});

	/*
	 * Test the /GET?surname route
	 */
	describe('/GET?surname user', () => {
		it('it should GET a user by the given surname', (done) => {
			chai.request(server)
			.get('/users?surname=Smith')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('array');
				res.body.length.should.be.eql(1);
				res.body[0].should.have.property('forename');
				res.body[0].should.have.property('surname').eql('Smith');
				res.body[0].should.have.property('email');
				res.body[0].should.have.property('created');
				res.body[0].should.have.property('_id');
				done();
			});
		});
	});

	/*
	 * Test an invalid /GET?surname route
	 */
	describe('/GET?surname user', () => {
		it('it should NOT GET a user by the given surname', (done) => {
			chai.request(server)
			.get('/users?surname=Chance')
			.end((err, res) => {
				res.should.have.status(404);
				res.body.should.be.a('object');
				res.body.should.have.property('error').eql('No Users with surname: Chance found');
				done();
			});
		});
	});
	
	/*
	 * Test the /PUT/:id route
	 */
	describe('/PUT/:id user', () => {
		it('it should NOT UPDATE a user with an invalid email address', (done) => {
			var user = {
					forename: "Fred",
					surname: "Smith",
					email: "a bad email"
			}
			chai.request(server)
			.put('/users/1')
			.send(user)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.a('object');
				res.body.should.have.property('error');
				res.body.error.should.eql("Invalid email: 'a bad email'");
				done();
			});
		});
	});
	
	/*
	 * Test invalid /PUT/:id route
	 */
	describe('/PUT/:id user', () => {
		it('it should NOT UPDATE a user with an invalid id', (done) => {
			var user = {
					forename: "Fred",
					surname: "Smith",
					email: "fred.smith@dummy.email.address"
			}
			chai.request(server)
			.put('/users/97')
			.send(user)
			.end((err, res) => {
				res.should.have.status(404);
				res.body.should.be.a('object');
				res.body.should.have.property('error');
				res.body.error.should.eql('User with id 97 not found');
				done();
			});
		});
	});
	
	/*
	 * Test the /PUT/:id route
	 */
	describe('/PUT/:id user', () => {
		it('it should UPDATE a user with a surname change', (done) => {
			var user = {
					forename: "Fred",
					surname: "Smithers",
					email: "fred.smith@dummy.email.address"                  }
			chai.request(server)
			.put('/users/1')
			.send(user)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('forename').eql('Fred');
				res.body.should.have.property('surname').eql('Smithers');
				res.body.should.have.property('email').eql('fred.smith@dummy.email.address');
				res.body.should.have.property('created');
				res.body.should.have.property('_id').eql('1');
				done();
			});
		});
	});

	/*
	 * Check the DB to see that it's still only got one entry
	 */
	describe('/GET user', () => {
		it("it should GET all the users (ensure there's still only one)", (done) => {
			chai.request(server)
			.get('/users')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('array');
				res.body.length.should.be.eql(1);
				done();
			});
		});
	});
	
	/*
	 * Test the /DELETE/:id route with valid id
	 */
	describe('/DELETE/:id user', () => {
		it('it should DELETE a user given the id', (done) => {
			chai.request(server)
			.delete('/users/1')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('deleted').eql(true);
				done();
			});
		});
	});

	/*
	 * Check the DB to see that it's now empty again
	 */
	describe('/GET user', () => {
		it("it should GET all the users (ensure there's no more now)", (done) => {
			chai.request(server)
			.get('/users')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('array');
				res.body.length.should.be.eql(0);
				done();
			});
		});
	});
	
	/**
	 * we empty the database at he end
	 */
	after((done) => {

		child_process.exec('rm -f userdata', function (error, stdout, stderr) {

			if (error !== null) {
				console.log('exec error: ' + error);
			}
			done();
		});

	});
	
});