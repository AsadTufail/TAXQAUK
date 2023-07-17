// CALL ENV FILE
require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require("cors");

const indexRoutes = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.use(cors());

// Set the app view engine
app.set("view engine", "ejs");

app.use('/', indexRoutes);

app.listen(9000, function(){
  console.log('Server listening on port 9000')
});