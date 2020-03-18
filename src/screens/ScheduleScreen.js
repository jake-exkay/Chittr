import React, { Component } from 'react'
import {
  AsyncStorage,
  CheckBox,
  PermissionsAndroid,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  Text,
  View
} from 'react-native'
import Geolocation from 'react-native-geolocation-service'

// Component is used to schedule draft chits and set the time they are posted.
class ScheduleScreen extends Component {

  constructor (props) {
    super(props)

    this.state = {
      user_id: '',
      x_auth: '',
      chit_content: ''
    }
  }

  static navigationOptions = {
    headerTitle: () => (
        <Image
          source = {require('../../img/chittr_logo.png')}
          style = {{ width: 100, height: 50, marginLeft: 85 }}
        />
      ),
    headerStyle: {
      backgroundColor: '#29a9ff'
    }
  }

  handleChitContent = (text) => {
    this.setState({chit_content: text})
  }

  // Function renders form to add scheduled chit.
  render () {
    return (
      <View style={styles.view}>

        <TouchableOpacity
          onPress={() => this.addChit()}
          style={styles.button}
        >
          <Text>Post</Text>
        </TouchableOpacity>

      </View>
    )
  }

  // Runs on component start, calls functions to get coordinates and load user data.
  componentDidMount () {
    console.log('[STARTUP] ScheduleScreen Loaded')
    this.findCoordinates()
    this.loadUser()
  }

  // Function requests permission from the user to use location information.
  requestLocationPermission = async () => {
     try {
       const granted = await PermissionsAndroid.request(
         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
         {
           title: 'Chittr Location Permission',
           message:
           'This app requires access to your location.',
           buttonNegative: 'Cancel',
           buttonPositive: 'OK'
         }
       )

       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
         console.log('[SUCCESS] Location access ON')
         return true
       } else {
         console.log('[ERROR] Location access OFF')
         return false
       }
     } catch (error) {
       console.warn('[ERROR] Error requesting location permission. Log: ' + error)
     }
  }

  // Function loads user data from async storage and saves information in state.
  async loadUser () {
    let userId = await AsyncStorage.getItem('user_id')
    let parsedUserId = await JSON.parse(userId)
    let xAuth = await AsyncStorage.getItem('x_auth')
    let parsedXAuth = await JSON.parse(xAuth)
    this.setState({
      x_auth: parsedXAuth,
      user_id: parsedUserId
    })
    console.log('[DEBUG] Loaded data from user ID: ' + this.state.user_id + ' and x-auth: ' + this.state.x_auth)
  }

  findCoordinates = () => {
    if(!this.state.locationPermission){
     this.state.locationPermission = this.requestLocationPermission()
    }

    Geolocation.getCurrentPosition(
      (position) => {
        const longitude = JSON.stringify(position.coords.longitude)
        const latitude = JSON.stringify(position.coords.latitude)
        this.setState({
          longitude: longitude,
          latitude: latitude
        })
        console.log('[SUCCESS] Got location data successfully.')
      },
      (error) => {
        console.log('[ERROR] Error getting location data. Log: ' + error)
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      }
    )
  }

  // Function adds chit at a certain time specified.
  addChit () {
    var date = Date.parse(new Date())
    console.log('[DEBUG] Attempting to add scheduled chit')

    if (this.state.geotag == true) {
      return fetch('http://10.0.2.2:3333/api/v0.0.5/chits',
      {
         method: 'POST',
         body: JSON.stringify({
           chit_content: this.state.chit_content,
           timestamp: date,
         }),
         headers: {
           'Content-Type': 'application/json',
           'X-Authorization': JSON.parse(this.state.x_auth)
         }
     })
     .then((response) => {
       console.log('[SUCCESS] Scheduled Chit added')
       Alert.alert('Chit Scheduled!')
     })
     .catch((error) => {
       console.error('[ERROR] Error adding scheduled Chit. Log: ' + error)
     })
    }
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
    marginTop: 80
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
  }
})

export default ScheduleScreen
