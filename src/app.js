const express = require('express');
const app = express();

const indexRoute = require('./routes/indexRoute.js');


app.set("view engine", "ejs");
app.use(express.static('public')); // Serve static files from the 'public' directory

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRoute);

module.exports = app;