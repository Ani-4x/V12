import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { RTCPeerConnection, RTCView, mediaDevices } from 'react-native-webrtc';
import io from 'socket.io-client';

const socket = io.connect('http://192.168.56.1:5500');

const configuration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

const VideoCallScreen = () => {
  const [roomId, setRoomId] = useState('');
  const [stream, setStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [participants, setParticipants] = useState([]);

  const pc = useRef(new RTCPeerConnection(configuration));
  const peers = useRef({});

  useEffect(() => {
    const startLocalStream = async () => {
      try {
        const localStream = await mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(localStream);
        localStream.getTracks().forEach(track => pc.current.addTrack(track, localStream));
      } catch (error) {
        Alert.alert('Error', 'Failed to access camera and microphone.');
        console.error('getUserMedia error:', error);
      }
    };

    startLocalStream();

    socket.on('participants', (users) => {
      setParticipants(users);
    });

    socket.on('signal', async (data) => {
      const peerConnection = pc.current;
      if (data.signal.type === 'offer') {
        await peerConnection.setRemoteDescription(data.signal);
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit('signal', { to: data.from, signal: answer });
      } else if (data.signal.type === 'answer') {
        await peerConnection.setRemoteDescription(data.signal);
      } else if (data.signal.candidate) {
        await peerConnection.addIceCandidate(data.signal.candidate);
      }
    });

    pc.current.ontrack = (event) => {
      const newStream = event.streams[0];
      if (!remoteStreams.find((s) => s.id === newStream.id)) {
        setRemoteStreams((prev) => [...prev, newStream]);
      }
    };

    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('signal', { signal: event.candidate });
      }
    };

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
      pc.current.close();
      socket.off('participants');
      socket.off('signal');
    };
  }, []);

  const createRoom = () => {
    if (roomId) {
      socket.emit('createRoom', roomId);
    } else {
      Alert.alert('Room ID is required.');
    }
  };

  const joinRoom = () => {
    if (roomId) {
      socket.emit('joinRoom', roomId);
    } else {
      Alert.alert('Room ID is required.');
    }
  };

  const toggleMute = () => {
    stream.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
  };

  const toggleCamera = () => {
    stream.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
  };

  return (
    
    <View style={styles.container}>
      <Text style={styles.heading}>Video</Text>

      <View style={styles.videoContainer}>
        {stream && <RTCView streamURL={stream.toURL()} style={styles.video} />}
      </View>

      <View style={styles.remoteVideos}>
        {remoteStreams.map((remoteStream, index) => (
          <RTCView key={index} streamURL={remoteStream.toURL()} style={styles.remoteVideo} />
        ))}
      </View>

      <View style={styles.controls}>
        <TextInput
          value={roomId}
          onChangeText={setRoomId}
          placeholder="Enter Room ID"
          style={styles.input}
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={createRoom}>
            <Text style={styles.buttonText}>Create Room</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={joinRoom}>
            <Text style={styles.buttonText}>Join Room</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={toggleMute}>
            <Text style={styles.buttonText}>Mic</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleCamera}>
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.participantHeading}>Participants</Text>
      <FlatList
        data={participants}
        renderItem={({ item }) => (
          <View style={styles.participantItem}>
            <Text style={styles.participantText}>{item}</Text>
          </View>
        )}
        keyExtractor={(item) => item}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  videoContainer: {
    width: '100%',
    height: 350,
    backgroundColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
  },
  remoteVideos: {
    width: '100%',
    height: 150,
    marginTop: 10,
    flexDirection: 'row',
  },
  video: {
    flex: 1,
  },
  remoteVideo: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  controls: {
    alignItems: 'center',
    marginTop: 20,
  },
  input: {
    width: '90%',
    padding: 12,
    marginBottom: 15,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 8,
    color: '#fff',
    backgroundColor: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  button: {
    flex: 1,
    padding: 15,
    marginHorizontal: 5,
    backgroundColor: '#000',
    borderRadius: 7,
    alignItems: 'center',
    margin:5
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default VideoCallScreen;
