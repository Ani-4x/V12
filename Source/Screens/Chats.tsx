import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import io from 'socket.io-client';
import axios from 'axios';
import { AccountContext } from '../context/AccountContext';



const socket = io('http://192.168.1.5:5000');

export default function ChatScreen({ navigation }) {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [receiverId, setReceiverId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);  // dynamic user



    /// current user fetch



    useEffect(() => {
        const fetchCurrentUser = async () => {
            const response = await axios.get('http://192.168.1.5:5000/currentUser');  // to get current user
            setCurrentUser(response.data._id);
            socket.emit('joinRoom', response.data._id);
        };

        fetchCurrentUser();
    }, []);

    useEffect(() => {
        axios.get('http://192.168.1.5:5000/users')
            .then((response) => setUsers(response.data));

        socket.emit('joinRoom', setCurrentUser);

        socket.on('receiveMessage', (msg) => {
            if (msg.senderId === receiverId || msg.receiverId === receiverId) {
                setMessages((prev) => [...prev, msg]);
            }
        });


        return () => socket.disconnect();
    }, [receiverId]);




    return (

        <View style={styles.container}>
            <View style={styles.cont2}>
                <Text style={{ fontWeight: 500 }}>Contacts</Text>
            </View>
            <View>
                {users.map((item) => (
                    <View key={item._id} style={{}}>
                        <Text style={styles.user} onPress={() => navigation.navigate('Extra', { userId: item._id, userName: item.name })}>
                            {item.name}
                        </Text>
                    </View>
                ))}
            </View>
            <View>
                {
                    messages.map((item) => (
                        <View key={item._messages}>
                            <Text style={item.senderId === currentUser ? styles.sent : styles.received}>
                                {item.text}
                            </Text>
                        </View>
                    ))
                }
            </View>
           
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    cont2: {
        alignSelf: 'center',
        alignContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderBottomWidth: 2
    },
    user: {
        padding: 10,
        borderBottomWidth: 1,
        borderWidth: 1,
        margin: 2,
        borderRadius: 7,
        overflow: 'scroll'
    },
    sent: {
        textAlign: 'right',
        color: 'blue',
        margin: 5
    },
    received: {
        textAlign: 'left',
        color: 'green',
        margin: 5
    },
    input: {
        borderWidth: 1,
        padding: 10,
        margin: 10
    },
});
