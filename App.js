import React, { Component } from 'react';
import { StyleSheet, Button, FlatList, ActivityIndicator, Text, View } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

const TabNavigator = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions :{
        tabBarLabel: 'Home',
        tabBarIcon: ({tintColor}) => (
          <View>
            <Icon size={25} name={'ios-home'} />
          </View>),
        activeColor: '#000000',
      }
    },
    Login: {
      screen: LoginScreen,
      navigationOptions :{
        tabBarLabel: 'Login',
        tabBarIcon: ({tintColor}) => (
          <View>
            <Icon size={25} name={'ios-person'} />
          </View>),
        activeColor: '#000000',
      }
    },
    Register: {
      screen: RegisterScreen,
      navigationOptions :{
        tabBarLabel: 'Register',
        tabBarIcon: ({tintColor}) => (
          <View>
            <Icon size={25} name={'ios-person'} />
          </View>),
        activeColor: '#000000',
      }
    }
  },
  {
    initialRouteName: "Home",
    barStyle: { backgroundColor : '#c7ddf5' },
  }
);

export default createAppContainer(TabNavigator);
