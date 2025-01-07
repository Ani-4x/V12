import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import io from 'socket.io-client';

const socket = io('http://192.168.56.1:5500');

export default function Room({ navigation }) {
  const [roomId, setRoomId] = useState('');
  const [createdRoomId, setCreatedRoomId] = useState(null);

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 10);
    socket.emit('create-room', newRoomId);
    socket.on('room-created', (roomId) => {
      setCreatedRoomId(roomId);
      Alert.alert('Room Created', `Share this Room ID: ${roomId}`);
    });
  };

  const joinRoom = () => {
    if (!roomId) return Alert.alert('Please enter a Room ID');
    socket.emit('join-room', roomId);
    socket.on('room-not-found', () => {
      Alert.alert('Room Not Found');
    });
    navigation.navigate('CallScreen', { roomId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Video Call</Text>
      
      <TouchableOpacity style={styles.createButton} onPress={createRoom}>
        <Text style={styles.buttonText}>Create Room</Text>
      </TouchableOpacity>

      {createdRoomId && (
        <View style={styles.roomInfo}>
          <Text style={styles.roomText}>Room ID: </Text>
          <Text style={styles.roomId}>{createdRoomId}</Text>
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Enter Room ID to Join"
        value={roomId}
        onChangeText={setRoomId}
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity style={styles.joinButton} onPress={joinRoom}>
        <Text style={styles.buttonText}>Join Room</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    padding: 15,
    width: '100%',
    borderRadius: 10,
    marginVertical: 15,
    backgroundColor: '#1e1e1e',
    color: '#fff',
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#1f75fe',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 20,
  },
  joinButton: {
    backgroundColor: '#34c759',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  roomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#252525',
    padding: 15,
    borderRadius: 10,
  },
  roomText: {
    fontSize: 18,
    color: '#fff',
  },
  roomId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});
