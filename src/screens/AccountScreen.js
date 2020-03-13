import React, { Component } from 'react';
import {
  Image,
  AsyncStorage,
  TextInput,
  Alert,
  Header,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Text,
  View } from 'react-native';

class AccountScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user_id: '',
      x_auth: '',
      given_name: '',
      family_name: '',
      email: '',
      password: '',
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

  handleEmail = (text) => {
    this.setState({email: text})
  }

  handlePassword = (text) => {
    this.setState({password: text})
  }

  handleFirstName = (text) => {
    this.setState({given_name: text})
  }

  handleLastName = (text) => {
    this.setState({family_name: text})
  }

  render() {

    const { navigate } = this.props.navigation

    return (
      <View style={styles.container}>
        <Text style={styles.accountheader}>Update Account</Text>

        <TextInput
          placeholder = "Email"
          onChangeText = {this.handleEmail}
          style = {styles.textinput}
        />

        <TouchableOpacity
          onPress = {() => this.updateEmail()}
          style = {styles.button}
        >
          <Text>Update Email</Text>
        </TouchableOpacity>

        <TextInput
          placeholder = "Password"
          onChangeText = {this.handlePassword}
          style = {styles.textinput}
          secureTextEntry = {true}
        />

        <TouchableOpacity
          onPress = {() => this.updatePassword()}
          style = {styles.button}
        >
          <Text>Update Password</Text>
        </TouchableOpacity>

        <TextInput
          placeholder = "First Name"
          onChangeText = {this.handleFirstName}
          style = {styles.textinput}
        />

        <TouchableOpacity
          onPress = {() => this.updateGivenName()}
          style = {styles.button}
        >
          <Text>Update First Name</Text>
        </TouchableOpacity>

        <TextInput
          placeholder = "Last Name"
          onChangeText = {this.handleLastName}
          style = {styles.textinput}
        />

        <TouchableOpacity
          onPress = {() => this.updateFamilyName()}
          style = {styles.button}
        >
          <Text>Update Last Name</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress = {() => navigate('ChangePictureScreen')}
          style = {styles.button}
        >
          <Text>Change Profile Picture</Text>
        </TouchableOpacity>
        
      </View>
    );

  }

  componentDidMount() {
    this.loadUser();
  }

  async loadUser() {
    let user_id = await AsyncStorage.getItem('user_id');
    let parse_user_id = await JSON.parse(user_id);
    let x_auth = await AsyncStorage.getItem('x_auth');
    let parse_x_auth = await JSON.parse(x_auth);
    this.setState({
      x_auth: parse_x_auth,
      user_id: parse_user_id
    });
    console.log("Loaded data from user ID: " + this.state.user_id + " and x-auth: " + this.state.x_auth);
  }

  updateFamilyName() {
    return fetch("http://10.0.2.2:3333/api/v0.0.5/user/"+this.state.user_id,
    {
       method: 'PATCH',
       body: JSON.stringify({
         family_name: this.state.family_name,
       }),
       headers: {
         "Content-Type":"application/json",
         "X-Authorization":this.state.x_auth,
       }
   })
   .then((response) => {
     Alert.alert("Last Name Updated!");
   })
   .catch((error) => {
     console.error(error);
   });
 }

 updateGivenName() {
   return fetch("http://10.0.2.2:3333/api/v0.0.5/user/"+this.state.user_id,
   {
      method: 'PATCH',
      body: JSON.stringify({
        given_name: this.state.given_name,
      }),
      headers: {
        "Content-Type":"application/json",
        "X-Authorization":this.state.x_auth,
      }
  })
  .then((response) => {
    Alert.alert("First Name Updated!");
  })
  .catch((error) => {
    console.error(error);
  });
}

updatePassword() {
  return fetch("http://10.0.2.2:3333/api/v0.0.5/user/"+this.state.user_id,
  {
     method: 'PATCH',
     body: JSON.stringify({
       password: this.state.password,
     }),
     headers: {
       "Content-Type":"application/json",
       "X-Authorization":this.state.x_auth,
     }
 })
 .then((response) => {
   Alert.alert("Password Updated!");
 })
 .catch((error) => {
   console.error(error);
 });
}

updateEmail() {
  return fetch("http://10.0.2.2:3333/api/v0.0.5/user/"+this.state.user_id,
  {
     method: 'PATCH',
     body: JSON.stringify({
       email: this.state.email,
     }),
     headers: {
       "Content-Type":"application/json",
       "X-Authorization":this.state.x_auth,
     }
 })
 .then((response) => {
   Alert.alert("Email Updated!");
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
  accountheader: {
    marginLeft: 95,
    fontSize: 30,
    marginBottom: 10
  },
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
  }
});


export default AccountScreen;
