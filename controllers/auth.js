const User = require('../models/user');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const user = require('../models/user');
const passport = require('passport');


exports.signUp = (req, res, next) => {
    const errors = validationResult(req);
    //Error validation
    if (!errors.isEmpty()) {
        console.log(errors)
        const error = new Error('Validation failed');
        error.statusCode = 500;
        error.data = errors.array();

        throw error;
    }
    //Extract the email and password from the request body
    console.log(req.body)
    const email = req.body.email;
    const password = req.body.password;
    //hash the password 
    bcrypt.hash(password, 12)
    .then(hashedPassword => {
        const user = new User({
            email: email,
            password: hashedPassword
        })
        return user.save();
    })
    .then(result => {
        res.status(200).json({
            message: "User created",
            userId: result._id
        })
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}




exports.login = (req, res, next) => {
    const test = req.isAuthenticated();
    console.log(test)

  res.json({
    message: "Authentication successful",
    userID: req.user.id
  })
}