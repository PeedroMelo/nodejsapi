var express    = require("express");
var bodyParser = require("body-parser");
var consign    = require("consign");
var expressValidator = require('express-validator');

var application = express();

application.use(bodyParser.urlencoded({extended: true}));
application.use(bodyParser.json());
application.use(expressValidator());

consign()
    .include('./config/firebase/database.js')
    .then('./methods')
    .into(application);

module.exports = application;