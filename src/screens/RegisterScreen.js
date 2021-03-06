import React, { Component } from 'react'
import {
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  Text,
  View
} from 'react-native'

// Component shows a register form for creating accounts.
class RegisterScreen extends Component {

  constructor (props) {
    super(props)

    this.state = {
      given_name: '',
      family_name: '',
      email: '',
      password: '',
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

  handleGivenName = (text) => {
    this.setState({
      given_name: text
    })
  }

  handleFamilyName = (text) => {
    this.setState({
      family_name: text
    })
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

  // Renders the registration form.
  render () {
    return (
      <View style={styles.mainView} accessible={true}>

        <Text style={styles.registerHeader}>Chittr Registration</Text>

        <TextInput
          style={styles.textEntry}
          placeholder='First Name'
          onChangeText={this.handleGivenName}
          accessibilityLabel='First Name'
          accessibilityHint='Enter first name here'
          accessibilityRole='keyboardkey'
        />

        <TextInput
          style={styles.textEntry}
          placeholder='Last Name'
          onChangeText={this.handleFamilyName}
          accessibilityLabel='Last Name'
          accessibilityHint='Enter last name here'
          accessibilityRole='keyboardkey'
        />

        <TextInput
          style={styles.textEntry}
          placeholder='Email Address'
          onChangeText={this.handleEmail}
          accessibilityLabel='Email Address'
          accessibilityHint='Enter email address here'
          accessibilityRole='keyboardkey'
        />

        <TextInput
          style={styles.textEntry}
          placeholder='Password'
          onChangeText={this.handlePassword}
          secureTextEntry={true}
          accessibilityLabel='Password'
          accessibilityHint='Enter password here'
          accessibilityRole='keyboardkey'
        />

        <TouchableOpacity
          onPress={() => this.addUser()}
          style={styles.button}
          accessibilityLabel='Register'
          accessibilityHint='Press the button to register account'
          accessibilityRole='keyboardkey'
        >
          <Text>Register</Text>
        </TouchableOpacity>

        <Text style={styles.errorMessage}>{this.state.validation}</Text>

      </View>
    )
  }

  // Function uses the user POST endpoint to add a new user.
  addUser () {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user',
      {
         method: 'POST',
         body: JSON.stringify({
           given_name: this.state.given_name,
           family_name: this.state.family_name,
           email: this.state.email,
           password: this.state.password
         }),
         headers: {
           'Content-Type': 'application/json'
         }
     })
   // Check if the response was successful and if so, show a success message.
     .then((response) => {
       if (response.status == '201') {
         console.log('[SUCCESS] Created user account.')
         Alert.alert('Successfully created account!')
       } else {
         console.log('[ERROR] Issue creating account, finding validation..')
         if (this.state.given_name == '') {
           this.setState({
             validation: 'First name was left empty!'
           })
           console.log('[VALIDATION] Error found: first name was empty.')
         }
         else if (this.state.family_name == '') {
           this.setState({
             validation: 'Last name was left empty!'
           })
           console.log('[VALIDATION] Error found: last name was empty.')
         }
         else if (this.state.email == '') {
           this.setState({
             validation: 'Email address was left empty!'
           })
           console.log('[VALIDATION] Error found: Email address was empty.')
         }
         else if (this.state.password == '') {
           this.setState({
             validation: 'Password was left empty!'
           })
           console.log('[VALIDATION] Error found: password was empty.')
         }
         else if (this.state.email == '') {
           this.setState({
             validation: 'Email address was left empty!'
           })
           console.log('[VALIDATION] Error found: Email address was empty.')
         }
         else if (!this.state.email.includes('@')) {
           this.setState({
             validation: 'Email address is not the correct format!'
           })
           console.log('[VALIDATION] Error found: Incorrect email format')
         } else {
           this.setState({
             validation: 'There was an issue creating your account, please check your details!'
           })
           console.log('[VALIDATION] Error found: Unknown error')
         }
       }
     })
     .catch((error) => {
       console.error('[ERROR] Error creating account. Log: ' + error)
     })
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
  registerHeader: {
    marginLeft: 80,
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

export default RegisterScreen
