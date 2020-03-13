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
import { RNCamera } from 'react-native-camera';

class ChangePictureScreen extends Component {

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
    return (
      <View style={styles.container}>
        <Text style={styles.accountheader}>Update Profile Picture</Text>

        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.capture}
        />

        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>

          <TouchableOpacity
            onPress = {this.takePicture.bind(this)}
            style =  {styles.button}
          >
          <Text style={{ fontSize: 16 }}>
            Take Picture
          </Text>
          </TouchableOpacity>

        </View>

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

  takePicture = async() => {
    if(this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);

      console.log(data.uri);

      return fetch("http://10.0.2.2:3333/api/v0.0.5/user/photo",
      {
         method: 'POST',
         body: data,
         headers: {
           "Content-Type":"image/jpeg",
           "X-Authorization":JSON.parse(this.state.x_auth),
         }
     })
     .then((response) => {
       Alert.alert("Photo Updated!");
     })
     .catch((error) => {
       console.error(error);
     });
    }
  };


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
  accountheader: {
    marginLeft: 65,
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
    padding: 240,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginBottom: 10
  }
});


export default ChangePictureScreen;
