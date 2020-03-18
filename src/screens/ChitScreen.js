import React, { Component } from 'react'
import {
  TouchableOpacity,
  Image,
  TouchableHighlight,
  AsyncStorage,
  Alert,
  StyleSheet,
  Button,
  FlatList,
  ActivityIndicator,
  Text,
  View
} from 'react-native'
import { RNCamera } from 'react-native-camera'

// Component shows an individual chit as well as the poster, location information and image.
class ChitScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isLoading: true,
      chit_id: '',
      chit_content: '',
      posted_user_id: '',
      family_name: '',
      given_name: '',
      user_id: '',
      x_auth: '',
      longitude: '',
      latitude: '',
      chitList: []
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

  // Renders the chit information
  render () {
    const { navigate } = this.props.navigation

    if (this.state.isLoading) {
      return (
        <View style={styles.mainView}>
          <Text style={styles.loadingText}>Loading Chit...</Text>
          <ActivityIndicator />
        </View>
      )
    } else {
      if (this.state.chit_id) {
        if (this.state.posted_user_id == this.state.user_id) {
          return (
            <View style={styles.mainView}>

              <Text style={styles.chitItem}>
                {this.state.chit_content}{'\n'}{'\n'}
                {'Location: ' + this.state.latitude + ' ' + this.state.longitude}
              </Text>

              <TouchableHighlight onPress={() => navigate('ProfileScreen', {userID:this.state.posted_user_id})}>
                <Text style={styles.chitItem}>Posted By: {this.state.given_name} {this.state.family_name}</Text>
              </TouchableHighlight>

              <Image
                source={{
                  uri: ('http://10.0.2.2:3333/api/v0.0.5/chits/' + this.state.chit_id + '/photo')
                }}
                style={styles.chitPicture}
              />

              <RNCamera
                ref={ref => {
                  this.camera = ref;
                }}
                style={styles.captureView}
              />

              <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>

                <TouchableOpacity
                  onPress={this.takePicture.bind(this)}
                  style= {styles.takePictureButton}
                >
                <Text>
                  Add Picture
                </Text>
                </TouchableOpacity>

              </View>


            </View>
          )
        } else {
          return (
            <View style={styles.mainView}>

              <Text style={styles.chitItem}>
                {this.state.chit_content}{'\n'}{'\n'}
                {'Location: ' + this.state.latitude + ' ' + this.state.longitude}
              </Text>

              <TouchableHighlight onPress={() => navigate('ProfileScreen', {userID:this.state.posted_user_id})}>
                <Text style={styles.chitItem}>Posted By: {this.state.given_name} {this.state.family_name}</Text>
              </TouchableHighlight>

              <Image
                source={{
                  uri: ('http://10.0.2.2:3333/api/v0.0.5/chits/' + this.state.chit_id + '/photo')
                }}
                style={styles.chitPicture}
              />

            </View>
          )
        }
      } else {
        return (
          <View style={styles.mainView}>

            <Text>Chit not found</Text>

          </View>
        )
      }
    }
  }

  // Runs on start of component, calls the get parameters function.
  componentDidMount () {
    console.log('[STARTUP] ChitScreen Loaded')
    this.setState({
      latitude: 'No geotag found.'
    })
    this.getParams()
  }

  // Function gets parameters from navigation, including the chit and the user ID of the user who posted.
  getParams () {
    const { params } = this.props.navigation.state
    console.log('[DEBUG] Chit ID: ' + params.chitID + ' User ID: ' + params.userID + ' Content: ' + params.chitContent)
    this.setState({
      chit_id: params.chitID,
      posted_user_id: params.userID,
      chit_content: params.chitContent,
      isLoading: false
    })
    console.log('[SUCCESS] Got params from previous screen')
    this.getUserData(params.userID)
  }

  // Function loads user data from async storage and stores in the state.
  async loadUser () {
    const userId = await AsyncStorage.getItem('user_id')
    const parsedUserId = await JSON.parse(userId)
    const xAuth = await AsyncStorage.getItem('x_auth')
    const parsedXAuth = await JSON.parse(xAuth)
    this.setState({
      x_auth: parsedXAuth,
      user_id: parsedUserId
    })
    console.log('[SUCCESS] Loaded user data')
    this.getChits()
  }

  // Function gets the location of a chit based on the ID.
  getLocationFromChit () {
    console.log('[DEBUG] Attempting to get location from Chit ID')
    for (var i = 0; i < this.state.chitList.length; i++) {
      if (this.state.chit_id == this.state.chitList[i].chit_id) {
        console.log('[DEBUG] Page Chit ID was found in the chit list.')
        if (this.state.chitList[i].location.latitude && this.state.chitList[i].location.longitude) {
          console.log('[DEBUG] Found a geotag on this Chit')
          this.setState({
            latitude: this.state.chitList[i].location.latitude,
            longitude: this.state.chitList[i].location.longitude
          })
          console.log('[SUCCESS] Got location from chit ID ' + this.state.latitude + ' ' + this.state.longitude)
        } else {
          console.log('[DEBUG] This chit does not have geotag information, displaying without coordinates')
        }
      }
    }
  }

  // Function gets user data based on the ID of the user who posted, saves family name and given name in the state.
  getUserData (postedID) {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + postedID)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          given_name: responseJson.given_name,
          family_name: responseJson.family_name
        })
        console.log('[SUCCESS] Got user data successfully.')
        this.loadUser()
      })
      .catch((error) => {
        console.log('[ERROR] Error getting user data ' + error)
      })
  }

  // Function gets chits and saves the response in the state.
  getChits () {
    console.log('[DEBUG] Getting Chits..')
    return fetch('http://10.0.2.2:3333/api/v0.0.5/chits?start=0&count=50')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('[DEBUG] Got Chits, saving to state...')
        this.setState({
          isLoading: false,
          chitList: responseJson
        })
        console.log('[SUCCESS] Chits saved to state')
        this.getLocationFromChit()
      })
      .catch((error) => {
        console.log('[ERROR] Error getting chits. Log: ' + error)
      })
  }

  // Function takes picture and posts to API.
  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true }
      const data = await this.camera.takePictureAsync(options)

      console.log('[DEBUG] Chit Image: ' + data.uri)

      return fetch('http://10.0.2.2:3333/api/v0.0.5/chits/' + this.state.chit_id + '/photo',
        {
           method: 'POST',
           body: data,
           headers: {
             'Content-Type': 'image/jpeg',
             'X-Authorization': JSON.parse(this.state.x_auth),
           }
       })
       .then((response) => {
         console.log('[SUCCESS] Uploaded photo')
         Alert.alert('Photo Updated!')
       })
       .catch((error) => {
         console.error(error)
       });
     }
  }
}

const styles = StyleSheet.create({
  loadingText: {
    textAlign: 'center',
    marginBottom: 50,
    marginTop: 50
  },
  mainView: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fcfbe4'
  },
  chitItem: {
    margin: 5,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#e6ffff',
    elevation: 2
  },
  captureView: {
    flex: 1,
    padding: 15,
    alignSelf: 'center',
    paddingTop: 100
  },
  chitPicture: {
    width: 100,
    height: 100,
    marginLeft: 113,
    borderRadius: 5,
    marginBottom: 5,
    marginTop: 5
  },
  takePictureButton: {
    backgroundColor: '#c7ddf5',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    elevation: 5,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10
  }
})

export default ChitScreen
