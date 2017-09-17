const mongoose = require('mongoose')
const Flight = mongoose.model('Flight');

const http = require("http");
const arrivalsUrl = "http://www.dubaiairports.ae/api/flight/arrivals";
const departuresUrl = "http://www.dubaiairports.ae/api/flight/departures";


// function that gets data from given url and adds to mongo database
const getData = function(url, type) {
  http.get(url, res => {
    res.setEncoding("utf8");
    let body = "";
    res.on("data", data => {
      body += data;
    });
    res.on("end", () => {
      body = JSON.parse(body);
      let flights = body.flights.map((flight) => {
        return {
          uid: flight.uid,
          flightNumber: flight.flightNumber,
          airlineName: flight.lang.en.airlineName,
          originName: flight.lang.en.originName,
          destinationName: flight.lang.en.destinationName,
          time: new Date(flight.scheduled*1000),
          type: flight.type
        }
      });
      Flight.insertMany(flights, function(err, flights) {
        if (err)
          console.log(err);
        console.log(type + ' parsed and added to db');
      });
    });
  });
}

// removes all data from database
const removeData = function() {
  Flight.remove({}, function(err, flights) {
    if (err)
      console.log(err);
    console.log('removed everything so there no duplicates, starting over');
  });
}


// run the functions to first remove everything from db and then repopulate with latest data from API
// removeData();
// getData(arrivalsUrl, 'arrivals');
// getData(departuresUrl, 'departures');