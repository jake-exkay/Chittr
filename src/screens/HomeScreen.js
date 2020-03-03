import React, { Component } from 'react';
import { Image, Alert, Header, StyleSheet, Button, FlatList, ActivityIndicator, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/Ionicons';

class HomeScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      chitList: [],
      logged_in: false,
    }
  }

  static navigationOptions = {
    headerTitle: (
      <Image
        source = {require("../../img/chittr_logo.png")}
        style = {{width: 100, height: 50, marginLeft: 140}}
      />
    ),
    headerStyle: {
      backgroundColor: "#12b2fd"
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style = {styles.view}>
          <Text style = {styles.loadingtext}>Loading Chits...</Text>
          <ActivityIndicator/>
        </View>
      )
    } else {
      return (
        <View style = {styles.view}>
          <FlatList
            data = {this.state.chitList}
            renderItem = {({item}) =>
                                    <Text style = {styles.ChitItem}>
                                        {item.user.given_name} says: {"\n"}
                                        {item.chit_content}
                                    </Text>
                         }
            keyExtractor = {({chit_id}, index) => chit_id}
            style = {{margin: 20}}
          />
          <Button
            title = "Logout"
            onPress = {() => this.logoutUser()}
          />
        </View>
      );
  }
}

  getData() {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/chits')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          chitList: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  logoutUser() {
    return fetch("http://10.0.2.2:3333/api/v0.0.5/logout",
    {
       method: 'POST',
       headers: {
         "Content-Type":"application/json",
         "X-Authorization":this.state.x_auth
       }
   })
   .then((response) => "OK")
   .then((responseJson) => {
     this.setState({
       logged_in: false,
       user_id: '',
       x_auth: '',
     });
     Alert.alert("Logged Out!");
   })
   .catch((error) => {
     console.error(error);
   });
 }

  componentDidMount() {
    this.getData();
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
  ChitItem :{
    margin: 5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#e6ffff',
    elevation: 2
  },
  loadingtext :{
    textAlign: 'center',
    marginBottom: 50,
    marginTop: 50
  }
});


export default HomeScreen;
