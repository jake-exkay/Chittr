import React, { Component } from 'react'
import {
  TextInput,
  Image,
  TouchableOpacity,
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

class HomeScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isLoading: true,
      chitList: [],
      user_id: '',
      x_auth: '',
      given_name: '',
      family_name: '',
      chit_content: ''
    }
  }

  handleChitContent = (text) => {
    this.setState({
      chit_content: text
    })
  }

  static navigationOptions = {
    headerTitle: () => (
        <Image
          source = {require("../../img/chittr_logo.png")}
          style = {{width: 100, height: 50, marginLeft: 140}}
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
          <Text style={styles.loadingText}>Loading Chits...</Text>
          <ActivityIndicator />
        </View>
      )
    } else {
      if (this.state.user_id) {
        return (
          <View style={styles.mainView} accessibile={true}>

            <View style={styles.userBar}>

              <Image
                source={{
                  uri: ('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.user_id + '/photo')
                }}
                style={styles.userBarPicture}
              />

              <View style={styles.rightBar}>

                <Text style={styles.userBarText}>Hello, {this.state.given_name}. What's happening?</Text>

                <TextInput
                  style={styles.userBarEntry}
                  onChangeText={this.handleChitContent}
                  placeholder='Type Chit...'
                  accessibilityLabel='Chit Content'
                  accessibilityHint='Enter chit content here'
                  accessibilityRole='keyboardkey'
                />

                <TouchableOpacity
                  onPress={() => this.addChit()}
                  style={styles.addChitButton}
                  accessibilityLabel='Post Chit'
                  accessibilityHint='Press the button to post the chit'
                  accessibilityRole='button'
                >
                  <Text>Post</Text>
                </TouchableOpacity>

                <Text style={styles.errorMessage}>{this.state.validation}</Text>

              </View>

            </View>

            <View style={styles.buttonView}>
              <TouchableOpacity
                onPress = {() => this.logoutUser()}
                style = {styles.topButton}
                accessibilityLabel='Logout'
                accessibilityHint='Press the button to logout'
                accessibilityRole='button'
              >
                <Text>Logout</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress = {() => navigate('ProfileScreen', {userID:this.state.user_id})}
                style = {styles.topButton}
                accessibilityLabel='Profile'
                accessibilityHint='Press the button to view your profile'
                accessibilityRole='button'
              >
                <Text>Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress = {() => navigate('AddChitScreen')}
                style = {styles.topButton}
                accessibilityLabel='Add Chit'
                accessibilityHint='Press the button to view the add chit screen'
                accessibilityRole='button'
              >
                <Text>Add Chit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress = {() => navigate('SearchBarScreen')}
                style = {styles.topButton}
                accessibilityLabel='Search'
                accessibilityHint='Press the button to search for users'
                accessibilityRole='button'
              >
                <Text>Search</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.recentChits}>Recent Chits</Text>

            <FlatList
              data={this.state.chitList.reverse()}
              renderItem={({ item }) =>
                <TouchableHighlight onPress={() => navigate('ChitScreen', {chitID:item.chit_id, chitContent:item.chit_content, userID:item.user.user_id, longitude:item.location.longitude, latitude:item.location.latitude})}>
                  <Text style={styles.chitItem}>
                    <Text style={styles.chitHeader}>{item.user.given_name} {item.user.family_name} says: {'\n'}</Text>
                    <Text>{item.chit_content}{'\n'}{'\n'}</Text>
                    <Text style={styles.timestamp}>Posted {new Date(item.timestamp).toLocaleString()}</Text>
                  </Text>
                </TouchableHighlight>
              }
              keyExtractor={({ chit_id }, index) => chit_id.toString()}
              style={{ margin: 20 }}
            />

          </View>
        )
      } else {
        return (
          <View style={styles.mainView} accessibile={true}>

            <View style={styles.buttonView}>

            <TouchableOpacity
              onPress = {() => navigate('LoginScreen')}
              style = {styles.topButton}
              accessibilityLabel='Login'
              accessibilityHint='Press the button to login'
              accessibilityRole='button'
            >
              <Text>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress = {() => navigate('RegisterScreen')}
              style = {styles.topButton}
              accessibilityLabel='Register'
              accessibilityHint='Press the button to view the register screen'
              accessibilityRole='button'
            >
              <Text>Register</Text>
            </TouchableOpacity>

            </View>

            <Text style={styles.recentChits}>Recent Chits</Text>

            <FlatList
              data={this.state.chitList}
              renderItem={({ item }) =>
                <TouchableHighlight onPress={() => navigate('ChitScreen', {chitID:item.chit_id, chitContent:item.chit_content, userID:item.user.user_id, longitude:item.location.longitude, latitude:item.location.latitude})}>
                  <Text style={styles.chitItem}>
                    <Text style={styles.chitHeader}>{item.user.given_name} {item.user.family_name} says: {'\n'}</Text>
                    <Text>{item.chit_content}{'\n'}{'\n'}</Text>
                    <Text style={styles.timestamp}>Posted {new Date(item.timestamp).toLocaleString()}</Text>
                  </Text>
                </TouchableHighlight>
              }
              keyExtractor={({ chit_id }, index) => chit_id.toString()}
              style={{ margin: 20 }}
            />

          </View>
        )
      }
    }
  }

  // Runs on startup of component, loads the user data.
  componentDidMount () {
    console.log('[STARTUP] HomeScreen Loaded')
    this.loadUser()
  }

  // Loads the user data from async storage and stores in the state.
  async loadUser () {
    const userId = await AsyncStorage.getItem('user_id')
    const parsedUserId = await JSON.parse(userId)
    const xAuth = await AsyncStorage.getItem('x_auth')
    const parsedXAuth = await JSON.parse(xAuth)
    this.setState({
      x_auth: parsedXAuth,
      user_id: parsedUserId
    })
    console.log('[DEBUG] User Loaded: ' + this.state.user_id + ' with auth: ' + this.state.x_auth)
    this.getUserData()
    this.getChits()
  }

  // Function adds a chit, sends a POST request to the API.
  addChit () {
    var date = Date.parse(new Date())
    console.log('[DEBUG] Adding Chit..')

    if (this.state.chit_content == '') {
      this.setState({
        validation: 'Please type a Chit!'
      })
      console.log('[ERROR] User did not type a chit, displaying error.')
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
           if (this.state.chit_content.length > 141) {
             console.log('[SUCCESS] Chit Added (limited characters)')
             Alert.alert('Chit Added (limited to 141 characters)')
           } else {
             console.log('[SUCCESS] Chit Added')
             Alert.alert('Chit Added')
           }
         })
         .catch((error) => {
           console.log('[ERROR] Error adding chit. Log: ' + error)
         })
    }
  }

  // Gets name of the user based on the profile ID field in the state.
  getUserData () {
    console.log('[DEBUG] Getting User Data..')
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.user_id)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('[DEBUG] Got user data, saving to state..')
        this.setState({
          given_name: responseJson.given_name,
          family_name: responseJson.family_name,
        })
        console.log('[SUCCESS] User data saved to state..')
      })
      .catch((error) => {
        console.log('[ERROR] Error getting user data. Log: ' + error)
      })
  }

  // Removes a user from async storage (used when logging out).
  async removeUser () {
    try {
      await AsyncStorage.removeItem('x_auth')
      await AsyncStorage.removeItem('user_id')
      console.log('[SUCCESS] Removed stored user ID and x_auth')
    } catch (error) {
      console.log(error)
    }
  }

  // Function gets chits and saves the response in the state. The 50 most recent chits are returned,
  // starting from position 0.
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
      })
      .catch((error) => {
        console.log('[ERROR] Error getting chits. Log: ' + error)
      })
  }

  // Function posts to the API using the logout endpoint and calls the function to remove user data from the async state.
  logoutUser () {
    console.log('[DEBUG] Attempting to log out user')

    return fetch('http://10.0.2.2:3333/api/v0.0.5/logout',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': this.state.x_auth
        }
      })
      .then((response) => 'OK')
      .then((responseJson) => {
        console.log('[SUCCESS] User log out successful')
        Alert.alert('Logged Out!')
        this.removeUser()
      })
      .catch((error) => {
        console.log('[ERROR] Error logging out user. Log: ' + error)
      })
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
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10
  },
  topButton: {
    backgroundColor: '#c7ddf5',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    elevation: 5,
    borderRadius: 10
  },
  recentChits: {
    fontWeight: 'bold',
    paddingTop: 20,
    textAlign: 'center'
  },
  chitItem: {
    margin: 5,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#e6ffff',
    elevation: 2
  },
  chitHeader: {
    fontWeight: 'bold'
  },
  userBar: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
    marginBottom: 10
  },
  rightBar: {
    flexDirection: 'column'
  },
  userBarText: {
    marginLeft: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  userBarPicture: {
    width: 100,
    height: 100,
    marginLeft: 20,
    borderRadius: 50,
    marginBottom: 10,
    marginTop: 10
  },
  userBarEntry: {
    marginLeft: 20,
    padding: 10,
    borderColor: '#74abe7',
    borderRadius: 5,
    borderWidth: 1.5,
    backgroundColor: '#ffffff',
    elevation: 3
  },
  addChitButton: {
    backgroundColor: '#c7ddf5',
    marginTop: 10,
    padding: 5,
    marginLeft: 20,
    marginRight: 160,
    elevation: 5,
    borderRadius: 10
  },
  timestamp: {
    fontSize: 10
  },
  errorMessage: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 15,
    color: 'red'
  }
})

export default HomeScreen
