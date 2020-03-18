import React, { Component } from 'react'
import {
  Image,
  AsyncStorage,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Text,
  View
} from 'react-native'

// Component used to edit user account details. The component contains text inputs and buttons for updating
// email address, password, first name and last name. The component also includes a button which links
// to another screen, used for updating the users' profile picture.
class AccountScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      user_id: '',
      x_auth: '',
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

  handleFirstName = (text) => {
    this.setState({
      given_name: text
    })
  }

  handleLastName = (text) => {
    this.setState({
      family_name: text
    })
  }

  // Renders data on screen, text inputs and buttons for changing user data.
  render () {
    const { navigate } = this.props.navigation

    return (
      <View style={styles.mainView} accessible={true}>
        <Text style={styles.accountHeader}>Update Account</Text>

        <TextInput
          placeholder='Email'
          onChangeText={this.handleEmail}
          style={styles.textEntry}
          accessibilityLabel='Email Address'
          accessibilityHint='Enter new email address'
          accessibilityRole='keyboardkey'
        />

        <TouchableOpacity
          onPress={() => this.updateEmail()}
          style={styles.button}
          accessibilityLabel='Update email'
          accessibilityHint='Press the button to change email address'
          accessibilityRole='button'
        >
          <Text>Update Email</Text>
        </TouchableOpacity>

        <TextInput
          placeholder='Password'
          onChangeText={this.handlePassword}
          style={styles.textEntry}
          secureTextEntry={true}
          accessibilityLabel='Password'
          accessibilityHint='Enter new password'
          accessibilityRole='keyboardkey'
        />

        <TouchableOpacity
          onPress={() => this.updatePassword()}
          style={styles.button}
          accessibilityLabel='Update password'
          accessibilityHint='Press the button to change password'
          accessibilityRole='button'
        >
          <Text>Update Password</Text>
        </TouchableOpacity>

        <TextInput
          placeholder='First Name'
          onChangeText={this.handleFirstName}
          style={styles.textEntry}
          accessibilityLabel='First Name'
          accessibilityHint='Enter new first name'
          accessibilityRole='keyboardkey'
        />

        <TouchableOpacity
          onPress={() => this.updateGivenName()}
          style={styles.button}
          accessibilityLabel='Update first name'
          accessibilityHint='Press the button to change first name'
          accessibilityRole='button'
        >
          <Text>Update First Name</Text>
        </TouchableOpacity>

        <TextInput
          placeholder='Last Name'
          onChangeText={this.handleLastName}
          style={styles.textEntry}
          accessibilityLabel='Last Name'
          accessibilityHint='Enter new last name'
          accessibilityRole='keyboardkey'
        />

        <TouchableOpacity
          onPress={() => this.updateFamilyName()}
          style={styles.button}
          accessibilityLabel='Update last name'
          accessibilityHint='Press the button to change last name'
          accessibilityRole='button'
        >
          <Text>Update Last Name</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigate('ChangePictureScreen')}
          style={styles.button}
          accessibilityLabel='Change Profile Picture'
          accessibilityHint='Press the button to access the change profile picture screen'
          accessibilityRole='button'
        >
          <Text>Change Profile Picture</Text>
        </TouchableOpacity>

        <Text style={styles.errorMessage}>{this.state.validation}</Text>

      </View>
    )
  }

  // Runs on component start, calls the load user function to get user data.
  componentDidMount () {
    console.log('[STARTUP] AccountScreen Loaded')
    this.loadUser()
  }

  // Function loads user details from async storage, containing logged-in user ID and x-auth token.
  async loadUser () {
    const userId = await AsyncStorage.getItem('user_id')
    const parsedUserId = await JSON.parse(userId)
    const xAuth = await AsyncStorage.getItem('x_auth')
    const parsedXAuth = await JSON.parse(xAuth)
    this.setState({
      x_auth: parsedXAuth,
      user_id: parsedUserId
    })
    console.log('[DEBUG] Loaded data from user ID: ' + this.state.user_id + ' and x-auth: ' + this.state.x_auth)
  }

  // Function updates first name using a PATCH request to the API.
  updateGivenName () {
    console.log('[DEBUG] Attempting to change first name..')
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.user_id,
      {
        method: 'PATCH',
        body: JSON.stringify({
          given_name: this.state.given_name
        }),
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': JSON.parse(this.state.x_auth)
        }
      })
      .then((response) => {
        console.log('[SUCCESS] Changed first name')
        Alert.alert('First Name Updated!')
      })
      .catch((error) => {
        console.log('[ERROR] Cannot change first name')
        this.setState({
          validation: 'Error changing first name!'
        })
      })
  }

  // Function updates last name using a PATCH request to the API.
  updateFamilyName () {
    console.log('[DEBUG] Attempting to change last name..')
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.user_id,
      {
        method: 'PATCH',
        body: JSON.stringify({
          family_name: this.state.family_name
        }),
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': JSON.parse(this.state.x_auth)
        }
      })
      .then((response) => {
        console.log('[SUCCESS] Changed last name')
        Alert.alert('Last Name Updated!')
      })
      .catch((error) => {
        console.log('[ERROR] Cannot change last name')
        this.setState({
          validation: 'Error changing last name!'
        })
      })
  }

  // Function updates password using a PATCH request to the API.
  updatePassword () {
    console.log('[DEBUG] Attempting to change password..')
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.user_id,
      {
        method: 'PATCH',
        body: JSON.stringify({
          password: this.state.password
        }),
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': JSON.parse(this.state.x_auth)
        }
      })
      .then((response) => {
        console.log('[SUCCESS] Changed password')
        Alert.alert('Password Updated!')
      })
      .catch((error) => {
        console.log('[ERROR] Cannot change password')
        this.setState({
          validation: 'Error changing password!'
        })
      })
  }

  // Function updates email address using a PATCH request to the API.
  updateEmail () {
    console.log('[DEBUG] Attempting to change email address..')
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.user_id,
      {
        method: 'PATCH',
        body: JSON.stringify({
          email: this.state.email
        }),
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': JSON.parse(this.state.x_auth)
        }
      })
      .then((response) => {
        console.log('[SUCCESS] Changed email address')
        Alert.alert('Email Updated!')
      })
      .catch((error) => {
        console.log('[ERROR] Cannot change email address')
        this.setState({
          validation: 'Error changing email address!'
        })
      })
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
    elevation: 2,
    marginTop: 10
  },
  textEntry: {
    alignItems: 'center',
    padding: 10,
    marginLeft: 100,
    marginTop: 10,
    marginRight: 100,
    borderColor: '#74abe7',
    borderRadius: 5,
    borderWidth: 1.5,
    backgroundColor: '#ffffff',
    elevation: 3
  },
  accountHeader: {
    marginLeft: 95,
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

export default AccountScreen
