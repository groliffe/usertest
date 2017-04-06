

# User REST example

## Synopsis

A simple NodeJS REST example.

The application is build with Express, and uses the simple database NeDB as persistent storage.

The application is configured to listen on port 3000.



## API Reference

### Return a list of all users

#### Request:
* URI: http://localhost:3000/users
* Method: GET

#### Success Response:
* HTTP status: 200
* Body Example:
```
[
  {
    "id": "3",
    "forename": "Jim",
    "surname": "Fergason",
    "email": "fergi@dummy.email.address",
    "created": "2017-04-05T10:28:51.732Z"
  },
  {
    "id": "1",
    "forename": "Fred",
    "surname": "Smith",
    "email": "fred.smith@dummy.email.address",
    "created": "2017-04-05T10:28:51.732Z"
  },
  {
    "id": "2",
    "forename": "Ann",
    "surname": "Withaney",
    "email": "annw@dummy.email.address",
    "created": "2017-04-05T10:28:51.732Z"
  }
]
```

### Return a specific user by id.

#### Request:
* URI: http://localhost:3000/users/<id>
* Method: GET

#### Success Response:

* HTTP status: 200
* Body example:
```
{
  "id": "1",
  "forename": "Fred",
  "surname": "Smith",
  "email": "fred.smith@dummy.email.address",
  "created": "2017-04-05T09:51:05.186Z"
}
```
#### Failure Response:

* Http response: 404
* Body example:
```
{
  "error": "User with id: 97 not found"
}
```

### Return users by surname

#### Request:
* URI: http://localhost:3000/users?surname=<name>
* Method: GET

#### Success Response:

* HTTP status: 200
* Body example:
```
[
{
  "id": "1",
  "forename": "Fred",
  "surname": "Smith",
  "email": "fred.smith@dummy.email.address",
  "created": "2017-04-05T09:51:05.186Z"
}
]
```
#### Failure Response:

* Http response: 404
* Body example:
```
{
  "error": "No Users with surname: Chance found"
}
```

### Add a user. Will validate the email address for correct format.


#### Request:

* URI: http://localhost:3000/users
* Method: POST
* Headers:
    * Content-Type = application/json
* Body Example:
```
{
	"id": "4",
	"forename": "John",
	"surname": "Deere",
	"email": "jdeere@dummy.email.address"
}
```

#### Success Response:
* HTTP status: 200
* Body Example:
```
{
  "id": "4",
  "forename": "John",
  "surname": "Deere",
  "email": "jdeere@dummy.email.address",
  "created": "2017-04-05T10:27:30.933Z"
}
```

#### Failure Response:

* HTTP status: 400
* Body Example:
```
{
  "error": "Invalid email: 'bad email address'"
}
```

* HTTP status: 500
* Body Example:
```
{
  "error": {
    "key": "4",
    "errorType": "uniqueViolated"
  }
}
```

### Update a user. Will validate the email address for correct format.

#### Request:
* URI: http://localhost:3000/users
* Method: PUT
* Headers: 
    * Content-Type = application/json
* Body Example:
```
{
	"id": "3",
	"forename": "Jim",
	"surname": "Massey"
}
```

#### Success Response:
* HTTP status: 200
* Body Example:
```
{
  "id": "3",
  "forename": "Jim",
  "surname": "Massey",
  "created": "2017-04-05T09:32:02.512Z"
}
```

####Failure Responses:
* HTTP status: 404
* Body Example:
```
{
  "error": "User with id 500 not found"
}
```

* HTTP status: 400
* Body Example:
```
{
  "error": "Invalid email: 'bad email address'"
}
```

### Delete a user by id.

#### Request:
* URI: http://localhost:3000/users/<id>
* Method: DELETE

#### Success Response:
* HTTP status: 200
* Body Example:
```
{ deleted: true }
```

#### Failure Response:
* HTTP status: 404
* Body Example:
```
{
  "error": "User with id 500 not found"
}
```


## Installation

### Running from the console

nodejs bin/www


### Running the test suite

npm test


### Building a Docker image.

docker build -t usertest .


### Running the Docker image.

docker run -p3000:3000 usertest


