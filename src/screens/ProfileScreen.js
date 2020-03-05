import React, { Component } from 'react';
import { Image, Alert, Header, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

class ProfileScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      logged_in: true,
      user_id: '17',
      x_auth: 'd9b812405c520e140d001983cac0bd05',
      given_name: '',
      family_name: '',
      profile_id: '16',
      followerList: []
    }
  }

  render() {
    // User not logged in
    if (this.state.logged_in == false) {
      return (
        <View style = {styles.view}>
          <TouchableOpacity
            title = "Followers"
            onPress = {() => this.viewFollowers()}
          />
          <TouchableOpacity
            title = "Following"
            onPress = {() => this.viewFollowing()}
          />
        </View>
      );

    // User viewing their own profile
  } else if (this.state.user_id == this.state.profile_id) {
      return (
        <View style = {styles.view}>
          <TouchableOpacity
            title = "Edit"
            onPress = {() => this.editAccount()}
          />
          <TouchableOpacity
            title = "Followers"
            onPress = {() => this.viewFollowers()}
          />
          <TouchableOpacity
            title = "Following"
            onPress = {() => this.viewFollowing()}
          />
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
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/'+this.state.profile_id)
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

  getFollowerData() {
    fetch('http://10.0.2.2:3333/api/v0.0.5/user/'+this.state.profile_id+'/followers')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          followerList: JSON.stringify(responseJson)
        });
        console.log("Followers of " + this.state.profile_id + " " + this.state.followerList);
      })
      .catch((error) => {
        console.log(error);
      });

  }

  componentDidMount() {
    console.log(this.state.user_id + " is viewing the profile of " + this.state.profile_id);
    this.getUserData();
    this.getFollowerData();
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
