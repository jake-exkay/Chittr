import React, { Component } from 'react';
import { Image, Alert, Header, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

class FollowingScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      logged_in: true,
      user_id: '17',
      x_auth: '',
      profile_id: '16',
      followerList: []
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style = {styles.view}>
          <Text style = {styles.loadingtext}>Loading Users...</Text>
          <ActivityIndicator/>
        </View>
      );
    } else {
      return (
        <View style = {styles.view}>
          <FlatList
            data = {this.state.followerList}
            renderItem = {({item}) =>
                                    <Text>
                                        <Text>{item.given_name} {item.family_name}</Text>
                                    </Text>
                         }
            keyExtractor = {({user_id}, index) => user_id.toString()}
            style = {{margin: 20}}
          />
        </View>
      );
    }
  }

  componentDidMount() {
    this.getFollowing();
  }

  getFollowing() {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/'+this.state.profile_id+'/following')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          followerList: responseJson
        });
      })
      .catch((error) => {
        console.log(error);
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


export default FollowingScreen;
