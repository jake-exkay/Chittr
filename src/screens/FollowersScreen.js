import React, { Component } from 'react'
import {
  AsyncStorage,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Text,
  View
} from 'react-native'

class FollowersScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isLoading: true,
      user_id: '',
      x_auth: '',
      profile_id: '2',
      followerList: []
    }
  }

  render () {
    if (this.state.isLoading) {
      return (
        <View style={styles.view}>
          <Text style={styles.loadingtext}>Loading Users...</Text>
          <ActivityIndicator />
        </View>
      )
    } else {
      if (this.state.followerList && this.state.followerList.length < 0) {
        return (
          <View style={styles.view}>
            <Text style={styles.nofollowers}>This user does not have any followers!</Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Profile')}
              style={styles.button}
            >
              <Text>Follow them?</Text>
            </TouchableOpacity>
          </View>
        )
      } else {
        return (
          <View style={styles.view}>
            <FlatList
              data={this.state.followerList}
              renderItem={({ item }) =>
                <Text style={styles.followername}>{item.given_name} {item.family_name}</Text>
              }
              keyExtractor={({ user_id }, index) => user_id.toString()}
              style={{ margin: 20 }}
            />
          </View>
        )
      }
    }
  }

  componentDidMount () {
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
    this.getFollowers()
  }

  getFollowers () {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.profile_id + '/followers')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          followerList: responseJson
        })
        console.log(this.state.followerList)
      })
      .catch((error) => {
        console.log(error)
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
    elevation: 2,
    marginTop: 10
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
  },
  nofollowers: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 200
  },
  followername: {
    textAlign: 'center',
    fontSize: 20
  }
})

export default FollowersScreen
