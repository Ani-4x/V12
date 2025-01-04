import messaging, { requestPermission } from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import { useEffect } from 'react';

const Notification = () => {

    useEffect (() => {
        requestUserPermission();
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            Alert.alert('New message!', JSON.stringify(remoteMessage));
        });
        return unsubscribe;

    }, []);

    async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled = 
        authStatus === messaging.AuthorizationStatus.AUTHORIZED || 
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled){
            console.log('Auth status', authStatus)
        }
    }

}

export default Notification;