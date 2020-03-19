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
import DatePicker from 'react-native-datepicker'
import BackgroundTimer from 'react-native-background-timer'

// Component is used to schedule draft chits and set the time they are posted.
class ScheduleScreen extends Component {

  constructor (props) {
    super(props)

    this.state = {
      user_id: '',
      x_auth: '',
      chit_content: '',
      date: ''
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

  // Function renders form to add scheduled chit.
  render () {
    return (
      <View style={styles.mainView}>

        <Text style={styles.chitItem}>Chit to Schedule: {'\n'}{this.state.chit_content}</Text>

        <DatePicker
            style={{width: 200, marginLeft: 110, marginTop: 100}}
            date={this.state.date}
            mode='datetime'
            placeholder='Choose Date'
            format='DD-MM-YYYY HH-mm'
            maxDate='01-01-2030'
            confirmBtnText='Confirm'
            cancelBtnText='Cancel'
            onDateChange={(date) => {this.setState({ date: date })}}
          />


        <TouchableOpacity
          onPress={() => this.scheduleChit()}
          style={styles.button}
        >
          <Text>Schedule</Text>
        </TouchableOpacity>

      </View>
    )
  }

  // Runs on component start, calls functions to get coordinates and load user data.
  componentDidMount () {
    console.log('[STARTUP] ScheduleScreen Loaded')
    var date = Date.parse(new Date())
    this.setState({
      current_date: date
    })
    this.getParams()
  }

  // Gets parameters from the previous screen, updates the state with the ID of the chit to schedule.
  getParams () {
    console.log('[SUCCESS] Got Chit content: ' + this.state.chit_content)
    const { params } = this.props.navigation.state
    this.setState({
      chit_content: params.chitContent
    })
    this.loadUser()
  }

  // Function loads user data from async storage and saves information in state.
  async loadUser () {
    let userId = await AsyncStorage.getItem('user_id')
    let parsedUserId = await JSON.parse(userId)
    let xAuth = await AsyncStorage.getItem('x_auth')
    let parsedXAuth = await JSON.parse(xAuth)
    this.setState({
      x_auth: parsedXAuth,
      user_id: parsedUserId
    })
    console.log('[DEBUG] Loaded data from user ID: ' + this.state.user_id + ' and x-auth: ' + this.state.x_auth)
  }

  // Function adds chit at a certain time specified.
  scheduleChit () {
    console.log('[DEBUG] Attempting to add scheduled chit with date ' + this.state.date)

    var dateNow = Date.parse(new Date())
    var difference = Math.abs(this.state.date - dateNow)
    console.log('Diff ' + difference)

    Alert.alert('Chit Scheduled!')

    const addChit = BackgroundTimer.setTimeout(() => {
      console.log('[DEBUG] Adding Scheduled Chit')
      return fetch('http://10.0.2.2:3333/api/v0.0.5/chits',
      {
         method: 'POST',
         body: JSON.stringify({
           chit_content: this.state.chit_content,
           timestamp: dateNow
         }),
         headers: {
           'Content-Type': 'application/json',
           'X-Authorization': JSON.parse(this.state.x_auth)
         }
     })
     .then((response) => {
       console.log('[SUCCESS] Scheduled Chit Added')
     })
     .catch((error) => {
       console.error('[ERROR] Error adding scheduled Chit. Log: ' + error)
     })
    }, 10000)
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
    marginTop: 10,
    borderRadius: 3,
    elevation: 2
  },
  chitItem: {
    margin: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#e6ffff',
    elevation: 2
  }
})

export default ScheduleScreen
