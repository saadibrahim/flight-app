'use strict';

const mongoose = require('mongoose');
const Flight = mongoose.model('Flight');
const nlp = require('compromise');
const moment = require('moment');

// list of airlines and couple of places mainly because nlp-compromise doesnt recognize these by default
const tags = { 
  'air blue': 'Airline',
  'aeroflot russian int.airl.': 'Airline',
  'air china': 'Airline',
  'cathay pacific airways ltd.': 'Airline',
  'safi airways': 'Airline',
  'indigo': 'Airline',
  'jet airways': 'Airline',
  'klm-royal dutch airlines': 'Airline',
  'air india': 'Airline',
  'british airways': 'Airline',
  'royal brunei airlines': 'Airline',
  'china southern airlines': 'Airline',
  'delta air lines': 'Airline',
  'eritrean airlines': 'Airline',
  'ariana afghan airlines': 'Airline',
  'iran asseman airlines': 'Airline',
  'iraqi airways': 'Airline',
  'kenya airways': 'Airline',
  'libyan airlines': 'Airline',
  'mahan air': 'Airline',
  'malaysia airlines': 'Airline',
  'pegasus airlines': 'Airline',
  'qantas airways limited': 'Airline',
  'air india express': 'Airline',
  'air algerie': 'Airline',
  'air france': 'Airline',
  'azerbaijan airlines': 'Airline',
  'biman bangladesh airlines': 'Airline',
  'caspian airlines': 'Airline',
  'china eastern airlines': 'Airline',
  'daallo airlines': 'Airline',
  'egypt air': 'Airline',
  'emirates': 'Airline',
  'ethiopian airlines': 'Airline',
  'finn air': 'Airline',
  'flydubai': 'Airline',
  'gulf air': 'Airline',
  'iran air': 'Airline',
  'jazeera airways': 'Airline',
  'kish air': 'Airline',
  'korean airlines': 'Airline',
  'kuwait airways': 'Airline',
  'lufthansa': 'Airline',
  'middle east airlines': 'Airline',
  'norwegian air shuttle': 'Airline',
  'oman air': 'Airline',
  'pakistan international airlines': 'Airline',
  'qatar airways': 'Airline',
  'qeshm air': 'Airline',
  'rotana jet': 'Airline',
  'royal jordanian': 'Airline',
  'rwand air express': 'Airline',
  'saudi arabian airlines': 'Airline',
  'shaheen air international': 'Airline',
  'siberia airlines': 'Airline',
  'singapore airlines': 'Airline',
  'spice jet': 'Airline',
  'srilankan airlines': 'Airline',
  'swiss international air lines': 'Airline',
  'syrian arab airlines': 'Airline',
  'taag - linhas aereas de angola airlines': 'Airline',
  'taban airlines': 'Airline',
  'tarom': 'Airline',
  'thai airways int. ltd.': 'Airline',
  'tunis air': 'Airline',
  'turkish airlines': 'Airline',
  'turkmenistan airlines': 'Airline',
  'ukraine international airlines': 'Airline',
  'united airlines': 'Airline',
  'ural airlines': 'Airline',
  'united airways bangladesh': 'Airline',
  'uzbekistan airways': 'Airline',
  'virgin atlantic airways': 'Airline',
  'yemenia -yemen airways': 'Airline',
  'naft airlines - safiran airlines': 'Airline',
  'kam air': 'Airline',
  'flynas': 'Airline',
  'air astana': 'Airline',
  'philippine airlines': 'Airline',
  'tui airlines nederland': 'Airline',
  'transavia airlines': 'Airline',
  'travel servis airlines': 'Airline',
  'taimyr airlines² russian federation': 'Airline',
  'wizzair': 'Airline',
  'cebu pacific air': 'Airline',
  'air canada': 'Airline',
  'sichuan airlines': 'Airline',
  'jubba airways': 'Airline',
  'equatorial congo airlines sa': 'Airline',
  'somon air - tajikistan': 'Airline',
  'dammam': 'Place',
  'heathrow': 'Place'
}

// for testing purposes only
exports.listFlights = function(req, res) {
  Flight.find({}, function(err, flights) {
    if (err)
      res.send(err);
    res.json(flights);
  });
};

function processRange(days) {
  let min;
  let max;
  if(days === 'today') {
    min = moment().startOf('day');
    max = moment(min).add(1, 'days');
  } else if (days === 'tomorrow') {
    min = moment().startOf('day').add(1, 'days');
    max = moment(min).add(1, 'days');
  } else {
    let dayNumber = moment().day(days).day();
    let comingDay;
    if (moment().day() <= dayNumber) { 
      // then just give me this week's instance of that day
      comingDay = moment().day(dayNumber);
    } else {
      // otherwise, give me next week's instance of that day
      comingDay = moment().add(1, 'weeks').day(dayNumber);
    }
    min = moment(comingDay).startOf('day');
    max = moment(min).add(1, 'days');
  }
  let range = { 
    min: min, 
    max: max 
  }
  return range;
}

function processPhrase(phrase) {
  let doc = nlp(phrase, tags);
  // checks the phrase for any days
  let days = doc.dates().out('normal');
  // checks the phrase for any places
  let location = doc.places().out('normal');
  // checks the phrase for direction of flight user wants, looks for from and to
  let way = doc.match('(to|from)').out('normal');
  // checks the phrase for any airline name from the list defined above
  let airline = doc.match('#Airline').out('normal');
  // calculates day, understands: today, tomorrow, name of the day (Monday, Tuesday, Wednesday)
  let range = processRange(days);
  let args = { 
    range: range,
    location: location, 
    way: way, 
    airline: airline
  }
  return args;
}

// gets filtered flights based on phrase entered
exports.getFilteredFlights = function(req, res) {
  let phrase = req.body.phrase;
  let args = processPhrase(phrase);
  // query arguments
  let query = { 
    airlineName: new RegExp('^'+args.airline+'$', "i"),
    time: {
      $gte: args.range.min.toDate(),
      $lt: args.range.max.toDate()
    }
  };
  let newQuery;
  if(args.way === 'to') {
    newQuery = Object.assign({type: 'departures', destinationName: new RegExp('^'+args.location+'$', "i")}, query);
  } else {
    newQuery = Object.assign({type: 'arrivals', originName: new RegExp('^'+args.location+'$', "i")}, query);
  }
  Flight.find(newQuery, function(err, flights) {
    if (err)
      res.json(err);
    res.json({args: args, flights: flights});
  });
};