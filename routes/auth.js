const express = require('express');
const User = require('../models/user');
const router = express.Router();
const authController = require('../controllers/auth');
const { body } = require('express-validator');
// const requireLocalAuth = require('../middleware/requireLocalAuth');
const passport = require('passport')

router.post('/register', [
    body('email').isEmail().withMessage('Please enter a valid e-mail')
    .custom((value, { req }) => {
        console.log(value)
        return User.findOne({ email: value })
        .then(userDoc => {
            if (userDoc) {
                return Promise.reject('E-mail address already exists');
            }
        })
    }),
    body('password').trim().isLength({min: 6})
]
, authController.signUp)

router.post('/login', passport.authenticate('local'), authController.login)



module.exports = router;