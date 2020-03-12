import React, { Component } from 'react';
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  Button,
  FlatList,
  ActivityIndicator,
  Text,
  View
} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import AddChitScreen from './screens/AddChitScreen';
import FollowingScreen from './screens/FollowingScreen';
import FollowersScreen from './screens/FollowersScreen';
import AccountScreen from './screens/AccountScreen';
import ChitScreen from './screens/ChitScreen';

class App extends Component {

}

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

})
const AppContainer = createAppContainer(AppStackNav)


export default AppContainer
