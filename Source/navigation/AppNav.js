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
// import VideoCallScreen from '../Screens/VideoCallScreen';


const Stack = createNativeStackNavigator();

const AppNav = () => {
  return (
    <NavigationContainer>

      <Stack.Navigator >
         <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Chat" component={Chats} options={{ headerShown: false }} /> 
        <Stack.Screen name="Extra" component={Extra} options={{ headerShown: false }} />
        {/* <Stack.Screen name="fileshr" component={Fileshr} options={{ headerShown: false }} /> */}
        {/* <Stack.Screen name="DocEdit" component={DocEditing} options={{ headerShown: false }} /> */}
        {/* <Stack.Screen name="VideoScreen" component={VideoCallScreen} options={{ headerShown: false }} /> */}

      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNav