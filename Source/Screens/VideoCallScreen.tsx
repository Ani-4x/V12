import { View, Text, Button, StyleSheet, TextInput } from 'react-native'
import React, { useRef, useState } from 'react'
import { mediaDevices, RTCPeerConnection, RTCView } from "react-native-webrtc"


const VideoCallScreen = ({ navigation }) => {

    const [roomId, setRoomId] = useState("");

    const createRoom = () => {
        //genrate random id
        navigation.navigate("Call", { roomId, isCreator: true });
        console.log("room id", roomId)
    };

    const joinRoom = () => {
        if (roomId) {
            navigation.navigate("Call", { roomId, isCreaotr: false });
            console.log(roomId)
        }
        else {
            console.log('enter roomId')
        }
    };

    return (
        <View style={styles.constainer}>
            <Button title='Create Room' onPress={createRoom} />
            <TextInput
                style={styles.input}
                placeholder='Enter Room ID'
                value={roomId}
                onChangeText={setRoomId}
            />
            <Button title='Join Room' onPress={joinRoom} />
        </View>
    )

}

export default VideoCallScreen;


const styles = StyleSheet.create({
    constainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        borderWidth: 1,
        padding: 8,
        margin: 10,
        width: '80%',
        backgroundColor: 'black',
        color: 'white'
    }
})