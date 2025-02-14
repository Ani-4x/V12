import React, { useState , useEffect } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet ,Button ,} from 'react-native';
import axios from 'axios';










// import { GoogleSignin } from '@react-native-google-signin/google-signin';

// GoogleSignin.configure({
//     webClientId: '354383402947-3p679ce69ilpj5pblmrqlu9cen615heg.apps.googleusercontent.com', // From Firebase console
//     offlineAccess: true,
// });

// const GoogleSignInScreen = () => {
//     useEffect(() => {
//       GoogleSignin.signOut(); // Optional: Sign out on component mount for fresh login
//     }, []);
  
//     const handleGoogleSignIn = async () => {
//       try {
//         await GoogleSignin.hasPlayServices();
//         const userInfo = await GoogleSignin.signIn();
        
//         // Send to backend for MongoDB storage
//         const response = await axios.post('https://192.168.56.1:80/auth/google', {
//           idToken: userInfo.idToken,
//           user: userInfo.user,
//         });
  
//         Alert.alert('Success', `Welcome ${response.data.name}`);
        
//       } catch (error) {
//         if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//           Alert.alert('Cancelled', 'Sign in cancelled');
//         } else if (error.code === statusCodes.IN_PROGRESS) {
//           Alert.alert('Signing in', 'In progress...');
//         } else {
//           Alert.alert('Error', 'Something went wrong');
//         }
//       }
//     };



const PORT = 80;
const API_URL = `http://192.168.56.1:${PORT}`;

const Signup = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        try {
            const response = await axios.post(`${API_URL}/Signup`, { email, password, name });
            if (!email || !password || !name){
                Alert.alert('enter valid details')
               
            }
            else {response.status === 200 
                Alert.alert('Success', 'Account created successfully!');
                navigation.navigate('Chat')};
            
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Signup failed. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Create Account</Text>
         

                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor="#aaa"
                    value={name}
                    onChangeText={setName}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#aaa"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#aaa"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                    <Text style={styles.signupText}>Sign Up</Text>
                </TouchableOpacity>

                <Text style={styles.orText}>OR</Text>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.switchText}>
                        Already have an account? <Text style={styles.loginText}>Log In</Text>
                        {/* <Button title="Sign in with Google" onPress={handleGoogleSignIn} /> */}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E1E2C',
    },
    card: {
        width: '90%',
        padding: 30,
        borderRadius: 15,
        backgroundColor: '#29294D',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#bbb',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        borderWidth: 0,
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        backgroundColor: '#1E1E30',
        color: '#fff',
        fontSize: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    signupButton: {
        backgroundColor: '#F85391',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    signupText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    orText: {
        color: '#bbb',
        textAlign: 'center',
        marginVertical: 15,
    },
    switchText: {
        color: '#bbb',
        textAlign: 'center',
        marginTop: 10,
    },
    loginText: {
        color: '#F57C00',
        fontWeight: 'bold',
    },
});


export default Signup;