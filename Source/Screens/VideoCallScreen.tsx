import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList , StyleSheet } from 'react-native';
import { RTCPeerConnection, RTCView, mediaDevices } from 'react-native-webrtc';
import io from 'socket.io-client';

const socket = io.connect('http://192.168.56.1:5500');

const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

const VideoCallScreen = () => {
    const [roomId, setRoomId] = useState('');
    const [stream, setStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState([]);
    const [participants, setParticipants] = useState([]);

    const pc = useRef(new RTCPeerConnection(configuration));
    const peers = useRef({});
    
    useEffect(() => {
        mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                setStream(stream);
                stream.getTracks().forEach(track => pc.current.addTrack(track, stream));
            });

        socket.on('participants', (users) => {
            setParticipants(users);
        });

        socket.on('signal', async (data) => {
            if (data.signal.type === 'offer') {
                await pc.current.setRemoteDescription(data.signal);
                const answer = await pc.current.createAnswer();
                await pc.current.setLocalDescription(answer);
                socket.emit('signal', { to: data.from, signal: answer });
            } else if (data.signal.type === 'answer') {
                await pc.current.setRemoteDescription(data.signal);
            } else if (data.signal.candidate) {
                await pc.current.addIceCandidate(data.signal.candidate);
            }
        });

        return () => {
            stream?.getTracks().forEach(track => track.stop());
            pc.current.close();
        };
    }, []);

    const createRoom = () => {
        socket.emit('createRoom', roomId);
    };

    const joinRoom = () => {
        socket.emit('joinRoom', roomId);
    };

    const toggleMute = () => {
        stream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
    };

    const toggleCamera = () => {
        stream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
    };

    return (
        <View style={styles.container}>
      <Text style={styles.heading}>Video Conference</Text>

      <View style={styles.videoContainer}>
        <RTCView
          streamURL={stream ? stream.toURL() : ''}
          style={styles.video}
        />
      </View>

      <View style={styles.controls}>
        <TextInput
          value={roomId}
          onChangeText={setRoomId}
          placeholder="Enter Room ID"
          style={styles.input}
        />
        <View style={styles.buttonRow}>
          <Button title="Create Room" onPress={createRoom} />
          <Button title="Join Room" onPress={joinRoom} />
        </View>
        <View style={styles.buttonRow}>
          <Button title="Mute/Unmute" onPress={toggleMute} />
          <Button title="Toggle Camera" onPress={toggleCamera} />
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
    backgroundColor: '#f0f4f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  videoContainer: {
    width: '100%',
    height: 400,
    backgroundColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  controls: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '90%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 10,
  },
  participantHeading: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 15,
  },
  participantItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  participantText: {
    fontSize: 16,
  },
});


export default VideoCallScreen;

    
