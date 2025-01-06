import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer, } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../Screens/LoginScreen';
import HomeScreen from '../Screens/Homescreen';
import LoginSignupScreen from '../Screens/LoginScreen';
import Signup from '../Screens/Signup';
import Chats from '../Screens/Chats';

import Extra from '../Screens/Extra';
// import DocEditing from '../Screens/DocEditing';
import VideoCallScreen from '../Screens/VideoCallScreen';
import Call from '../Screens/Call';
import AnalyticsScreen from '../Screens/Analytic';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatScreen from '../Screens/Chats';
import { ScreenStack } from 'react-native-screens';



const Bottom = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AppNav = () => {
  return (
    <NavigationContainer>

    


      <Bottom.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {

          let iconName;
          let rn = route.name;

          if (rn == HomeScreen) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (rn == ChatScreen) {
            iconName = focused ? "fi fi-sr-dialogue-exchange" : 'fi fi-ts-dialogue-exchange';
          }

        }
      })} ta  >
        <Bottom.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Bottom.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
        <Bottom.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Bottom.Screen name="Chat" component={Chats} options={{ headerShown: false }} />
        <Bottom.Screen name="Extra" component={Extra} options={{ headerShown: false }} />
        {/* <Bottom.Screen name="Analytics" component={AnalyticsScreen} options={{headerShown:false}}/> */}
        {/* <Stack.Screen name="fileshr" component={Fileshr} options={{ headerShown: false }} /> */}
        {/* <Stack.Screen name="DocEdit" component={DocEditing} options={{ headerShown: false }} /> */}
        <Stack.Screen name="VideoScreen" component={VideoCallScreen} options={{ headerShown: false }} />
        {/* <Stack.Screen name="Call" component={Call} options={{ headerShown: false }} /> */}
      </Bottom.Navigator>
    </NavigationContainer>
  )
}

export default AppNav