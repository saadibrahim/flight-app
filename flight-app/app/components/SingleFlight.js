import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native'
// import styles from './Styles/SingleFlightStyles'
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from '../config.json';
const Icon = createIconSetFromFontello(fontelloConfig);

const moment = require('moment');

export default class SingleFlight extends Component {
  render () {
  	let { uid, airlineName, flightNumber, originName, destinationName, type, time, parsed_date } = this.props.item;
  	let direction;
  	let destination;
  	if(type === 'arrivals') {
  		direction = 'from';
  		destination = originName;
  	} else {
  		direction = 'to';
  		destination = destinationName;
  	}
  	let flightTime = moment(time).format("ddd, hA");
    return (
    	<View style={styles.singleFlight}>
    		<Text style={styles.flightInfo}><Icon name="plane" style={styles.planeIcon} /> <Text style={styles.airlineDest}>{airlineName}</Text> {flightNumber} {direction} <Text style={styles.airlineDest}>{destination}</Text> at <Text style={styles.flightTime}>{flightTime}</Text></Text>
    	</View>
    )
  }
}

SingleFlight.propTypes = {
  item: PropTypes.object.isRequired
};

// normally these would be in a seperate styles file but since this is a very simple app it's not a big problem here
const styles = StyleSheet.create({
	flightInfo: {
    fontFamily: 'Roboto-Light',
		color: '#37485f',
		fontSize: 13
	},
	planeIcon: {
		color: '#47c391',
		fontSize: 13,
		marginRight: 10
	},
	singleFlight: {
		backgroundColor: '#ffffff',
		paddingVertical: 10,
		paddingHorizontal: 15,
		marginTop: 10,
		borderRadius: 5
	},
	airlineDest: {
		fontFamily: 'Roboto-Regular'
	},
	flightTime: {
		color: '#47c391'
	}
})