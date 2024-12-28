import React, { useState, useRef, useEffect } from "react";
import { View, Button, StyleSheet } from "react-native";
import { RTCPeerConnection, mediaDevices, RTCView } from "react-native-webrtc";
import io from "socket.io-client";

const signalingServer = "http://192.168.56.1:5001"; // Replace with your server URL
const socket = io(signalingServer);

const Call = ({ route }) => {
  const { roomId, isCreator } = route.params;
  const [localStream, setLocalStream] = useState('');
  const [remoteStream, setRemoteStream] = useState('');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const pc = useRef(new RTCPeerConnection());

  useEffect(() => {
    // Initialize WebRTC and Signaling
    const setupConnection = async () => {
      const stream = await mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      stream.getTracks().forEach((track) => pc.current.addTrack(track, stream));

      pc.current.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };

      pc.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", { roomId, candidate: event.candidate });
        }
      };

      if (isCreator) {
        socket.emit("create-room", roomId);
        const offer = await pc.current.createOffer();
        await pc.current.setLocalDescription(offer);
        socket.emit("offer", { roomId, offer });
      } else {
        socket.emit("join-room", roomId);
      }
    };

    socket.on("offer", async ({ offer }) => {
      await pc.current.setRemoteDescription(offer);
      const answer = await pc.current.createAnswer();
      await pc.current.setLocalDescription(answer);
      socket.emit("answer", { roomId, answer });
    });

    socket.on("answer", async ({ answer }) => {
      await pc.current.setRemoteDescription(answer);
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      if (candidate) await pc.current.addIceCandidate(candidate);
    });

    setupConnection();

    return () => {
      pc.current.close();
      socket.disconnect();
    };
  }, []);

  const toggleAudio = () => {
    const audioTrack = localStream.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
    setIsAudioEnabled(audioTrack.enabled);
  };

  const toggleVideo = () => {
    const videoTrack = localStream.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
    setIsVideoEnabled(videoTrack.enabled);
  };

  return (
    <View style={styles.container}>
      {localStream && (
        <RTCView streamURL={localStream.toURL()} style={styles.localVideo} />
      )}
      {remoteStream && (
        <RTCView streamURL={remoteStream.toURL()} style={styles.remoteVideo} />
      )}
      <Button title={isAudioEnabled ? "Mute" : "Unmute"} onPress={toggleAudio} />
      <Button title={isVideoEnabled ? "Turn Video Off" : "Turn Video On"} onPress={toggleVideo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "black" },
  localVideo: { width: "100%", height: 500, backgroundColor: "gray" },
  remoteVideo: { width: "100%", height: "auto", backgroundColor: "gray" },
});

export default Call;
