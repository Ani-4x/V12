import React from 'react';

import { AuthProvider } from './Auth/AuthContext';
import AppNav from './navigation/AppNav';


import { AppRegistry } from 'react-native';

import firebase from '@react-native-firebase/app';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0m0WR6e8Wwux1T1hCxXV2Gb-Lk0W276c",
  authDomain: "your-auth-domain",
  projectId: "v12-5213a",
  appId: "1:354383402947:android:6f5e0950056925e56e8f76",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

AppRegistry.registerComponent('V12', () => App);


export default function App() {
  return (
   
     <AppNav />
   
  );
}
