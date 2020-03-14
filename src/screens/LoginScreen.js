import React, { Component } from 'react'
import {
  Image,
  AsyncStorage,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Text,
  View
} from 'react-native'

// Component shows a login form and handles a login request to the API.
class LoginScreen extends Component {

  constructor (props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      user_id: '',
      x_auth: ''
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

      </View>
    )
  }

  // Function accesses login endpoint in the API and gets the response. The ID and token are
  // saved to the state and the user is redirected to the home screen.
  loginUser () {
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
   .then((response) => response.json())
   .then(responseJson => {
       this.props.navigation.navigate('Home');
       this.setState({
         user_id: JSON.stringify(responseJson.id),
         x_auth: JSON.stringify(responseJson.token)
       })
       this.storeUser()
       console.log('Log in of user ID ' + this.state.user_id + ' successful. Using x_auth of ' + this.state.x_auth)
       Alert.alert('Welcome!')
   })
   .catch((error) => {
     console.error(error);
   })
 }

 // Function stores the user ID and x auth in async storage so it can be used in multiple screens.
 async storeUser () {
   try {
     await AsyncStorage.setItem('user_id', JSON.stringify(this.state.user_id))
     await AsyncStorage.setItem('x_auth', JSON.stringify(this.state.x_auth))
     let userId = await AsyncStorage.getItem('user_id')
     let xAuth = await AsyncStorage.getItem('x_auth')

     console.log('Stored user using ID ' + userId + ' and x_auth ' + xAuth)
   } catch (error) {
     console.log(error.message)
   }
 }
}

const styles = StyleSheet.create({
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
  }
})

export default LoginScreen
