const express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Flight = require('./api/models/flightsModel'), // loading model here
  bodyParser = require('body-parser');
  
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/flightsdb'); 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const routes = require('./api/routes/apiRoutes'); //importing route
routes(app); //register the route

app.listen(port);

// import the parser that runs only once when server starts
require('./api/parse');

console.log('RESTful API server started on: ' + port);