'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FlightSchema = new Schema({
  uid: {
    type: Number
  },
  flightNumber: {
    type: String
  },
  airlineName: {
    type: String
  },
  originName: {
    type: String
  },
  destinationName: {
    type: String
  },
  time: {
    type: Date
  },
  type: {
    type: String,
    enum: ['arrivals', 'departures']
  }
});

module.exports = mongoose.model('Flight', FlightSchema);