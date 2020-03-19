import React, { Component } from 'react'
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Text,
  View
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

// Component shows a list of users who are following the user specified in the profile_id field in the state.
class FollowersScreen extends Component {

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

  // Renders a list of followers, but if the user does not have any followers, a message will be displayed.
  render () {
    if (this.state.isLoading) {
      return (
        <View style={styles.mainView}>
          <Text style={styles.loadingText}>Loading Users...</Text>
          <ActivityIndicator />
        </View>
      )
    } else {
      if (this.state.followerList.length < 0) {
        return (
          <View style={styles.mainView}>

            <Text style={styles.noFollowers}>This user does not have any followers!</Text>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Profile')}
              style={styles.button}
              accessibilityLabel='Follow them?'
              accessibilityHint='Returns to the users profile'
              accessibilityRole='button'
            >
              <Text>Follow them?</Text>
            </TouchableOpacity>

          </View>
        )
      } else {
        return (
          <View style={styles.mainView}>

            <FlatList
              data={this.state.followerList}
              renderItem={({ item }) =>
                <Text style={styles.followerName}>{item.given_name} {item.family_name}</Text>
              }
              keyExtractor={({ user_id }, index) => user_id.toString()}
              style={{ margin: 20 }}
            />

          </View>
        )
      }
    }
  }

  // Runs on component start, calls the function to get parameters from previous screen.
  componentDidMount () {
    console.log('[STARTUP] FollowersScreen Loaded')
    this.getParams()
  }

  // Function gets parameters from previous screen which is the user ID to check for followers.
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
    console.log('[DEBUG] User data loaded.')
    this.getFollowers()
  }

  // Gets a list of followers based on the profile ID being viewed and stores the list in the state.
  getFollowers () {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.profile_id + '/followers')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          followerList: responseJson
        })
        console.log('[DEBUG] Got followers: ' + this.state.followerList)
      })
      .catch((error) => {
        console.log('[ERROR] Error getting followers. Log: ' + error)
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
    marginTop: 10
  },
  noFollowers: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 200
  },
  followerName: {
    textAlign: 'center',
    fontSize: 20
  }
})

export default FollowersScreen
