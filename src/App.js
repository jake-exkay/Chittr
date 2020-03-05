import React, { Component } from 'react';
import { Image, TouchableOpacity, StyleSheet, Button, FlatList, ActivityIndicator, Text, View } from 'react-native';
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

class NavigationDrawerStructure extends Component {
  toggleDrawer = () => {
    this.props.navigationProps.toggleDrawer();
  };

  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
          <Image
            source={require('../img/drawer.png')}
            style={{ width: 25, height: 25, marginLeft: 5 }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const HomeScreen_stack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      headerTitle: () => (
        <Image
          source = {require("../img/chittr_logo.png")}
          style = {{width: 100, height: 50, marginLeft: 80}}
        />
      ),
      headerLeft: () => (
        <NavigationDrawerStructure navigationProps={navigation} />
      ),
      headerStyle: {
        backgroundColor: '#12b2fd',
      },
      headerTintColor: '#fff',
    }),
  },
});

const LoginScreen_stack = createStackNavigator({
  //All the screen from the Screen2 will be indexed here
  Login: {
    screen: LoginScreen,
    navigationOptions: ({ navigation }) => ({
      headerTitle: () => (
        <Image
          source = {require("../img/chittr_logo.png")}
          style = {{width: 100, height: 50, marginLeft: 80}}
        />
      ),
      headerLeft: () => (
        <NavigationDrawerStructure navigationProps={navigation} />
      ),
      headerStyle: {
        backgroundColor: '#12b2fd',
      },
      headerTintColor: '#fff',
    }),
  },
});

const RegisterScreen_stack = createStackNavigator({
  //All the screen from the Screen3 will be indexed here
  Register: {
    screen: RegisterScreen,
    navigationOptions: ({ navigation }) => ({
      headerTitle: () => (
        <Image
          source = {require("../img/chittr_logo.png")}
          style = {{width: 100, height: 50, marginLeft: 80}}
        />
      ),
      headerLeft: () => (
        <NavigationDrawerStructure navigationProps={navigation} />
      ),
      headerStyle: {
        backgroundColor: '#12b2fd',
      },
      headerTintColor: '#fff',
    }),
  },
});

const ProfileScreen_stack = createStackNavigator({
  //All the screen from the Screen3 will be indexed here
  Profile: {
    screen: ProfileScreen,
    navigationOptions: ({ navigation }) => ({
      headerTitle: () => (
        <Image
          source = {require("../img/chittr_logo.png")}
          style = {{width: 100, height: 50, marginLeft: 80}}
        />
      ),
      headerLeft: () => (
        <NavigationDrawerStructure navigationProps={navigation} />
      ),
      headerStyle: {
        backgroundColor: '#12b2fd',
      },
      headerTintColor: '#fff',
    }),
  },
});

const FollowingScreen_stack = createStackNavigator({
  //All the screen from the Screen3 will be indexed here
  Following: {
    screen: FollowingScreen,
    navigationOptions: ({ navigation }) => ({
      headerTitle: () => (
        <Image
          source = {require("../img/chittr_logo.png")}
          style = {{width: 100, height: 50, marginLeft: 80}}
        />
      ),
      headerLeft: () => (
        <NavigationDrawerStructure navigationProps={navigation} />
      ),
      headerStyle: {
        backgroundColor: '#12b2fd',
      },
      headerTintColor: '#fff',
    }),
  },
});

const FollowersScreen_stack = createStackNavigator({
  //All the screen from the Screen3 will be indexed here
  Followers: {
    screen: FollowersScreen,
    navigationOptions: ({ navigation }) => ({
      headerTitle: () => (
        <Image
          source = {require("../img/chittr_logo.png")}
          style = {{width: 100, height: 50, marginLeft: 80}}
        />
      ),
      headerLeft: () => (
        <NavigationDrawerStructure navigationProps={navigation} />
      ),
      headerStyle: {
        backgroundColor: '#12b2fd',
      },
      headerTintColor: '#fff',
    }),
  },
});

const AddChitScreen_stack = createStackNavigator({
  //All the screen from the Screen3 will be indexed here
  AddChit: {
    screen: AddChitScreen,
    navigationOptions: ({ navigation }) => ({
      headerTitle: () => (
        <Image
          source = {require("../img/chittr_logo.png")}
          style = {{width: 100, height: 50, marginLeft: 80}}
        />
      ),
      headerLeft: () => (
        <NavigationDrawerStructure navigationProps={navigation} />
      ),
      headerStyle: {
        backgroundColor: '#12b2fd',
      },
      headerTintColor: '#fff',
    }),
  },
});

const DrawerNavigator = createDrawerNavigator({
  //Drawer Optons and indexing
  Home: {
    //Title
    screen: HomeScreen_stack,
    navigationOptions: {
      drawerLabel: 'Home',
    },
  },
  Login: {
    //Title
    screen: LoginScreen_stack,
    navigationOptions: {
      drawerLabel: 'Login',
    },
  },
  Register: {
    //Title
    screen: RegisterScreen_stack,
    navigationOptions: {
      drawerLabel: 'Register',
    },
  },
  Profile: {
    //Title
    screen: ProfileScreen_stack,
    navigationOptions: {
      drawerLabel: 'Profile',
    },
  },
  AddChit: {
    //Title
    screen: AddChitScreen_stack,
    navigationOptions: {
      drawerLabel: 'Add Chit',
    },
  },
  Following: {
    //Title
    screen: FollowingScreen_stack,
    navigationOptions: {
      drawerLabel: 'Following',
    },
  },
  Followers: {
    //Title
    screen: FollowersScreen_stack,
    navigationOptions: {
      drawerLabel: 'Followers',
    },
  },
});

export default createAppContainer(DrawerNavigator);
