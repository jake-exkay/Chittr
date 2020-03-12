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
      x_auth: ''
    }
  }

  render () {

    const { navigate } = this.props.navigation

    if (this.state.isLoading) {
      return (
        <View style={styles.view}>
          <Text style={styles.loadingtext}>Loading Chit...</Text>
          <ActivityIndicator />
        </View>
      )
    } else {
      if (this.state.chit_id) {
        return (
          <View style={styles.view}>

            <Text style={styles.chititem}>{this.state.chit_content}</Text>

            <TouchableHighlight onPress={() => navigate('ProfileScreen', {userID:this.state.posted_user_id})}>
              <Text style={styles.chititem}>Posted By: {this.state.given_name} {this.state.family_name}</Text>
            </TouchableHighlight>
          </View>
        )
      } else {
        return (
          <View style={styles.view}>

            <Text>Chit not found</Text>

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
    console.log('Chit ID: ' + params.chitID + ' User ID: ' + params.userID + ' Content: ' + params.chitContent)
    this.setState({
      chit_id: params.chitID,
      posted_user_id: params.userID,
      chit_content: params.chitContent,
      isLoading: false
    })
    this.getUserData(params.userID)
  }

  getUserData (postedID) {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + postedID)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          given_name: responseJson.given_name,
          family_name: responseJson.family_name
        })
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

export default ChitScreen
