import React, { Component } from 'react'
import {
  AsyncStorage,
  StyleSheet,
  TouchableOpacity,
  Text,
  View
} from 'react-native'

class ProfileScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user_id: '',
      x_auth: '',
      given_name: '',
      family_name: '',
      profile_id: '2',
      followerList: [],
      isFollower: false
    }
  }

  render () {

    const { navigate } = this.props.navigation

    // User not logged in
    if (this.state.user_id === false) {
      return (
        <View style={styles.view}>

          <Text style={styles.username}>{this.state.given_name + ' ' + this.state.family_name}</Text>

          <TouchableOpacity
            title='Followers'
            onPress={() => navigate('FollowersScreen', {userID:this.state.profile_id})}
          />

          <TouchableOpacity
            title='Following'
            onPress={() => navigate('FollowersScreen', {userID:this.state.profile_id})}
          />

        </View>
      )

    // User viewing their own profile
    } else if (this.state.user_id === this.state.profile_id) {
      return (
        <View style={styles.view}>

          <Text style={styles.username}>{this.state.given_name + ' ' + this.state.family_name}</Text>

          <TouchableOpacity
            onPress={() => navigate('AccountScreen')}
            style={styles.button}
          >
            <Text>Edit Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigate('FollowersScreen', {userID:this.state.profile_id})}
            style={styles.button}
          >
            <Text>Followers</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigate('FollowersScreen', {userID:this.state.profile_id})}
            style={styles.button}
          >
            <Text>Following</Text>
          </TouchableOpacity>

        </View>
      )
    // User viewing another profile
    } else {
      if (this.state.isFollower == false) {
        return (
          <View style={styles.view}>

            <Text style={styles.username}>{this.state.given_name + ' ' + this.state.family_name}</Text>

            <TouchableOpacity
              onPress={() => this.followUser()}
              style={styles.button}
            >
              <Text>Follow</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigate('FollowersScreen', {userID:this.state.profile_id})}
              style={styles.button}
            >
              <Text>Followers</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigate('FollowingScreen', {userID:this.state.profile_id})}
              style={styles.button}
            >
              <Text>Following</Text>
            </TouchableOpacity>

          </View>
        )
      } else {
        return (
          <View style={styles.view}>

            <Text style={styles.username}>{this.state.given_name + ' ' + this.state.family_name}</Text>

            <TouchableOpacity
              onPress={() => this.unfollowUser()}
              style={styles.button}
            >
              <Text>Unfollow</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigate('FollowersScreen', {userID:this.state.profile_id})}
              style={styles.button}
            >
              <Text>Followers</Text>
            </TouchableOpacity>

            <TouchableOpacity
            onPress={() => navigate('FollowingScreen', {userID:this.state.profile_id})}
              style={styles.button}
            >
              <Text>Following</Text>
            </TouchableOpacity>

          </View>
        )
      }

    }
  }

  componentDidMount () {
    this.getParams()
  }

  getParams() {
    const { params } = this.props.navigation.state
    this.setState({
      profile_id: params.userID,
    })
    this.loadUser()
  }

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
    console.log(this.state.user_id + ' is viewing the profile of ' + this.state.profile_id)
  }

  getUserData () {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.profile_id)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          given_name: responseJson.given_name,
          family_name: responseJson.family_name
        })
        this.getFollowers()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  getFollowers () {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.profile_id + '/followers')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          followerList: responseJson
        })
        this.isFollower()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  isFollower () {
    console.log(this.state.followerList)
    for (var i = 0; i < this.state.followerList.length; i++) {
      if (this.state.user_id == this.state.followerList[i].user_id) {
        this.setState({
          isFollower: true
        })
        console.log("User is a follower of " + this.state.profile_id)
      }
    }
  }

  getProfilePicture () {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.profile_id + '/photo')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          profile_picture: responseJson
        })
        console.log(responseJson)
      })
      .catch((error) => {
        console.log(error)
      })
  }

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
        console.log('User ' + this.state.user_id + ' followed ' + this.state.profile_id)
      })
      .catch((error) => {
        console.error(error)
      })
  }

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
        console.log('User ' + this.state.user_id + ' unfollowed ' + this.state.profile_id)
      })
      .catch((error) => {
        console.error(error)
      })
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
  view: {
    marginTop: 10
  },
  logo: {
    width: 200,
    height: 100,
    justifyContent: 'center',
    marginLeft: 105
  },
  username: {
    textAlign: 'center',
    fontSize: 30,
    marginBottom: 30
  }
})

export default ProfileScreen
