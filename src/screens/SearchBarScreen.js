import React, { Component } from 'react'
import {
  AsyncStorage,
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

// Component shows search bar.
class SearchBarScreen extends Component {

  constructor (props) {
    super(props)

    this.state = {
      user_id: '',
      x_auth: '',
      search_query: ''
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

  // Function renders search bar on screen.
  render () {
    const { navigate } = this.props.navigation

    return (
      <View style={styles.mainView} accessible={true}>

        <TextInput
          style={styles.textEntry}
          placeholder='Search...'
          onChangeText={this.handleSearchQuery}
          accessibilityLabel='Search'
          accessibilityHint='Enter search query here'
          accessibilityRole='keyboardkey'
        />

        <TouchableOpacity
          onPress={() => navigate('SearchResultsScreen', {searchQuery: this.state.search_query})}
          style={styles.button}
          accessibilityLabel='Search'
          accessibilityHint='Press the button to search users'
          accessibilityRole='button'
        >
          <Text>Search</Text>
        </TouchableOpacity>

      </View>
    )
  }

  // Runs on start of component.
  componentDidMount () {
    console.log('[STARTUP] SearchBarScreen Loaded')
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

export default SearchBarScreen
