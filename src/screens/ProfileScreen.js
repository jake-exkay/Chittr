import React, { Component } from 'react'
import {
  Image,
  ActivityIndicator,
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
      isLoading: true,
      user_id: '',
      x_auth: '',
      given_name: '',
      family_name: '',
      profile_id: '',
      followerList: [],
      isFollower: false,
      profile_picture: ''
    }
  }

  static navigationOptions = {
    headerTitle: () => (
        <Image
          source = {require("../../img/chittr_logo.png")}
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
          <Text style={styles.loadingText}>Loading Profile...</Text>
          <ActivityIndicator />
        </View>
      )
    // User not logged in
    } else if (this.state.user_id === false) {
      return (
        <View style={styles.mainView}>

          <Text style={styles.username}>{this.state.given_name + ' ' + this.state.family_name}</Text>

          <View style={styles.buttonView}>
            <TouchableOpacity
              title='Followers'
              onPress={() => navigate('FollowersScreen', {userID:this.state.profile_id})}
            />

            <TouchableOpacity
              title='Following'
              onPress={() => navigate('FollowersScreen', {userID:this.state.profile_id})}
            />
          </View>

        </View>
      )

    // User viewing their own profile
    } else if (this.state.user_id == this.state.profile_id) {
      return (
        <View style={styles.mainView}>

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
            >
              <Text>Edit Account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigate('FollowersScreen', {userID:this.state.profile_id})}
              style={styles.profileButton}
            >
              <Text>Followers</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigate('FollowersScreen', {userID:this.state.profile_id})}
              style={styles.profileButton}
            >
              <Text>Following</Text>
            </TouchableOpacity>
          </View>

        </View>
      )
    // User viewing another profile
    } else {
      if (this.state.isFollower == false) {
        return (
          <View style={styles.mainView}>

            <Text style={styles.username}>{this.state.given_name + ' ' + this.state.family_name}</Text>

            <View style={styles.buttonView}>
              <TouchableOpacity
                onPress={() => this.followUser()}
                style={styles.profileButton}
              >
                <Text>Follow</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigate('FollowersScreen', {userID:this.state.profile_id})}
                style={styles.profileButton}
              >
                <Text>Followers</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigate('FollowingScreen', {userID:this.state.profile_id})}
                style={styles.profileButton}
              >
                <Text>Following</Text>
              </TouchableOpacity>
            </View>

          </View>
        )
      } else {
        return (
          <View style={styles.mainView}>

            <Text style={styles.username}>{this.state.given_name + ' ' + this.state.family_name}</Text>

            <View style={styles.buttonView}>
              <TouchableOpacity
                onPress={() => this.unfollowUser()}
                style={styles.profileButton}
              >
                <Text>Unfollow</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigate('FollowersScreen', {userID:this.state.profile_id})}
                style={styles.profileButton}
              >
                <Text>Followers</Text>
              </TouchableOpacity>

              <TouchableOpacity
              onPress={() => navigate('FollowingScreen', {userID:this.state.profile_id})}
                style={styles.profileButton}
              >
                <Text>Following</Text>
              </TouchableOpacity>
            </View>

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
          family_name: responseJson.family_name,
          isLoading: false
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
    backgroundColor: '#e6ffff',
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

  }
})

export default ProfileScreen
