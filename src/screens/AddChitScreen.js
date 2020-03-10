import React, { Component } from 'react';
import { AsyncStorage, CheckBox, PermissionsAndroid, Image, StyleSheet, Alert, TouchableOpacity, TextInput, Text, View } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

class AddChitScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user_id: '',
      x_auth: '',
      chit_content: '',
      longitude: null,
      latitude: null,
      locationPermission: false,
      geotag: false
    };
  }

  requestLocationPermission = async() => {
     try {
       const granted = await PermissionsAndroid.request(
         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
         {
           title: 'Chittr Location Permission',
           message:
           'This app requires access to your location.',
           buttonNegative: 'Cancel',
           buttonPositive: 'OK',
         },
       );

       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
         console.log('Location access ON');
         return true;
       } else {
         console.log('Location access OFF');
         return false;
       }
     } catch (err) {
       console.warn(err);
     }
  }

  componentDidMount() {
    this.findCoordinates();
    this.loadUser();
  }

  async loadUser() {
    let user_id = await AsyncStorage.getItem('user_id');
    let parse_user_id = await JSON.parse(user_id);
    let x_auth = await AsyncStorage.getItem('x_auth');
    let parse_x_auth = await JSON.parse(x_auth);
    this.setState({
      x_auth: parse_x_auth,
      user_id: parse_user_id
    });
    console.log("Loaded data from user ID: " + this.state.user_id + " and x-auth: " + this.state.x_auth);
  }

  findCoordinates = () => {
    if(!this.state.locationPermission){
     this.state.locationPermission = this.requestLocationPermission();
    }

    Geolocation.getCurrentPosition(
      (position) => {
        const longitude = JSON.stringify(position.coords.longitude);
        const latitude = JSON.stringify(position.coords.latitude);
        this.setState({
          longitude: longitude,
          latitude: latitude
        });
      },
      (error) => {
        Alert.alert(error.message)
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      }
    );
  };

  addChit() {
    var date = new Date().getDate();

    if (this.state.geotag == true) {
      return fetch("http://10.0.2.2:3333/api/v0.0.5/chits",
      {
         method: 'POST',
         body: JSON.stringify({
           chit_content: this.state.chit_content,
           timestamp: date,
           location: {
             longitude: this.state.longitude,
             latitude: this.state.latitude
           }

         }),
         headers: {
           "Content-Type":"application/json",
           "X-Authorization":this.state.x_auth,
         }
     })
     .then((response) => {
       Alert.alert("Chit Added!");
     })
     .catch((error) => {
       console.error(error);
     });
    } else {
      return fetch("http://10.0.2.2:3333/api/v0.0.5/chits",
      {
         method: 'POST',
         body: JSON.stringify({
           chit_content: this.state.chit_content,
           timestamp: date,
         }),
         headers: {
           "Content-Type":"application/json",
           "X-Authorization":this.state.x_auth,
         }
     })
     .then((response) => {
       Alert.alert("Chit Added!");
     })
     .catch((error) => {
       console.error(error);
     });
    }

 }

  handleChitContent = (text) => {
    this.setState({chit_content: text})
  }

  render() {
    return (
      <View style = {styles.view}>

        <TextInput
          style = {styles.textinput}
          placeholder = "Chit"
          onChangeText = {this.handleChitContent}
        />

        <View style = {styles.checkbox}>
          <CheckBox
            title = "Add Geotag"
            value = {this.state.geotag}
            onValueChange = {() => this.setState({geotag: !this.state.geotag})}
          />
          <Text style = {styles.checkboxtext}>Add Geotag?</Text>
        </View>

        <TouchableOpacity
          onPress = {() => this.addChit()}
          style = {styles.button}
        >
          <Text>Post</Text>
        </TouchableOpacity>

      </View>
    );
  }

}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#c7ddf5',
    padding: 10,
    marginLeft: 100,
    marginRight: 100,
    borderRadius: 3,
    elevation: 2
  },
  textinput: {
    alignItems: 'center',
    padding: 10,
    marginLeft: 100,
    marginTop: 10,
    marginBottom: 10,
    marginRight: 100,
    borderColor: '#74abe7',
    borderRadius: 5,
    borderWidth: 1.5,
    backgroundColor: '#ffffff',
    elevation: 3
  },
  view: {
    marginTop: 80,
  },
  logo: {
    width: 200,
    height: 100,
    justifyContent: 'center',
    marginLeft: 105
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  checkboxtext: {

  }
});

export default AddChitScreen;