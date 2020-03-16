import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import HomeScreen from './screens/HomeScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import ProfileScreen from './screens/ProfileScreen'
import AddChitScreen from './screens/AddChitScreen'
import FollowingScreen from './screens/FollowingScreen'
import FollowersScreen from './screens/FollowersScreen'
import AccountScreen from './screens/AccountScreen'
import ChitScreen from './screens/ChitScreen'
import ScheduleScreen from './screens/ScheduleScreen'
import DraftScreen from './screens/DraftScreen'
import ChangePictureScreen from './screens/ChangePictureScreen'
import SearchBarScreen from './screens/SearchBarScreen'
import SearchResultsScreen from './screens/SearchResultsScreen'

const AppStackNav = createStackNavigator({
  Home: {
    screen: HomeScreen
  },
  ChitScreen: {
    screen: ChitScreen
  },
  ProfileScreen: {
    screen: ProfileScreen
  },
  FollowersScreen: {
    screen: FollowersScreen
  },
  FollowingScreen: {
    screen: FollowingScreen
  },
  AddChitScreen: {
    screen: AddChitScreen
  },
  AccountScreen: {
    screen: AccountScreen
  },
  RegisterScreen: {
    screen: RegisterScreen
  },
  LoginScreen: {
    screen: LoginScreen
  },
  ScheduleScreen: {
    screen: ScheduleScreen
  },
  DraftScreen: {
    screen: DraftScreen
  },
  ChangePictureScreen: {
    screen: ChangePictureScreen
  },
  SearchBarScreen: {
    screen: SearchBarScreen
  },
  SearchResultsScreen: {
    screen: SearchResultsScreen
  }

})

const AppContainer = createAppContainer(AppStackNav)

export default AppContainer
