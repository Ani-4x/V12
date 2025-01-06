import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://192.168.56.1:80');

export default function ChatScreen({ navigation }) {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [receiverId, setReceiverId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const response = await axios.get('http://192.168.56.1:80/currentUser');
            setCurrentUser(response.data._id);
            socket.emit('joinRoom', response.data._id);
        };

        fetchCurrentUser();
    }, []);

    useEffect(() => {
        axios.get('http://192.168.56.1:80/users')
            .then((response) => setUsers(response.data));

        socket.emit('joinRoom', currentUser);

        socket.on('receiveMessage', (msg) => {
            if (msg.senderId === receiverId || msg.receiverId === receiverId) {
                setMessages((prev) => [...prev, msg]);
            }
        });

        return () => socket.disconnect();
    }, [receiverId]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chat Room</Text>

            <View style={styles.userList}>
                <Text style={styles.subTitle}>Users</Text>
                <ScrollView>
                    {users.map((item) => (
                        <TouchableOpacity
                            key={item._id}
                            style={styles.userCard}
                            onPress={() => navigation.navigate('Extra', { userId: item._id, userName: item.name })}
                        >
                            <Text style={styles.userText}>{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>


            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    placeholderTextColor="#aaa"
                    value={message}
                    onChangeText={setMessage}
                />
                <TouchableOpacity style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#1E1E2C',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    subTitle: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 10,
    },
    userList: {
        flex: 0.5,
        backgroundColor: '#29294D',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
    },
    userCard: {
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#1E1E30',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 6,
    },
    userText: {
        color: '#fff',
        fontSize: 16,
    },
    messageContainer: {
        flex: 1,
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#29294D',
        borderRadius: 10,
    },
    messageText: {
        color: '#fff',
        fontSize: 14,
    },
    sent: {
        alignSelf: 'flex-end',
        backgroundColor: '#F85391',
        borderRadius: 10,
        padding: 10,
        marginBottom: 5,
        maxWidth: '70%',
    },
    received: {
        alignSelf: 'flex-start',
        backgroundColor: '#575787',
        borderRadius: 10,
        padding: 10,
        marginBottom: 5,
        maxWidth: '70%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    input: {
        flex: 1,
        backgroundColor: '#1E1E30',
        color: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 50,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#F85391',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
