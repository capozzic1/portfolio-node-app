const User = require('../models/user');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.signUp = (req, res, next) => {
    const errors = validationResult(req);
    //Error validation
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 500;
        error.data = errors.array();

        throw error;
    }
    //Extract the email and password from the request body
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
  
    const email = req.body.email;
    console.log(email)
    const password = req.body.password;
    let loadedUser;
    User.findOne({email: email})
    .then(user => {
        if (!user) {
            const error = new Error('A user with this email could not be found');
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password, loadedUser.password);
    })
    .then(isEqual => {
        if (!isEqual) {
            const error = new Error('Wrong password');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({
            email: loadedUser.email,
            userId: loadedUser._id.toString()}, 
            process.env.JWTSECRET, { expiresIn: '1h'})
        
        res.status(200).json({token: token, userId: loadedUser._id.toString() })
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
    //find the user
        //if no user, throw an error user cant be found
    //compare the password
        //if its not equal throw an error that its not equal
    //make the token 
    //send token in response 
    //error handling
}