import React, { Component } from 'react';
import { Image, StyleSheet, TextInput, TouchableOpacity, Alert, Text, View } from 'react-native';

class LoginScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    }
  }

  handleEmail = (text) => {
    this.setState({email: text})
  }

  handlePassword = (text) => {
    this.setState({password: text})
  }

  render() {

    return (
      <View style={styles.view}>
        <Image
          source = {require("../../img/chittr_logo.png")}
          style = {styles.logo}
        />

        <TextInput
          placeholder = "Email"
          onChangeText = {this.handleEmail}
          style = {styles.textinput}
        />
        <TextInput
          placeholder = "Password"
          onChangeText = {this.handlePassword}
          style = {styles.textinput}
          secureTextEntry = {true}
        />

        <TouchableOpacity
          onPress = {() => this.loginUser()}
          style = {styles.button}
        >
          <Text>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  loginUser() {
    return fetch("http://10.0.2.2:3333/api/v0.0.5/login",
    {
       method: 'POST',
       body: JSON.stringify({
         email: this.state.email,
         password: this.state.password
       }),
       headers: {
         "Content-Type":"application/json"
       }
   })
   .then((response) => response.json())
   .then((responseJson) => {
     Alert.alert("Logged In!");
   })
   .catch((error) => {
     console.error(error);
   });
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
  textinput: {
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
  view: {
    marginTop: 150,
  },
  logo: {
    width: 200,
    height: 100,
    justifyContent: 'center',
    marginLeft: 105
  }
});

export default LoginScreen;
