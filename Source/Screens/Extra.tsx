import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Alert, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://192.168.56.1:80');

const Extra = ({ route }) => {
    const { userId, userName } = route.params;
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    const sendMessage = async () => {
        if (!message.trim()) {
            return Alert.alert('Validation Error', 'Message cannot be empty.');
        }

        const msg = {
            senderId: currentUser,
            receiverId: userId,
            message: message.trim(),
        };

        try {
            socket.emit('SendMessage', msg);
            setMessages((prev) => [...prev, msg]);
            await axios.post('http://192.168.56.1:80/SendMessage', msg, {
                headers: { 'Content-Type': 'application/json' }
            });
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error.message);
            Alert.alert('Error', 'Failed to send message.');
        }
    };

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get('http://192.168.56.1:80/currentUser');
                setCurrentUser(response.data._id);
            } catch (error) {
                Alert.alert('Error', 'Unable to fetch current user.');
            }
        };

        fetchCurrentUser();
    }, []);

    useEffect(() => {
        const fetchMessages = async () => {
            if (currentUser && userId) {
                try {
                    const response = await axios.get('http://192.168.56.1:80/fetchMessages', {
                        params: { senderId: currentUser, receiverId: userId }
                    });
                    setMessages(response.data.messages || []);
                } catch (error) {
                    console.error('Error fetching messages:', error.message);
                }
            }
        };

        fetchMessages();
    }, [currentUser, userId]);

    useEffect(() => {
        const handleReceiveMessage = (msg) => {
            if (msg.senderId === userId || msg.receiverId === userId) {
                setMessages((prev) => [...prev, msg]);
            }
        };

        socket.on('receiveMessage', handleReceiveMessage);

        return () => socket.off('receiveMessage', handleReceiveMessage);
    }, [userId]);

    return (
        <KeyboardAvoidingView
            
            style={styles.container}
        >
            <Text style={styles.header}>{userName}</Text>

            <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingVertical: 15 }}
                renderItem={({ item }) => (
                    <View
                        style={item.senderId === currentUser ? styles.sent : styles.received}
                    >
                        <Text style={styles.messageText}>{item.message}</Text>
                    </View>
                )}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Type a message..."
                    style={styles.input}
                    placeholderTextColor="#ccc"
                />
                <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
                    <Text style={styles.sendBtnText}>Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E2C',
        paddingHorizontal: 15,
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 15,
        color: '#fff',
    },
    sent: {
        alignSelf: 'flex-end',
        backgroundColor: '#5DB075',
        padding: 12,
        marginVertical: 5,
        borderRadius: 20,
        borderTopRightRadius: 2,
        maxWidth: '75%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
    },
    received: {
        alignSelf: 'flex-start',
        backgroundColor: '#33334D',
        padding: 12,
        marginVertical: 5,
        borderRadius: 20,
        borderBottomLeftRadius: 2,
        maxWidth: '75%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
    },
    messageText: {
        color: '#fff',
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: '#444',
    },
    input: {
        flex: 1,
        backgroundColor: '#2C2C3C',
        color: '#fff',
        padding: 12,
        borderRadius: 25,
        marginRight: 10,
        fontSize: 16,
    },
    sendBtn: {
        backgroundColor: '#5DB075',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
    },
    sendBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Extra;
