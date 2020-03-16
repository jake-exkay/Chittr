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
      latitude: ''
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

              <Text style={styles.chitItem}>{this.state.chit_content}</Text>

              <Text style={styles.chitItem}>{this.state.latitude + ' ' + this.state.longitude}</Text>

              <Image
                source={{
                  uri: ('http://10.0.2.2:3333/api/v0.0.5/chits/' + this.state.chit_id + '/photo')
                }}
                style={styles.chitPicture}
              />

              <TouchableHighlight onPress={() => navigate('ProfileScreen', {userID:this.state.posted_user_id})}>
                <Text style={styles.chitItem}>Posted By: {this.state.given_name} {this.state.family_name}</Text>
              </TouchableHighlight>

              <RNCamera
                ref={ref => {
                  this.camera = ref;
                }}
                style={styles.captureView}
              />

              <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>

                <TouchableOpacity
                  onPress = {this.takePicture.bind(this)}
                  style =  {styles.capture}
                >
                <Text style={styles.takePictureText}>
                  Take Picture
                </Text>
                </TouchableOpacity>

              </View>


            </View>
          )
        } else {
          return (
            <View style={styles.mainView}>

              <Text style={styles.chitItem}>{this.state.chit_content}</Text>

              <Text style={styles.chitItem}>{this.state.latitude + ' ' + this.state.longitude}</Text>

              <Image
                source={{
                  uri: ('http://10.0.2.2:3333/api/v0.0.5/chits/' + this.state.chit_id + '/photo')
                }}
                style={styles.chitPicture}
              />

              <TouchableHighlight onPress={() => navigate('ProfileScreen', {userID:this.state.posted_user_id})}>
                <Text style={styles.chitItem}>Posted By: {this.state.given_name} {this.state.family_name}</Text>
              </TouchableHighlight>
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
    this.getParams()
  }

  // Function gets parameters from navigation, including the chit and the user ID of the user who posted.
  getParams () {
    const { params } = this.props.navigation.state
    console.log('Chit ID: ' + params.chitID + ' User ID: ' + params.userID + ' Content: ' + params.chitContent)
    this.setState({
      chit_id: params.chitID,
      posted_user_id: params.userID,
      chit_content: params.chitContent,
      longitude: params.longitude,
      latitude: params.latitude,
      isLoading: false
    })
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
        this.loadUser()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  // Function takes picture and posts to API.
  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true }
      const data = await this.camera.takePictureAsync(options)

      console.log('Chit Image: ' + data.uri)

      return fetch('http://10.0.2.2:3333/api/v0.0.5/chits/' + this.state.chit_id + '/photo',
        {
           method: 'POST',
           body: data,
           headers: {
             "Content-Type":"image/jpeg",
             "X-Authorization":JSON.parse(this.state.x_auth),
           }
       })
       .then((response) => {
         Alert.alert("Photo Updated!");
       })
       .catch((error) => {
         console.error(error);
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
    paddingTop: 150
  },
  chitPicture: {
    width: 200,
    height: 200,
    marginLeft: 113,
    borderRadius: 5,
    marginBottom: 5,
    marginTop: 5
  },
  takePictureText: {
    flex: 1,
    fontSize: 20,
    paddingBottom: 100
  }
})

export default ChitScreen
