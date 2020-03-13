import React, { Component } from 'react';
import {
  Image,
  AsyncStorage,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Text,
  View
} from 'react-native';

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

  static navigationOptions = {
    headerTitle: () => (
        <Image
          source = {require("../../img/chittr_logo.png")}
          style = {{width: 100, height: 50, marginLeft: 85}}
        />
      ),
    headerStyle: {
      backgroundColor: '#29a9ff'
    }
  }

  render() {
    return (
      <View style = {styles.view}>

        <Text style = {styles.loginheader}>Chittr Login</Text>

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
   .then(responseJson => {
       this.props.navigation.navigate('Home');
       this.setState({
         user_id: JSON.stringify(responseJson.id),
         x_auth: JSON.stringify(responseJson.token),
       })
       this.storeUser();
       console.log("Log in of user ID " + this.state.user_id + " successful. Using x_auth of " + this.state.x_auth);
       Alert.alert("Welcome!");
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

 async storeUser() {
   try {
     await AsyncStorage.setItem('user_id', JSON.stringify(this.state.user_id));
     await AsyncStorage.setItem('x_auth', JSON.stringify(this.state.x_auth));

     let user_id = await AsyncStorage.getItem('user_id');

     let x_auth = await AsyncStorage.getItem('x_auth');
     console.log("Stored user using ID " + user_id + " and x_auth " + x_auth)
   } catch (error) {
     console.log(error.message);
   }
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
