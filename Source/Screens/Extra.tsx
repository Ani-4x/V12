import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import io from 'socket.io-client';
import axios from 'axios';



const socket = io('http://192.168.1.5:5000');

const Extra = ({ route }) => {
    const { userId, userName } = route.params;
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [currentUser, setCurrentUser] = useState(null);


     /// send message

    const sendMessage = async () => {
        if (userId && currentUser && message.trim()) {
            const msg = {
                senderId: currentUser,
                receiverId: userId,
                message: message,
            };

            // send message to Socket.IO
            socket.emit('sendMessage', msg);

            // Update local state

            try {
                // Add the message to the state
                setMessages((prev) => {
                    // Ensure `prev` is an array
                    if (!Array.isArray(prev)) {
                        console.error("Previous messages state is not an array:", prev);
                        return [msg];
                    }
                    return [...prev, msg];
                });
            } catch (error) {
                console.error("Error sending message:", error);
            }

            // save message to backend
            try {
                const text = await axios.post('http://192.168.1.5:5000/SendMessage', msg);
                console.log('message sent to backend')
            } catch (error) {
                Alert.alert('Error sending message:', error.text?.data);
            }

            // clear input field
        }
        setMessage('');
    };


















    /// fetch current user
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get('http://192.168.1.5:5000/currentUser');
                setCurrentUser(response.data._id);
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };

        fetchCurrentUser();
    }, []); 







    /// fetch messages
    useEffect(() => {
        const fetchMessages = async () => {
            if (currentUser && userId) {
                try {
                    const response = await axios.get(`http://192.168.1.5:5000/messages/${currentUser}/${userId}`);
                    setMessages(response.data._messages);
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            }
        };

        fetchMessages();
    }, [currentUser, userId]); 

    /// listen for incoming messages
    useEffect(() => {
        const handleReceiveMessage = (msg) => {
            if (msg.senderId === userId || msg.receiverId === userId) {
                setMessages((prev) => [...prev, msg]);
            }
        };

        socket.on('receiveMessage', handleReceiveMessage);

        return () => {
            socket.off('receiveMessage', handleReceiveMessage); 
        };
    }, [userId]);

   


    return (
        <View style={styles.container}>
            <Text style={styles.header}>{userName}</Text>
            <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Text style={item.senderId === currentUser ? styles.sent : styles.received}>
                        {item.message}
                    </Text>
                )}
            />
            <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message..."
                style={styles.input}
            />
            <Button title="Send" onPress={sendMessage} />
            


        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    userBlock: {
        padding: 15,
        marginVertical: 10,
        borderWidth: 1,
        borderRadius: 8
    },
    user: {
        fontSize: 18
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderBottomWidth: 1
    },
    sent: {
        textAlign: 'right',
        color: 'white',
        margin: 5,
        borderWidth: 1,
        borderRadius: 7,
        fontWeight: 500,
        backgroundColor: 'green',
        height: 'auto',
        alignContent: 'center',
        textAlignVertical: 'center',
        marginTop: 5,
        marginBottom: 5
    },
    received: {
        textAlign: 'left',
        color: 'green',
        margin: 5
    },
    input: {
        borderWidth: 1,
        padding: 10,
        margin: 10,
        borderRadius: 7,
        backgroundColor: '#000',
        color: '#fff'
    },
});

export default Extra;