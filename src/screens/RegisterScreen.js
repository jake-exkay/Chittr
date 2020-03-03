import React, { Component } from 'react';
import { Image, StyleSheet, Alert, TouchableOpacity, TextInput, Text, View } from 'react-native';

class RegisterScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      given_name: '',
      family_name: '',
      email: '',
      password: ''
    };
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
       }),
       headers: {
         "Content-Type":"application/json"
       }
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
      <View style = {styles.view}>
        <Image
          source = {require("../../img/chittr_logo.png")}
          style = {styles.logo}
        />
        <TextInput
          style = {styles.textinput}
          placeholder = "First Name"
          onChangeText = {this.handleGivenName}
        />
        <TextInput
          style = {styles.textinput}
          placeholder = "Last Name"
          onChangeText = {this.handleFamilyName}
        />
        <TextInput
          style = {styles.textinput}
          placeholder = "Email Address"
          onChangeText = {this.handleEmail}
        />
        <TextInput
          style = {styles.textinput}
          placeholder = "Password"
          onChangeText = {this.handlePassword}
          secureTextEntry = {true}
        />

        <TouchableOpacity
          onPress = {() => this.addUser()}
          style = {styles.button}
        >
          <Text>Register</Text>
        </TouchableOpacity>

      </View>
    );
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
    marginTop: 80,
  },
  logo: {
    width: 200,
    height: 100,
    justifyContent: 'center',
    marginLeft: 105
  }
});

export default RegisterScreen;
