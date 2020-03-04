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
      x_auth: '',
      given_name: '',
      family_name: ''
    }
  }

  render() {
    if (this.state.logged_in == false) {
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
            onPress = {() => this.viewFollowers()}
            style = {styles.button}
          >
            <Text>Followers</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress = {() => this.viewFollowing()}
            style = {styles.button}
          >
            <Text>Following</Text>
          </TouchableOpacity>

        </View>
      );
    }

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

  componentDidMount() {
    this.getUserData();
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
