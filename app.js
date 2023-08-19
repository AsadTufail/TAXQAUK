// CALL ENV FILE
require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const path = require('path');
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 9000;

const indexRoutes = require('./routes');


app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/tax-uk', { useNewUrlParser: true, useUnifiedTopology: true });

// Set the app view engine
app.set("view engine", "ejs");

app.use('/', indexRoutes);

app.listen(PORT, function(){
  console.log(`Server listening on port ${PORT}`);
});