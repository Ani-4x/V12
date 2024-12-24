import { View, Text, Alert, TextInput, StyleSheet, Button, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-native-date-picker'

// import { GoogleSignin } from '@react-native-google-signin/google-signin';

// GoogleSignin.configure({
//     webClientId: '354383402947-3p679ce69ilpj5pblmrqlu9cen615heg.apps.googleusercontent.com', // From Firebase console
//     offlineAccess: true,
// });



// const onGoogleButtonPress = async () => {
//     try {
//         // Sign in with Google
//         const { idToken } = await GoogleSignin.signIn();

//         // Create a Google credential with the token
//         const googleCredential = auth.GoogleAuthProvider.credential(idToken);

//         // Sign in the user with the credential
//         const userCredential = await auth().signInWithCredential(googleCredential);

//         // Access user information
//         const { user } = userCredential;
//         console.log('User Info:', user);
//         return user;
//     } catch (error) {
//         console.error(error);
//     }
// };



const API_URL = 'http://192.168.1.5:5000'

const Signup = ({ navigation }) => {

    const [email, setEmail] = useState('');

    const [name, setName] = useState('');
    
    const [password, setPassword] = useState('');

    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)



    const handleSignup = async () => {
        try {
            const response = await axios.post(`${API_URL}/Signup`, { email, password, name });
            if (response.status === 200) {
                Alert.alert('Success', 'Logged in successfully!');
                navigation.navigate('Home'); // to homescreen
            }
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Invalid credentials');
        }


    };
    return (
        <View style={styles.container}>
            <View style={styles.field}>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                    keyboardType="default"
                    autoCapitalize="none"
                />
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

                <View>
                    <TouchableOpacity style={styles.dob} onPress={() => setOpen(true)}>
                        <Text style={{ color: '#fff', alignItems: 'center', alignSelf: 'center' }}>Date of Birth</Text>

                    </TouchableOpacity>
                    {/* <Button title="Sign in with Google" onPress={onGoogleButtonPress} /> */}
                </View>
                <DatePicker
                    modal
                    open={open}
                    date={date}
                    mode={'date'}
                    maximumDate={new Date('2024-12-21')}
                    onConfirm={(date) => {
                        setOpen(false)
                        setDate(date)
                    }}
                    onCancel={() => {
                        setOpen(false)
                    }}
                />

                <Button title='Signup' onPress={handleSignup} />
                <Text
                    style={styles.switchText}
                    onPress={() => navigation.goBack()}
                >
                    Already have an account? Log In
                </Text>
            </View>

        </View>
    )
}

export default Signup;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#9CDCFE',


    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',

    },
    field: {
        marginTop: 100
    },


    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 20,
        paddingLeft: 20,
        marginBottom: 15,
        backgroundColor: "#000",
        color: "#fff",
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',


    },
    switchText: {
        marginTop: 20,
        color: 'blue',
        textAlign: 'center',
    },
    dob: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 20,
        paddingLeft: 20,
        marginBottom: 40,
        backgroundColor: "#000",
        color: "#fff",
        flexDirection: 'row',
        height: 40


    }
});