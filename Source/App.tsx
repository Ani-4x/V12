import React from 'react';

import { AuthProvider } from './Auth/AuthContext';
import AppNav from './navigation/AppNav';


import { AppRegistry } from 'react-native';

import firebase from '@react-native-firebase/app';

import io from 'socket.io-client'




import messaging, { requestPermission } from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import { useEffect } from 'react';

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


  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }


  const getToken = async () => {
    const token = await messaging().getToken()
    console.log("Token:", token)
  }

  useEffect(() => {
    requestUserPermission()
    getToken()
  }, []);

  const socket = io('http://127.0.0.1:8000');

  useEffect(() => {
    socket.on('chart_update', (data) => {
      setChart(data.img);
    });
  }, []);


  return (

    <AppNav />


  );
}
