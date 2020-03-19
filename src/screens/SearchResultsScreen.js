import React, { Component } from 'react'
import {
  FlatList,
  CheckBox,
  PermissionsAndroid,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  Text,
  View
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

// Component shows search results with params recieved from previous component.
class SearchResultsScreen extends Component {

  constructor (props) {
    super(props)

    this.state = {
      user_id: '',
      x_auth: '',
      search_query: '',
      search_results: []
    }
  }

  static navigationOptions = {
    headerTitle: () => (
        <Image
          source = {require('../../img/chittr_logo.png')}
          style = {{ width: 100, height: 50, marginLeft: 85 }}
        />
      ),
    headerStyle: {
      backgroundColor: '#29a9ff'
    }
  }

  handleSearchQuery = (text) => {
    this.setState({
      search_query: text
    })
  }

  render () {
    const { navigate } = this.props.navigation

    return (
      <View style={styles.mainView}>
        <FlatList
          data={this.state.search_results}
          renderItem={({ item }) =>
            <TouchableHighlight onPress={() => navigate('ProfileScreen', {user_id: item.user_id})}>
              <Text style={styles.chitItem}>
                <Text style={styles.chitHeader}>{item.given_name} {item.family_name}</Text>
              </Text>
            </TouchableHighlight>
          }
          keyExtractor={({ user_id }, index) => user_id.toString()}
          style={{ margin: 20 }}
        />
      </View>
    )
  }

  // Runs on start of component, calls the get parameters function.
  componentDidMount () {
    console.log('[STARTUP] SearchResultsScreen Loaded')
    this.getParams()
  }

  // Function gets parameter from navigation, the search query.
  getParams () {
    const { params } = this.props.navigation.state
    this.setState({
      search_query: JSON.stringify(params.searchQuery)
    })
    console.log('[DEBUG] Search Query: ' + this.state.search_query)
    this.searchUsers()
  }

  // Function searches users using the search_user endpoint and the search query from the previous screen.
  searchUsers() {
    console.log('[DEBUG] Search query: ' + this.state.search_query)
    return fetch('http://10.0.2.2:3333/api/v0.0.5/search_user?' + 'q=' + this.state.search_query)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          given_name: responseJson.given_name,
          family_name: responseJson.family_name
        })
      })
      .catch((error) => {
        console.log('[ERROR] Error searching users. Log: ' + error)
      })
  }

}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fcfbe4'
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#c7ddf5',
    padding: 10,
    marginLeft: 100,
    marginRight: 100,
    borderRadius: 3,
    elevation: 2,
    marginBottom: 5
  },
  textEntry: {
    alignItems: 'center',
    padding: 10,
    marginLeft: 100,
    marginTop: 100,
    marginBottom: 10,
    marginRight: 100,
    borderColor: '#74abe7',
    borderRadius: 5,
    borderWidth: 1.5,
    backgroundColor: '#ffffff',
    elevation: 3
  }
})

export default SearchResultsScreen
