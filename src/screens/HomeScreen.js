import React, { Component } from 'react'
import {
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
      x_auth: ''
    }
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
          <View style={styles.mainView}>

            <View style={styles.buttonView}>
              <TouchableOpacity
                onPress = {() => this.logoutUser()}
                style = {styles.topButton}
              >
                <Text>Logout</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress = {() => navigate('AddChitScreen')}
                style = {styles.topButton}
              >
                <Text>Add Chit</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.recentChits}>Recent Chits</Text>

            <FlatList
              data={this.state.chitList.reverse()}
              renderItem={({ item }) =>
                <TouchableHighlight onPress={() => navigate('ChitScreen', {chitID:item.chit_id, chitContent:item.chit_content, userID:item.user.user_id})}>
                  <Text style={styles.chitItem}>
                    <Text style={styles.chitHeader}>{item.user.given_name} {item.user.family_name} says: {'\n'}</Text>
                    <Text>{item.chit_content}</Text>
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
          <View style={styles.mainView}>


            <View style={styles.buttonView}>

            <TouchableOpacity
              onPress = {() => navigate('LoginScreen')}
              style = {styles.topButton}
            >
              <Text>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress = {() => navigate('RegisterScreen')}
              style = {styles.topButton}
            >
              <Text>Register</Text>
            </TouchableOpacity>

            </View>

            <Text style={styles.recentChits}>Recent Chits</Text>

            <FlatList
              data={this.state.chitList}
              renderItem={({ item }) =>
                <TouchableHighlight onPress={() => navigate('ChitScreen', {chitID:item.chit_id, chitContent:item.chit_content, userID:item.user.user_id})}>
                  <Text style={styles.chitItem}>
                    <Text style={styles.chitHeader}>{item.user.given_name} {item.user.family_name} says: {'\n'}</Text>
                    <Text>{item.chit_content}</Text>
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
  topButton: {
    backgroundColor: '#e6ffff',
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
  }
})

export default HomeScreen
