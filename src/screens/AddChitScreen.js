import React, { Component } from 'react';
import { Image, StyleSheet, Alert, TouchableOpacity, TextInput, Text, View } from 'react-native';

class AddChitScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      logged_in: true,
      user_id: '17',
      x_auth: '',
      chit_content: '',
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

  handleChitContent = (text) => {
    this.setState({chit_content: text})
  }

  render() {
    return (
      <View style = {styles.view}>

        <TextInput
          style = {styles.textinput}
          placeholder = "Chit"
          onChangeText = {this.handleChitContent}
        />

        <TouchableOpacity
          onPress = {() => this.addChit()}
          style = {styles.button}
        >
          <Text>Post</Text>
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

export default AddChitScreen;
