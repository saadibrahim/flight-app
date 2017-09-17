'use strict';
module.exports = function(app) {
  const flights = require('../controllers/flightController');

  // we just have get and post ruote
  app.route('/flights')
    .get(flights.listFlights)
    .post(flights.getFilteredFlights);
};