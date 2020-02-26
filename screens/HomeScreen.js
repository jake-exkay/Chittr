import React, { Component } from 'react';
import { FlatList, ActivityIndicator, Text, View } from 'react-native';

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
      <View>
        <FlatList
          data = {this.state.chitList}
          renderItem = {({item}) => <Text>{item.chit_content}</Text>}
          keyExtractor = {({chit_id}, index) => chit_id}
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

export default HomeScreen;
