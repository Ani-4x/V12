import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert } from 'react-native';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://192.168.56.1:80');

const Extra = ({ route }) => {
    const { userId, userName } = route.params;
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    //aend message
 
    const sendMessage = async () => {
        if (userId && currentUser && message.trim()) {
            const msg = {
                senderId: currentUser,
                receiverId: userId,
                message: message.trim(),
            };
    
            try {
                // Emit message to Socket.IO
                socket.emit('SendMessage', {...msg});
    
                // Update local state
                setMessages((prev) => [...prev, msg]);
    
                // Save message to the backend
                let response = await axios.post(
                    'http://192.168.56.1:80/SendMessage',
                    msg, 
                    { headers: { 'Content-Type': 'application/json' } } // Ensure proper headers

                    
                );
                return response.msg;
    
                
            } catch (error) {
                console.log('Error sending message to backend:', error.message);
                
            }
    
            // Clear input field
            setMessage('');
        } else {
            Alert.alert('Validation Error', 'Message cannot be empty.');
        }
    };

    // Fetch current user
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get('http://192.168.56.1:80/currentUser');
                setCurrentUser(response.data._id);
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };

        fetchCurrentUser();
    }, []);

    // Fetch messages
    useEffect(() => {
        const fetchMessages = async () => {
            if (currentUser && userId) {
                try {
                    const response = await axios.get(`http://192.168.56.1:80/fetchMessage`);
                    setMessages(response.data.messages || []);
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            }
        };

        fetchMessages();
    }, [currentUser, userId]);

    // Listen for incoming messages
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
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        overflow : 'scroll'
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        borderBottomWidth: 1,
    },
    sent: {
        alignSelf: 'flex-end',
        backgroundColor: 'green',
        color: 'white',
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        maxWidth: '80%',
    },
    received: {
        alignSelf: 'flex-start',
        backgroundColor: '#f0f0f0',
        color: 'black',
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        maxWidth: '80%',
    },
    input: {
        borderWidth: 1,
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
        color: '#000',
    },
});

export default Extra;
