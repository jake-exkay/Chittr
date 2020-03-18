import React, { Component } from 'react'
import {
  TouchableHighlight,
  FlatList,
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
import Geolocation from 'react-native-geolocation-service'

// Component shows a list of draft chits.
class DraftScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      user_id: '',
      x_auth: '',
      draft_chits: []
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

  // Renders a list of draft chits on screen.
  render () {
    const { navigate } = this.props.navigation

    return (
      <View style={styles.mainView}>
        <Text style={styles.topHeader}>Click on a draft to post it.</Text>

        <FlatList
          data={this.state.draft_chits.reverse()}
          renderItem={({ item }) =>
            <View>
              <TouchableHighlight onPress={() => this.addDraftChit(item.chit_content)}>
                <Text style={styles.chitItem}>{item.chit_content}</Text>
              </TouchableHighlight>

              <TouchableOpacity
                onPress={() => navigate('ScheduleScreen', {chitID:item.chit_content})}
                style={styles.scheduleButton}
                accessibilityLabel='View Following'
                accessibilityHint='Press the button to view users you are following'
                accessibilityRole='button'
              >
                <Text>Schedule</Text>
              </TouchableOpacity>
            </View>
          }
          keyExtractor={({ chit_content }, index) => chit_content.toString()}
          style={{ margin: 20 }}
        />

      </View>
    )
  }

  // Runs when component starts, calls the function to get the user data.
  componentDidMount () {
    console.log('[STARTUP] DraftScreen Loaded')
    this.loadUser()
    this.loadDrafts()
  }

  // Function adds a chit from drafts as a chit via the api.
  addDraftChit (chit_content) {
    console.log('[DEBUG] Attempting to add chit..')
    var date = Date.parse(new Date())

    return fetch('http://10.0.2.2:3333/api/v0.0.5/chits',
      {
         method: 'POST',
         body: JSON.stringify({
           chit_content: chit_content,
           timestamp: date
         }),
         headers: {
           'Content-Type': 'application/json',
           'X-Authorization': JSON.parse(this.state.x_auth)
         }
      })
      .then((response) => {
        console.log('[SUCCESS] Added Chit from drafts')
        Alert.alert('Posted Draft!')
      })
      .catch((error) => {
        console.error(error)
      })
  }

  async loadDrafts () {
    const draftChits = await AsyncStorage.getItem('draft_chits')
    const parsedDraftChits = await JSON.parse(draftChits)
    this.setState({
      draft_chits: parsedDraftChits
    })
    console.log('[SUCCESS] Loaded draft chits: ' + JSON.stringify(this.state.draft_chits))
  }

  // Function loads user data from async storage and stores in the state.
  async loadUser () {
    const userId = await AsyncStorage.getItem('user_id')
    const parsedUserId = await JSON.parse(userId)
    const xAuth = await AsyncStorage.getItem('x_auth')
    const parsedXAuth = await JSON.parse(xAuth)
    this.setState({
      x_auth: parsedXAuth,
      user_id: parsedUserId
    })
    console.log('[DEBUG] User Loaded: ' + this.state.user_id + ' with auth: ' + this.state.x_auth)
  }

}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fcfbe4'
  },
  chitItem: {
    margin: 5,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#e6ffff',
    elevation: 2
  },
  topHeader: {
    margin: 10,
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center'
  },
  scheduleButton: {
    backgroundColor: '#c7ddf5',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 5,
    paddingBottom: 5,
    elevation: 5,
    borderRadius: 10
  }
})

export default DraftScreen
