import React, { Component } from 'react';
import { TextInput, Button, Alert, Text, View } from 'react-native';

class LoginScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
  }

  loginUser() {
    return fetch("http://10.0.2.2:3333/api/v0.0.5/login",
    {
       method: 'POST',
       body: JSON.stringify({
         email: this.state.email,
         password: this.state.password
       })
   })
   .then((response) => {
     Alert.alert("Logged In!");
   })
   .catch((error) => {
     console.error(error);
   });
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
          placeholder = "Email"
          onChangeText = {this.handleEmail}
        />
        <TextInput
          placeholder = "Password"
          onChangeText = {this.handlePassword}
        />

        <Button
          title = "Login"
          onPress = {() => this.loginUser()}
        />

      </View>
    );
  }

}

export default LoginScreen;
