const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');

const indexRoute = require('./routes/indexRoute.js');
const authRoutes = require('./routes/authRoute.js');

app.set("view engine", "ejs");
app.use(express.static('public')); // Serve static files from the 'public' directory

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', indexRoute);
app.use('/auth', authRoutes);

module.exports = app;