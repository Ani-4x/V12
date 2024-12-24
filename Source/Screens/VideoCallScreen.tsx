// import React, { useState, useRef, useEffect } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, } from 'react-native';
// import { RTCView, mediaDevices, RTCPeerConnection } from 'react-native-webrtc';
// import firestore from '@react-native-firebase/firestore';

// const configuration = {
//     iceServers: [{ urls: 'stun:stun.l.google.com:19302' }], // STUN server for WebRTC
// };

// const VideoCallScreen = () => {
//     const [roomId, setRoomId] = useState('');
//     const [isMuted, setIsMuted] = useState(false);
//     const [isVideoEnabled, setIsVideoEnabled] = useState(true);
//     const [localStream, setLocalStream] = useState(null);
//     const [remoteStream, setRemoteStream] = useState(null);
//     const pc = useRef(new RTCPeerConnection(configuration));

//     useEffect(() => {
//         startLocalStream();
//         return () => {
//             if (localStream) {
//                 localStream.getTracks().forEach((track) => track.stop());
//             }
//             if (pc.current) {
//                 pc.current.close();
//             }
//         };
//     }, []);

//     // turn on the local camera and mic input
//     const startLocalStream = async () => {
//         const stream = await mediaDevices.getUserMedia({
//             video: true,
//             audio: true,
//         });
//         setLocalStream(stream);
//         pc.current.addStream(stream);
//     };

//     // create a room
//     const createRoom = async () => {
//         const roomRef = firestore().collection('rooms').doc();
//         setRoomId(roomRef.id);

//         const offer = await pc.current.createOffer();
//         await pc.current.setLocalDescription(offer);

//         roomRef.set({ offer });

//         roomRef.onSnapshot(async (snapshot) => {
//             const data = snapshot.data();
//             if (data && data.answer) {
//                 const answer = new RTCSessionDescription(data.answer);
//                 await pc.current.setRemoteDescription(answer);
//             }
//         });

//         roomRef.collection('iceCandidates').onSnapshot((snapshot) => {
//             snapshot.docChanges().forEach(async (change) => {
//                 if (change.type === 'added') {
//                     const candidate = new RTCIceCandidate(change.doc.data());
//                     await pc.current.addIceCandidate(candidate);
//                 }
//             });
//         });

//         pc.current.onicecandidate = (event) => {
//             if (event.candidate) {
//                 roomRef.collection('iceCandidates').add(event.candidate.toJSON());
//             }
//         };

//         pc.current.onaddstream = (event) => {
//             setRemoteStream(event.stream);
//         };
//     };

//     // join an existing room
//     const joinRoom = async () => {
//         const roomRef = firestore().collection('rooms').doc(roomId);
//         const roomSnapshot = await roomRef.get();

//         if (roomSnapshot.exists) {
//             const roomData = roomSnapshot.data();
//             const offer = new RTCSessionDescription(roomData.offer);
//             await pc.current.setRemoteDescription(offer);

//             const answer = await pc.current.createAnswer();
//             await pc.current.setLocalDescription(answer);

//             roomRef.update({ answer });

//             roomRef.collection('iceCandidates').onSnapshot((snapshot) => {
//                 snapshot.docChanges().forEach(async (change) => {
//                     if (change.type === 'added') {
//                         const candidate = new RTCIceCandidate(change.doc.data());
//                         await pc.current.addIceCandidate(candidate);
//                     }
//                 });
//             });

//             pc.current.onicecandidate = (event) => {
//                 if (event.candidate) {
//                     roomRef.collection('iceCandidates').add(event.candidate.toJSON());
//                 }
//             };

//             pc.current.onaddstream = (event) => {
//                 setRemoteStream(event.stream);
//             };
//         }
//     };

//     return (
//         <View style={styles.container}>
//             {!localStream && <Text>Loading local stream...</Text>}
//             {localStream && (
//                 <RTCView
//                     streamURL={localStream.toURL()}
//                     style={styles.localStream}
//                     mirror={true}
//                 />
//             )}
//             {remoteStream && (
//                 <RTCView streamURL={remoteStream.toURL()} style={styles.remoteStream} />
//             )}
//             <View style={styles.controls}>
//                 <TextInput
//                     style={styles.input}
//                     value={roomId}
//                     onChangeText={setRoomId}
//                     placeholder="Enter room ID"
//                 />
//                 <Button title="Create Room" onPress={createRoom} />
//                 <Button title="Join Room" onPress={joinRoom} />
//                 <TouchableOpacity
//                     style={styles.button}
//                     onPress={() => setIsMuted(!isMuted)}
//                 >
//                     <Text>{isMuted ? 'Unmute' : 'Mute'}</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                     style={styles.button}
//                     onPress={() => setIsVideoEnabled(!isVideoEnabled)}
//                 >
//                     <Text>{isVideoEnabled ? 'Video Off' : 'Video On'}</Text>
//                 </TouchableOpacity>
//                 <Button title="Hang Up" onPress={() => pc.current.close()} />
//             </View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#000'
//     },
//     localStream: {
//         width: '100%',
//         height: 200
//     },
//     remoteStream: {
//         width: '100%',
//         height: '50%',
//         marginTop: 20
//     },
//     controls: {
//         padding: 10
//     },
//     input: {
//         backgroundColor: '#fff',
//         padding: 10,
//         marginBottom: 10
//     },
//     button: {
//         marginVertical: 5,
//         padding: 10,
//         backgroundColor: '#007AFF'
//     },
// });

// export default VideoCallScreen;
