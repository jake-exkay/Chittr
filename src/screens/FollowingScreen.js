import React, { Component } from 'react'
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
  View
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

// Component shows a list of users that the currently viewed user is following.
class FollowingScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      user_id: '',
      x_auth: '',
      profile_id: '',
      followerList: []
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

  // Renders a list of users the profile is following.
  render () {
    const { navigate } = this.props.navigation

    if (this.state.isLoading) {
      return (
        <View style={styles.mainView}>
          <Text style={styles.loadingText}>Loading Users...</Text>
          <ActivityIndicator />
        </View>
      )
    } else {
      return (
        <View style={styles.mainView}>

          <Text style={styles.header}>Following</Text>

          <FlatList
            data={this.state.followerList}
            renderItem={({ item }) =>
              <TouchableOpacity
                onPress={() => this.props.navigation.replace('ProfileScreen', {userID:item.user_id})}
                style={styles.button}
                accessibilityLabel='View user profile'
                accessibilityHint='Press the button to view the users profile'
                accessibilityRole='button'
              >
                <Text>{item.given_name} {item.family_name}</Text>
              </TouchableOpacity>
            }
            keyExtractor={({ user_id }, index) => user_id.toString()}
            style={{ margin: 20 }}
          />

        </View>
      )
    }
  }

  // Runs when component loads, calls the first function to get parameters from the previous screen.
  componentDidMount () {
    console.log('[STARTUP] FollowingScreen Loaded')
    this.getParams()
  }

  // Gets the user ID from the previous screen and saves to state. This ID is that of the profile
  // that is being viewed.
  getParams () {
    const { params } = this.props.navigation.state
    this.setState({
      profile_id: params.userID
    })
    this.loadUser()
  }

  // Loads the current logged in user details from async storage and stores in state.
  async loadUser () {
    const userId = await AsyncStorage.getItem('user_id')
    const parsedUserId = await JSON.parse(userId)
    const xAuth = await AsyncStorage.getItem('x_auth')
    const parsedXAuth = await JSON.parse(xAuth)
    this.setState({
      x_auth: parsedXAuth,
      user_id: parsedUserId
    })
    console.log('[DEBUG] Loaded user data.')
    this.getFollowing()
  }

  // Gets a list of following users based on the profile ID being viewed and stores the list in the state.
  getFollowing () {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.profile_id + '/following')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          followerList: responseJson
        })
        console.log('[DEBUG] Got following data.')
      })
      .catch((error) => {
        console.log('[ERROR] Error loading following data. Log: ' + error)
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
  header: {
    textAlign: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    fontSize: 20
  }
})

export default FollowingScreen
