import React, { Component } from 'react'
import {
  Image,
  AsyncStorage,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Text,
  View
} from 'react-native'
import { RNCamera } from 'react-native-camera'

// Component consists of the ability to take a picture and upload it as the users' profile image.
class ChangePictureScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      user_id: '',
      x_auth: ''
    }
  }

  static navigationOptions = {
    headerTitle: () => (
        <Image
          source = {require('../../img/chittr_logo.png')}
          style = {{width: 100, height: 50, marginLeft: 85}}
        />
      ),
    headerStyle: {
      backgroundColor: '#29a9ff'
    }
  }

  handleEmail = (text) => {
    this.setState({
      email: text
    })
  }

  handlePassword = (text) => {
    this.setState({
      password: text
    })
  }

  handleFirstName = (text) => {
    this.setState({
      given_name: text
    })
  }

  handleLastName = (text) => {
    this.setState({
      family_name: text
    })
  }

  // Contains large camera view and a button to take a picture.
  render () {
    return (
      <View style={styles.mainView} accessible={true}>
        <Text style={styles.accountHeader}>Update Profile Picture</Text>

        <RNCamera
          ref={ref => {
            this.camera = ref
          }}
          style={styles.captureView}
        />

        <TouchableOpacity
          onPress={this.takePicture.bind(this)}
          style= {styles.button}
          accessibilityLabel='Change Profile Picture'
          accessibilityHint='Press the button to change your profile picture'
          accessibilityRole='button'
        >
          <Text style={{ fontSize: 16 }}>Take Picture</Text>
        </TouchableOpacity>

      </View>
    );
  }

  // Function runs on startup of component, loads the user details.
  componentDidMount () {
    this.loadUser();
  }

  // Function loads the user ID and the x-auth token from async storage and stores in state.
  async loadUser () {
    let userId = await AsyncStorage.getItem('user_id')
    let parsedUserId = await JSON.parse(userId)
    let xAuth = await AsyncStorage.getItem('x_auth')
    let parsedXAuth = await JSON.parse(xAuth)
    this.setState({
      x_auth: parsedXAuth,
      user_id: parsedUserId
    })
    console.log('Loaded data from user ID: ' + this.state.user_id + ' and x-auth: ' + this.state.x_auth)
  }

  // Function takes a picture of the current selected preview. When the picture is taken, it is sent
  // via the API to upload the user's profile picture.
  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true }
      const data = await this.camera.takePictureAsync(options)

      console.log('Profile Picture URI: ' + data.uri)

      return fetch('http://10.0.2.2:3333/api/v0.0.5/user/photo',
        {
           method: 'POST',
           body: data,
           headers: {
             'Content-Type': 'image/jpeg',
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
    elevation: 2
  },
  accountHeader: {
    marginLeft: 65,
    fontSize: 30,
    marginBottom: 10
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  captureView: {
    flex: 0,
    borderRadius: 5,
    padding: 240,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginBottom: 10,
    elevation: 5
  }
})

export default ChangePictureScreen
