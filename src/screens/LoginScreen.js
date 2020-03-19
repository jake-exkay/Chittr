import React, { Component } from 'react'
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Text,
  View
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

// Component shows a login form and handles a login request to the API.
class LoginScreen extends Component {

  constructor (props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      user_id: '',
      x_auth: '',
      validation: ''
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

  handleEmail = (text) => {
    this.setState({
      email: text
    })
  }

  handlePassword = (text) => {
    this.setState({
      password: text
    })
  }

  // Renders the login form, the password input contains a secure text entry.
  render () {
    return (
      <View style={styles.mainView} accessible={true}>

        <Text style={styles.loginHeader}>Chittr Login</Text>

        <TextInput
          placeholder='Email'
          onChangeText={this.handleEmail}
          style={styles.textEntry}
          accessibilityLabel='Email'
          accessibilityHint='Enter email address'
          accessibilityRole='keyboardkey'
        />

        <TextInput
          placeholder='Password'
          onChangeText={this.handlePassword}
          style={styles.textEntry}
          secureTextEntry={true}
          accessibilityLabel='Password'
          accessibilityHint='Enter your password'
          accessibilityRole='keyboardkey'
        />

        <TouchableOpacity
          onPress={() => this.loginUser()}
          style={styles.button}
          accessibilityLabel='Login'
          accessibilityHint='Press the button to login'
          accessibilityRole='button'
        >
          <Text>Login</Text>
        </TouchableOpacity>

        <Text style={styles.errorMessage}>{this.state.validation}</Text>

      </View>
    )
  }

  componentDidMount () {
    console.log('[STARTUP] LoginScreen Loaded')
  }

  // Function accesses login endpoint in the API and gets the response. The ID and token are
  // saved to the state and the user is redirected to the home screen.
  loginUser () {
    console.log('[DEBUG] Attempting to log in user..')
    return fetch('http://10.0.2.2:3333/api/v0.0.5/login',
      {
         method: 'POST',
         body: JSON.stringify({
           email: this.state.email,
           password: this.state.password
         }),
         headers: {
           'Content-Type': 'application/json'
         }
     })
   .then((response) =>  {
     if (response.status != 200) {
       console.log('[WARNING] User tried to log in using incorrect details.')
     }
     return response.json()
   })
   .then(responseJson => {
       this.props.navigation.navigate('Home');
       this.setState({
         user_id: JSON.stringify(responseJson.id),
         x_auth: JSON.stringify(responseJson.token)
       })
       console.log('[SUCCESS] Login details saved to state.')
       this.storeUser()
       Alert.alert('Welcome!')
   })
   .catch((error) => {
     console.log('[ERROR] Error logging in user. Displaying validation error.')
     this.setState({
       validation: 'Sorry, your details are incorrect!'
     })
   })
 }

 // Function stores the user ID and x auth in async storage so it can be used in multiple screens.
 async storeUser () {
   try {
     await AsyncStorage.setItem('user_id', JSON.stringify(this.state.user_id))
     await AsyncStorage.setItem('x_auth', JSON.stringify(this.state.x_auth))
     let userId = await AsyncStorage.getItem('user_id')
     let xAuth = await AsyncStorage.getItem('x_auth')

     console.log('[SUCCESS] Stored user using ID ' + userId + ' and x_auth ' + xAuth)
   } catch (error) {
     console.log('[ERROR] Error storing ID and x-auth in async storage. Log: ' + error)
   }
 }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fcfbe4'
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#c7ddf5',
    padding: 10,
    marginLeft: 100,
    marginRight: 100,
    borderRadius: 3,
    elevation: 2
  },
  textEntry: {
    alignItems: 'center',
    padding: 10,
    marginLeft: 100,
    marginTop: 10,
    marginBottom: 10,
    marginRight: 100,
    borderColor: '#74abe7',
    borderRadius: 5,
    borderWidth: 1.5,
    backgroundColor: '#ffffff',
    elevation: 3
  },
  loginHeader: {
    marginLeft: 125,
    fontSize: 30,
    marginBottom: 10
  },
  errorMessage: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 15,
    color: 'red'
  }
})

export default LoginScreen
