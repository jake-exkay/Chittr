import React, { Component } from 'react';
import { Image, StyleSheet, TextInput, TouchableOpacity, Alert, Text, View } from 'react-native';

class LoginScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      user_id: '',
      x_auth: '',
    }
  }

  handleEmail = (text) => {
    this.setState({email: text})
  }

  handlePassword = (text) => {
    this.setState({password: text})
  }

  render() {

    const { navigate } = this.props.navigation;

    return (
      <View style={styles.view}>
        <Text style={styles.loginheader}>Chittr Login</Text>

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
     this.setState({
       user_id: JSON.stringify(responseJson.id),
       x_auth: JSON.stringify(responseJson.token),
     })
     this.saveUserID(this.state.user_id);
     console.log(this.getUserID());
     this.props.navigation.navigate('Home');
     console.log("Log in of user ID " + responseJson.id + " successful.");
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
  loginheader: {
    marginLeft: 125,
    fontSize: 30,
    marginBottom: 10
  }
});

export default LoginScreen;
