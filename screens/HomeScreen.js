import React, { Component } from 'react';
import { Header, StyleSheet, Button, FlatList, ActivityIndicator, Text, View } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

class HomeScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      chitList: []
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator/>
        </View>
      )
    }

    return (
      <View style = {styles.Background}>
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
      </View>
    );
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

  componentDidMount() {
    this.getData();
  }

}

const styles = StyleSheet.create({
  Background :{
    backgroundColor: '#fffbe0'
  },

  ChitItem :{
    margin: 5,
    padding: 10,
    borderRadius: 15,
    backgroundColor: '#e6ffff'
  },

  TopBar :{
    backgroundColor: '#000000'
  }

});

export default HomeScreen;
