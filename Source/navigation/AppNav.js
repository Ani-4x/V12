import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from '../Screens/LoginScreen';
import Signup from '../Screens/Signup';
// import HomeScreen from '../Screens/Homescreen';
import Chats from '../Screens/Chats';
import Extra from '../Screens/Extra';
import VideoCallScreen from '../Screens/VideoCallScreen';

const Stack = createNativeStackNavigator();
const Bottom = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Bottom.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        let rn = route.name;

        if (rn === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (rn === 'Chat') {
          iconName = focused ? 'fi fi-sr-dialogue-exchange' : 'fi fi-ts-dialogue-exchange';
        } else if (rn == 'Extra') {
          iconName = focused ? '' : '';
        } else if (rn == 'VideoScreen') {
          iconName = focused ? "" : ""
        }
        return null; 
      },
    })}>
      {/* <Bottom.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} /> */}
      <Bottom.Screen name="Chat" component={Chats} options={{ headerShown: false }} />
      <Bottom.Screen name="Extra" component={Extra} options={{ headerShown: false }} />
      <Bottom.Screen name="VideoScreen" component={VideoCallScreen} options={{ headerShown: false }} />

    </Bottom.Navigator>
  );
};

const AppNav = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNav;