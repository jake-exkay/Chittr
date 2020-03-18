import React, { Component } from 'react'
import {
  FlatList,
  Image,
  ActivityIndicator,
  AsyncStorage,
  StyleSheet,
  TouchableOpacity,
  Text,
  View
} from 'react-native'

// Component displays the profile of a user based on the profile_id field in the state.
class ProfileScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isLoading: true,
      user_id: '',
      x_auth: '',
      given_name: '',
      family_name: '',
      profile_id: '',
      followerList: [],
      chitList: [],
      isFollower: false
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

  render () {

    const { navigate } = this.props.navigation

    if (this.state.isLoading) {
      return (
        <View style={styles.mainView}>
          <Text style={styles.loadingText}>Loading Profile...</Text>
          <ActivityIndicator />
        </View>
      )
    // User not logged in
    } else if (this.state.user_id === false) {
      return (
        <View style={styles.mainView} accessible={true}>

          <Text style={styles.username}>{this.state.given_name + ' ' + this.state.family_name}</Text>

          <Image
            source={{
              uri: ('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.profile_id + '/photo')
            }}
            style={styles.profilePicture}
          />

          <View style={styles.buttonView}>
            <TouchableOpacity
              title='Followers'
              onPress={() => navigate('FollowersScreen', {userID:this.state.profile_id})}
              accessibilityLabel='View Followers'
              accessibilityHint='Press the button to view the followers of the user'
              accessibilityRole='button'
            />

            <TouchableOpacity
              title='Following'
              onPress={() => navigate('FollowingScreen', {userID:this.state.profile_id})}
              accessibilityLabel='View Following'
              accessibilityHint='Press the button to see who the user is following'
              accessibilityRole='button'
            />
          </View>

          <Text style={styles.recentChits}>{this.state.given_name + ' ' + this.state.family_name} says:</Text>

          <FlatList
            data={this.state.chitList}
            renderItem={({ item }) =>
              <Text style={styles.chitItem}>
              <Text>{item.chit_content}{'\n'}{'\n'}</Text>
                <Text style={styles.timestamp}>Posted {new Date(item.timestamp).toLocaleString()}</Text>
              </Text>
            }
            keyExtractor={({ chit_id }, index) => chit_id.toString()}
            style={{ margin: 20 }}
          />

        </View>
      )

    // User viewing their own profile
    } else if (this.state.user_id == this.state.profile_id) {
      return (
        <View style={styles.mainView} accessible={true}>

          <Text style={styles.username}>{this.state.given_name + ' ' + this.state.family_name}</Text>

          <Image
            source={{
              uri: ('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.profile_id + '/photo')
            }}
            style={styles.profilePicture}
          />

          <View style={styles.buttonView}>
            <TouchableOpacity
              onPress={() => navigate('AccountScreen')}
              style={styles.profileButton}
              accessibilityLabel='Edit Account'
              accessibilityHint='Press the button to make changes to your account'
              accessibilityRole='button'
            >
              <Text>Edit Account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigate('FollowersScreen', {userID:this.state.profile_id})}
              style={styles.profileButton}
              accessibilityLabel='View Followers'
              accessibilityHint='Press the button to view your followers'
              accessibilityRole='button'
            >
              <Text>Followers</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigate('FollowingScreen', {userID:this.state.profile_id})}
              style={styles.profileButton}
              accessibilityLabel='View Following'
              accessibilityHint='Press the button to view users you are following'
              accessibilityRole='button'
            >
              <Text>Following</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.recentChits}>{this.state.given_name + ' ' + this.state.family_name} says:</Text>

          <FlatList
            data={this.state.chitList}
            renderItem={({ item }) =>
              <Text style={styles.chitItem}>
                <Text>{item.chit_content}{'\n'}{'\n'}</Text>
                <Text style={styles.timestamp}>Posted {new Date(item.timestamp).toLocaleString()}</Text>
              </Text>
            }
            keyExtractor={({ chit_id }, index) => chit_id.toString()}
            style={{ margin: 20 }}
          />

        </View>
      )
    // User viewing another profile
    } else {
      if (this.state.isFollower == false) {
        return (
          <View style={styles.mainView} accessible={true}>

            <Text style={styles.username}>{this.state.given_name + ' ' + this.state.family_name}</Text>

            <Image
              source={{
                uri: ('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.profile_id + '/photo')
              }}
              style={styles.profilePicture}
            />

            <View style={styles.buttonView}>
              <TouchableOpacity
                onPress={() => this.followUser()}
                style={styles.profileButton}
                accessibilityLabel='Follow User'
                accessibilityHint='Press the button to follow the user'
                accessibilityRole='button'
              >
                <Text>Follow</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigate('FollowersScreen', {userID:this.state.profile_id})}
                style={styles.profileButton}
                accessibilityLabel='View Followers'
                accessibilityHint='Press the button to view the followers of the user'
                accessibilityRole='button'
              >
                <Text>Followers</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigate('FollowingScreen', {userID:this.state.profile_id})}
                style={styles.profileButton}
                accessibilityLabel='View Following'
                accessibilityHint='Press the button to see who the user is following'
                accessibilityRole='button'
              >
                <Text>Following</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.recentChits}>{this.state.given_name + ' ' + this.state.family_name} says:</Text>

            <FlatList
              data={this.state.chitList}
              renderItem={({ item }) =>
                <Text style={styles.chitItem}>
                  <Text>{item.chit_content}{'\n'}{'\n'}</Text>
                  <Text style={styles.timestamp}>Posted {new Date(item.timestamp).toLocaleString()}</Text>
                </Text>
              }
              keyExtractor={({ chit_id }, index) => chit_id.toString()}
              style={{ margin: 20 }}
            />

          </View>
        )
      } else {
        return (
          <View style={styles.mainView} accessible={true}>

            <Text style={styles.username}>{this.state.given_name + ' ' + this.state.family_name}</Text>

            <Image
              source={{
                uri: ('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.profile_id + '/photo')
              }}
              style={styles.profilePicture}
            />

            <View style={styles.buttonView}>
              <TouchableOpacity
                onPress={() => this.unfollowUser()}
                style={styles.profileButton}
                accessibilityLabel='Unfollow User'
                accessibilityHint='Press the button to unfollow the user'
                accessibilityRole='button'
              >
                <Text>Unfollow</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigate('FollowersScreen', {userID:this.state.profile_id})}
                style={styles.profileButton}
                accessibilityLabel='View Followers'
                accessibilityHint='Press the button to view the followers of the user'
                accessibilityRole='button'
              >
                <Text>Followers</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigate('FollowingScreen', {userID:this.state.profile_id})}
                style={styles.profileButton}
                accessibilityLabel='View Followers'
                accessibilityHint='Press the button to see who the user is following'
                accessibilityRole='button'
              >
                <Text>Following</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.recentChits}>{this.state.given_name + ' ' + this.state.family_name} says:</Text>

            <FlatList
              data={this.state.chitList}
              renderItem={({ item }) =>
                <Text style={styles.chitItem}>
                  <Text>{item.chit_content}{'\n'}{'\n'}</Text>
                  <Text style={styles.timestamp}>Posted {new Date(item.timestamp).toLocaleString()}</Text>
                </Text>
              }
              keyExtractor={({ chit_id }, index) => chit_id.toString()}
              style={{ margin: 20 }}
            />

          </View>
        )
      }
    }
  }

  // Runs when component loads, calls the getParams function.
  componentDidMount () {
    console.log('[STARTUP] ProfileScreen Loaded')
    this.getParams()
  }

  // Gets parameters from the previous screen, updates the state with the ID of the users profile.
  getParams () {
    console.log('[DEBUG] Got params from previous state')
    const { params } = this.props.navigation.state
    this.setState({
      profile_id: params.userID
    })
    this.loadUser()
  }

  // Loads user data from the async storage and saves the results to the state.
  async loadUser () {
    const userId = await AsyncStorage.getItem('user_id')
    const parsedUserId = await JSON.parse(userId)
    const xAuth = await AsyncStorage.getItem('x_auth')
    const parsedXAuth = await JSON.parse(xAuth)
    this.setState({
      x_auth: parsedXAuth,
      user_id: parsedUserId
    })
    this.getUserData()
    console.log('[DEBUG] ' + this.state.user_id + ' is viewing the profile of ' + this.state.profile_id)
  }

  // Gets name of the user based on the profile ID field in the state.
  getUserData () {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.profile_id)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          given_name: responseJson.given_name,
          family_name: responseJson.family_name,
          isLoading: false
        })
        console.log('[SUCCESS] Got user data successfully')
        this.getChits()
        this.getFollowers()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  // Gets the followers of the user specified in the profile ID field and saves as a list in the state.
  getFollowers () {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.profile_id + '/followers')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          followerList: responseJson
        })
        console.log('[SUCCESS] Got follower data successfully')
        this.isFollower()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  // Gets all the chits and stores in a list.
  getChits () {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.profile_id)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          chitList: responseJson.recent_chits
        })
        console.log('[SUCCESS] Got Chit data successfully')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  // Checks if the user is a follower by looping through the follower list and updating the state if true.
  isFollower () {
    console.log(this.state.followerList)
    for (var i = 0; i < this.state.followerList.length; i++) {
      if (this.state.user_id == this.state.followerList[i].user_id) {
        this.setState({
          isFollower: true
        })
        console.log('[DEBUG] User is a follower of ' + this.state.profile_id)
      }
    }
  }

  // Function posts to the API to follow a user.
  followUser () {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.profile_id + '/follow',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': JSON.parse(this.state.x_auth)
        }
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('[DEBUG] User ' + this.state.user_id + ' followed ' + this.state.profile_id)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // Function sends a delete request to the API to unfollow a user.
  unfollowUser () {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.profile_id + '/follow',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': JSON.parse(this.state.x_auth)
        }
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('[DEBUG] User ' + this.state.user_id + ' unfollowed ' + this.state.profile_id)
      })
      .catch((error) => {
        console.error(error)
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
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10
  },
  profileButton: {
    backgroundColor: '#c7ddf5',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    elevation: 5,
    borderRadius: 10
  },
  username: {
    textAlign: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    fontSize: 25
  },
  profilePicture: {
    width: 150,
    height: 150,
    marginLeft: 138,
    borderRadius: 100,
    marginBottom: 20
  },
  chitItem: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#e6ffff',
    elevation: 2
  },
  recentChits: {
    fontWeight: 'bold',
    paddingTop: 20,
    textAlign: 'center',
    marginTop: 10
  },
  timestamp: {
    fontSize: 10
  }
})

export default ProfileScreen
