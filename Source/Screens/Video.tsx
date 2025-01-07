import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button, FlatList } from 'react-native';
import { RTCView } from 'react-native-webrtc';
import { startCall } from '../context/Webrtc';

export default function CallScreen({ route }) {
  const { roomId } = route.params;
  const [streams, setStreams] = useState([]);
  const [isAudioEnabled, setAudioEnabled] = useState(true);
  const [isVideoEnabled, setVideoEnabled] = useState(true);

  useEffect(() => {
    startCall(roomId).then((stream) => {
      setStreams((prev) => [...prev, stream]);
    });
  }, []);

  const toggleAudio = () => {
    streams.forEach((stream) => 
      stream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled))
    );
    setAudioEnabled(!isAudioEnabled);
  };

  const toggleVideo = () => {
    streams.forEach((stream) => 
      stream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled))
    );
    setVideoEnabled(!isVideoEnabled);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={streams}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <RTCView
            streamURL={item.toURL()}
            style={styles.video}
            mirror
          />
        )}
      />
      <View style={styles.controls}>
        <Button title={isAudioEnabled ? 'Mute' : 'Unmute'} onPress={toggleAudio} />
        <Button title={isVideoEnabled ? 'Stop Video' : 'Start Video'} onPress={toggleVideo} />
        <Button title="Leave" onPress={() => naviga} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  video: { width: '50%', height: 250 },
  controls: { flexDirection: 'row', justifyContent: 'space-evenly', margin: 20 },
});
