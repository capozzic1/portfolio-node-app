const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const projectRoutes = require('./routes/project');
const authRoutes = require('./routes/auth')
const dotenv = require('dotenv');
dotenv.config();
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': [
            'Content-Type',
            'Authorization'
        ]
    })
    next()
})

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