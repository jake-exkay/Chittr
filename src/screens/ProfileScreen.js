import React, { Component } from 'react';
import { AsyncStorage, Alert, Header, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Text, View } from 'react-native';

class ProfileScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      logged_in: true,
      user_id: '',
      x_auth: '',
      given_name: '',
      family_name: '',
      profile_id: '',
    }
  }

  render() {
    // User not logged in
    if (this.state.logged_in == false) {
      return (
        <View style = {styles.view}>

          <Text style = {styles.username}>{this.state.given_name + " " + this.state.family_name}</Text>

          <TouchableOpacity
            title = "Followers"
            onPress = {() => this.props.navigation.navigate('Followers')}
          />

          <TouchableOpacity
            title = "Following"
            onPress = {() => this.props.navigation.navigate('Following')}
          />

        </View>
      );

  // User viewing their own profile
} else if (this.state.user_id == this.state.user_id) {
      return (
        <View style = {styles.view}>

          <Text style = {styles.username}>{this.state.given_name + " " + this.state.family_name}</Text>

          <TouchableOpacity
            onPress = {() => this.props.navigation.navigate('Account')}
            style = {styles.button}
          >
            <Text>Edit Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress = {() => this.props.navigation.navigate('Followers')}
            style = {styles.button}
          >
            <Text>Followers</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress = {() => this.props.navigation.navigate('Following')}
            style = {styles.button}
          >
            <Text>Following</Text>
          </TouchableOpacity>

        </View>
      );

    // User viewing another profile
    } else {
      return (
        <View style = {styles.view}>

          <Text style = {styles.username}>{this.state.given_name + " " + this.state.family_name}</Text>

          <TouchableOpacity
            onPress = {() => this.followUser()}
            style = {styles.button}
          >
            <Text>Follow</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress = {() => this.props.navigation.navigate('Followers')}
            style = {styles.button}
          >
            <Text>Followers</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress = {() => this.props.navigation.navigate('Following')}
            style = {styles.button}
          >
            <Text>Following</Text>
          </TouchableOpacity>

        </View>
      );
    }

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
    this.getUserData();
  }

  followUser() {
    return fetch("http://10.0.2.2:3333/api/v0.0.5/user/"+this.state.profile_id+'/follow',
    {
       method: 'POST',
       headers: {
         "Content-Type":"application/json",
         "X-Authorization":this.state.x_auth
       }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("User " + this.state.user_id + " followed " + this.state.profile_id);
    })
    .catch((error) => {
     console.error(error);
    });
  }

  getUserData() {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/'+this.state.user_id)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          given_name: responseJson.given_name,
          family_name: responseJson.family_name
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getProfilePicture() {
    fetch('http://10.0.2.2:3333/api/v0.0.5/user/'+this.state.profile_id+'/photo')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          profile_picture: responseJson
        });
        console.log(responseJson);
      })
      .catch((error) => {
        console.log(error);
      });

  }

  componentDidMount() {
    this.loadUser();
    console.log(this.state.user_id + " is viewing the profile of " + this.state.profile_id);
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
  view: {
    marginTop: 10,
  },
  logo: {
    width: 200,
    height: 100,
    justifyContent: 'center',
    marginLeft: 105
  },
  username: {
    textAlign: 'center',
    fontSize: 30,
    marginBottom: 30,
  }
});


export default ProfileScreen;
