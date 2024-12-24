import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert } from 'react-native';
import { getUsers } from '../api/Api';
import Conversation from '../components/Conversation';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';



const HomeScreen = ({ navigation }) => {

  const [users, setUsers] = useState([])

  useEffect(() => {
    axios({
      method: 'get',
      url: 'http://192.168.1.5:5000/users',

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
    <SafeAreaView>

      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Welcome to the Home Screen!</Text>
        </View>

        <View style={{ alignItems: "stretch", top: 500 }}>

          <Button title="Contacts" onPress={() => navigation.navigate('Chat')} />
          <Button title="video call" onPress={() => navigation.navigate('VideoScreen')} />
          <Button title="Doc Editing" onPress={() => navigation.navigate('DocEdit')} />
         
        </View>


        <View style={{ alignItems: "stretch", top: 650 }}>

          <Button title="Log Out" onPress={() => navigation.navigate('Login')} />

          

        </View>





      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9cdcfe',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 110
  },
});

export default HomeScreen;
