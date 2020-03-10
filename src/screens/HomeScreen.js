import React, { Component } from 'react'
import {
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
      x_auth: ''
    }
  }

  render () {
    if (this.state.isLoading) {
      return (
        <View style={styles.view}>
          <Text style={styles.loadingtext}>Loading Chits...</Text>
          <ActivityIndicator />
        </View>
      )
    } else {
      if (this.state.user_id) {
        return (
          <View style={styles.view}>

            <Button
              title='Logout'
              onPress={() => this.logoutUser()}
            />

            <FlatList
              data={this.state.chitList}
              renderItem={({ item }) =>
                <TouchableHighlight onPress={() => this.props.navigation.push('ChitScreen', {chitID:item.chit_id, chitContent:item.chit_content, userID:item.user.user_id})}>
                  <Text style={styles.chititem}>
                    <Text style={styles.chitheader}>{item.user.given_name} {item.user.family_name} says: {'\n'}</Text>
                    <Text style={styles.chitcontent}>{item.chit_content}</Text>
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
          <View style={styles.view}>

            <FlatList
              data={this.state.chitList}
              renderItem={({ item }) =>
                <TouchableHighlight onPress={() => this.props.navigation.navigate('ChitScreen')}>
                  <Text style={styles.chititem}>
                    <Text style={styles.chitheader}>{item.user.given_name} {item.user.family_name} says: {'\n'}</Text>
                    <Text style={styles.chitcontent}>{item.chit_content}</Text>
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

  componentDidMount () {
    this.getData()
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
    console.log('User Loaded: ' + this.state.user_id + ' with auth: ' + this.state.x_auth)
  }

  async removeUser () {
    try {
      await AsyncStorage.removeItem('x_auth')
      await AsyncStorage.removeItem('user_id')
      console.log('Remove stored user ID and x_auth')
    } catch (error) {
      console.log(error)
    }
  }

  getData () {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/chits')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          chitList: responseJson
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  logoutUser () {
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
        Alert.alert('Logged Out!')
        this.removeUser()
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
  chititem: {
    margin: 5,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#e6ffff',
    elevation: 2
  },
  chitheader: {
    fontWeight: 'bold'
  },
  loadingtext: {
    textAlign: 'center',
    marginBottom: 50,
    marginTop: 50
  }
})

export default HomeScreen
