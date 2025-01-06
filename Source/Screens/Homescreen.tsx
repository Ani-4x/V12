import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import { getUsers } from '../api/Api';
import Conversation from '../components/Conversation';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatScreen from './Chats';



const HomeScreen = ({ navigation }) => {


  const MyTabs = createBottomTabNavigator({
    screens: {
      Home: HomeScreen,
      Chat: ChatScreen,
    },
  });

  const [users, setUsers] = useState([])

  useEffect(() => {
    axios({
      method: 'get',
      url: 'http://192.168.56.1:80/users',

    })


      .then(response => {
        setUsers(response.data);  //data to state
      })
      .catch(error => {
        console.error('Error fetching data:', error.message);
      });
  }, []);

  const renderItem = ({ item }) => (
    <View >
      <Text>{item.name}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{flex:1}}>

      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Welcome to the Home Screen!</Text>
        </View>

        <View style={styles.logoutBtn}>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text>
              Logout
            </Text>

          </TouchableOpacity>
          {/* <Button title="video call" onPress={() => navigation.navigate('VideoScreen')} />
          <Button title="Doc Editing" onPress={() => navigation.navigate('DocEdit')} />
          <Button title='Analytic' onPress={() => navigation.navigate('Analytics')} /> */}

        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2d3b9b',
    flex: 1,

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    bottom:280,
    color: '#fff'
  },
  logoutBtn: {
    left: 155,
    bottom: 340,
    borderRadius: 7,
    borderWidth: 1,
    backgroundColor: 'red',
    color: '#fff'
  }
});

export default HomeScreen;
