const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const projectRoutes = require('./routes/project');
const authRoutes = require('./routes/auth')
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs')
const session = require("express-session");
const User = require('./models/user')
const passport = require("passport");

const cookieParser = require("cookie-parser");
const cors = require('cors');
const LocalStrategy = require('passport-local')
dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    next()
})

app.use(
    cors({
        // origin: "http://localhost:3001",
        credentials: true
    })
)

app.use(
    session({
        secret:"secretcode",
        resave: true,
        saveUninitialized: true
    })
)

app.use(cookieParser("secretcode"))

app.use(passport.initialize())
app.use(passport.session());
require("./middleware/passportStrategyConfig")(passport);

app.use('/auth', authRoutes);
app.use('/projects', projectRoutes)
//Error middleware
app.use((error, req, res, next) => {
    console.log(error)
    const status = error.statusCode;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data  })
})

mongoose.connect(process.env.MONGODB)
.then((result) => {
    console.log("database connected")
    app.listen(3000)
})
.catch(err => console.log(err))