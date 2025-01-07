import { RTCPeerConnection, RTCView, mediaDevices } from 'react-native-webrtc';
import io from 'socket.io-client';

const socket = io('http://192.168.56.1:5500');

let peerConnection;
const config = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

export const startCall = async (roomId) => {
  peerConnection = new RTCPeerConnection(config);

  // Stream and attach local video
  const stream = await mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

  // Emit room join
  socket.emit('join-room', roomId, socket.id);

  socket.on('user-connected', async (userId) => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit('offer', roomId, { offer, userId });
  });

  socket.on('offer', async (data) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit('answer', roomId, { answer, userId: socket.id });
  });

  socket.on('answer', async (data) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
  });

  socket.on('ice-candidate', (candidate) => {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  });

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('ice-candidate', roomId, event.candidate);
    }
  };

  return stream;
};
