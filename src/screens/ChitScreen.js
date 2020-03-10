import React, { Component } from 'react'
import {
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
      user_id: '',
      x_auth: ''
    }
  }

  render () {
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

            <Text style={styles.chitheader}>{this.state.chit_id}</Text>

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
    console.log('Chit ID' + this.props.navigation.state.params)
    this.setState({chit_id: this.props.navigation.state.params.chitID})
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
