import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Dimensions,
  TouchableOpacity
} from 'react-native';

import SingleFlight from './components/SingleFlight';

// importing and intializing custom icon font
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './config.json';
const Icon = createIconSetFromFontello(fontelloConfig);

// getting window width
var width = Dimensions.get('window').width;

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      phrase: '',
      flights: []
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.formWrapper}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              onChangeText={(phrase) => this.textUpdate(phrase)}
              value={this.state.phrase}
              onSubmitEditing={() => this.process()}
              underlineColorAndroid='rgba(0,0,0,0)'
            />
            <TouchableOpacity 
              onPress={() => this.process()}
              style={styles.searchButton} 
            >
              <Icon name="search" style={styles.searchIcon} />
            </TouchableOpacity>
          </View>
          <View>
            <FlatList
              data={this.state.flights}
              renderItem={({item}) => this.renderItem(item)}
              keyExtractor={this.keyExtractor}
            />
          </View>
        </View>
      </View>
    )
  }
  renderItem(flight) {
    return <SingleFlight item={flight} />;
  }
  keyExtractor(item, index) {
    return item._id;
  }
  textUpdate(phrase) {
    this.setState({phrase: phrase});
  }
  // you will have to change it to your local area network IP to run it on Android, it's fine for iOS
  process() {
    fetch('http://127.0.0.1:3000/flights', {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({phrase: this.state.phrase})
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({
        flights: responseData.flights
      })
    })
    .done();
  }
}

// normally these would be in a seperate styles file but since this is a very simple app it's not a big problem here
var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#f5f6f8',
    alignItems: 'center',
  },
  formWrapper: {
    paddingHorizontal: width * 0.1
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0,
    width: width * 0.9,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    fontFamily: 'Roboto-Light',
    color: '#37485f',
    paddingLeft: 20,
    paddingRight: 25,
    fontSize: 15
  },
  searchButton: {
    position: 'absolute',
    right: 5,
    top: 0,
    backgroundColor: 'transparent',
    height: 40,
    justifyContent: 'center',
    padding: 5
  },
  searchIcon: {
    fontSize: 18,
    color: '#9ba3af'
  }
})