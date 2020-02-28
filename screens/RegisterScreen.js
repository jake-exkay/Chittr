import React, { Component } from 'react';
import { Alert, Button, TextInput, Text, View } from 'react-native';

class RegisterScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      given_name: '',
      family_name: '',
      email: '',
      password: ''
    }
  }

  addUser() {
    return fetch("http://10.0.2.2:3333/api/v0.0.5/user",
    {
       method: 'POST',
       body: JSON.stringify({
         given_name: this.state.given_name,
         family_name: this.state.family_name,
         email: this.state.email,
         password: this.state.password
       })
   })
   .then((response) => {
     Alert.alert("Registed!");
   })
   .catch((error) => {
     console.error(error);
   });
 }

  handleGivenName = (text) => {
    this.setState({given_name: text})
  }

  handleFamilyName = (text) => {
    this.setState({family_name: text})
  }

  handleEmail = (text) => {
    this.setState({email: text})
  }

  handlePassword = (text) => {
    this.setState({password: text})
  }

  render() {
    return (
      <View>
        <TextInput
          placeholder = "First Name"
          onChangeText = {this.handleGivenName}
        />
        <TextInput
          placeholder = "Last Name"
          onChangeText = {this.handleFamilyName}
        />
        <TextInput
          placeholder = "Email Address"
          onChangeText = {this.handleEmail}
        />
        <TextInput
          placeholder = "Password"
          onChangeText = {this.handlePassword}
        />

        <Button
          title = "Register"
          onPress = {() => this.addUser()}
        />

      </View>
    );
  }

}

export default RegisterScreen;
