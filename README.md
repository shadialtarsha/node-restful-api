# NodeJS RESTful API
A simple example for RESTful API powered with JWT.

# Requirements
You need to add a config.json file to config folder. For example:
```JSON
{
    "development": {
        "PORT": 3000,
        "MONGODB_URI": "mongodb://localhost:27017/node-restful-api",
        "JWT_SECRET": "123abcefg1232222"
    },
    "test": {
        "PORT": 3000,
        "MONGODB_URI": "mongodb://localhost:27017/node-restful-api-test",
        "JWT_SECRET": "123abcefg1232222"
    }
}
```
# Technologies
* NodeJs
* ExpressJs
* MongoDB
* Mongoose
* JWT - JSON web token
* bcryptjs - for password encryption
* validator
* lodash
* Mocha - for testing
* expect - assertions library
* supertest - for ExpressJs testing