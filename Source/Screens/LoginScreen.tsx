// Import necessary modules
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.1.5:5000'; 

const LoginSignupScreen = ({ navigation }) => {
    const [isNewUser, setIsNewUser] = useState(false); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');



    const handleLogin = async () => {
        try {
            const response = await fetch('http://192.168.1.5:5000/Login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }), // Send email and password
            });

            const data = await response.json();

            if (response.ok) {
                
                console.log('Login successful:', data);
                Alert.alert('Success', 'Login successful!');

            //to homescreen
                navigation.navigate('Home', { user: data.user });
            } else {
                Alert.alert('Error', data.error || 'Login failed.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Network error.');
        }

    };

    return (
        <View style={styles.container}>
            <View style={styles.item}>
                <Text style={styles.title}></Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />


                <Button title="Log In" onPress={handleLogin} />


                <Text
                    style={styles.switchText}
                    onPress={() => navigation.navigate('Signup')}
                >
                    {isNewUser ? 'Already have an account? Log In' : 'New user? Sign Up'}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,

        padding: 40,
        backgroundColor: '#9CDCFE'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        backgroundColor: "#000",
        color: "#fff",

    },
    switchText: {
        marginTop: 20,
        color: 'blue',
        textAlign: 'center',
    },
    item: {
        marginTop: 200,
        paddingTop: 1
    }
});


export default LoginSignupScreen;
