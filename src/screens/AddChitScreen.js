import React, { Component } from 'react'
import {
  AsyncStorage,
  Image,
  CheckBox,
  PermissionsAndroid,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  Text,
  View
} from 'react-native'
import Geolocation from 'react-native-geolocation-service'

// Component includes text entry for writing a new chit including a button to post the chit. The component also
// includes a checkbox option for adding a geotag and buttons to save and view drafts.
class AddChitScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      user_id: '',
      x_auth: '',
      chit_content: '',
      longitude: null,
      latitude: null,
      locationPermission: false,
      geotag: false
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
    this.setState({
      chit_content: text
    })
  }

  // Renders data on screen, text inputs and buttons for adding chit data.
  render() {
    const { navigate } = this.props.navigation

    return (
      <View style={styles.mainView} accessible={true}>

        <TextInput
          style={styles.textEntry}
          placeholder='Compose a Chit...'
          onChangeText={this.handleChitContent}
          accessibilityLabel='Chit Content'
          accessibilityHint='Enter chit content here'
          accessibilityRole='keyboardkey'
        />

        <View style={styles.checkBox}>
          <CheckBox
            title='Add Geotag'
            value={this.state.geotag}
            onValueChange={() => this.setState( {geotag: !this.state.geotag} )}
            accessibilityLabel='Add Geotag'
            accessibilityHint='Select this checkbox to add a geotag to your chit'
            accessibilityRole='checkbox'
          />
          <Text style={styles.checkBoxText}>Add Geotag?</Text>
        </View>

        <TouchableOpacity
          onPress={() => this.addChit()}
          style={styles.button}
          accessibilityLabel='Post Chit'
          accessibilityHint='Press the button to post the chit'
          accessibilityRole='button'
        >
          <Text>Post</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.saveToDrafts()}
          style={styles.button}
          accessibilityLabel='Save to drafts'
          accessibilityHint='Press the button to save the chit to your drafts'
          accessibilityRole='button'
        >
          <Text>Save to Drafts</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigate('DraftScreen')}
          style={styles.button}
          accessibilityLabel='View drafts'
          accessibilityHint='Press the button to view a list of your current drafts'
          accessibilityRole='button'
        >
          <Text>View Drafts</Text>
        </TouchableOpacity>

      </View>
    )
  }

  // Function used to get the location permission status. If the permission is not granted, return false
  // and if the permission is granted, return true.
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
         },
       )

       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
         console.log('Location access ON')
         return true
       } else {
         console.log('Location access OFF')
         return false
       }
     } catch (error) {
       console.warn(error)
     }
  }

  // Function calls find coordinates and load user functions when the component starts.
  componentDidMount () {
    this.findCoordinates()
    this.loadUser()
  }

  // Function loads user data from async storage and saves user ID and x-auth token to the state.
  async loadUser () {
    const userId = await AsyncStorage.getItem('user_id')
    const parsedUserId = await JSON.parse(userId)
    const xAuth = await AsyncStorage.getItem('x_auth')
    const parsedXAuth = await JSON.parse(xAuth)
    this.setState({
      x_auth: parsedXAuth,
      user_id: parsedUserId
    })
    console.log('Loaded data from user ID: ' + this.state.user_id + ' and x-auth: ' + this.state.x_auth)
  }

  // Function gets the current coordinates of the device. First, it checks if permission has been granted then
  // uses the geolocation library to get the current position.
  findCoordinates = () => {
    if(!this.state.locationPermission) {
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
      },
      (error) => {
        Alert.alert(error.message)
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      }
    )
  }

  // Function adds a chit to the API, includes a check to see if the geotag option was selected and if so,
  // sends location data too.
  addChit () {
    var date = Date.parse(new Date())

    if (this.state.geotag == true) {
      return fetch('http://10.0.2.2:3333/api/v0.0.5/chits',
        {
           method: 'POST',
           body: JSON.stringify({
             chit_content: this.state.chit_content,
             timestamp: date,
             location: {
               longitude: JSON.parse(this.state.longitude),
               latitude: JSON.parse(this.state.latitude)
             }
           }),
           headers: {
             'Content-Type': 'application/json',
             'X-Authorization': JSON.parse(this.state.x_auth)
           }
        })
        .then((response) => {
          this.props.navigation.goBack();
        })
        .catch((error) => {
          console.error(error)
        })
    } else {
      return fetch('http://10.0.2.2:3333/api/v0.0.5/chits',
        {
           method: 'POST',
           body: JSON.stringify({
             chit_content: this.state.chit_content,
             timestamp: date
           }),
           headers: {
             'Content-Type': 'application/json',
             'X-Authorization': JSON.parse(this.state.x_auth)
           }
         })
         .then((response) => {
           this.props.navigation.goBack()
         })
         .catch((error) => {
           console.error(error)
         })
       }

     }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 10,
    backgroundColor: '#fcfbe4'
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#c7ddf5',
    padding: 10,
    marginLeft: 100,
    marginRight: 100,
    borderRadius: 3,
    elevation: 2,
    marginBottom: 5
  },
  textEntry: {
    alignItems: 'center',
    padding: 10,
    marginLeft: 100,
    marginTop: 100,
    marginBottom: 10,
    marginRight: 100,
    borderColor: '#74abe7',
    borderRadius: 5,
    borderWidth: 1.5,
    backgroundColor: '#ffffff',
    elevation: 3
  },
  checkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  }
})

export default AddChitScreen
