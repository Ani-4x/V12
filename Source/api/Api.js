import axios from "axios";
import { API_BASE_URL} from '@env';

const Api = axios.create({
    baseURL: 'http://192.168.1.5:5000',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const Signup  = async ( email, password) => {
    try{
        const response = await Api.post('/Signup', { email , password , name});
        return response.data;
    } catch (err){
        console.log('Signup error:' , err.response.data);
        throw err;
    }
};

export const Login = async (email, password) => {
    try {
        const response = await Api.post('/Login' , { email, password});
            return response.data;
        
    } catch (err) {
        console.log('Login error:' , err.response.data);
        throw err;
    }

}


import io from 'socket.io-client';

const socket = io("http://192.168.1.5:5001");

socket.on("offer", (offer) =>{
    pc.current.setRemoteDescription(offer);
});

socket.on("answer", (answer) => {
    pc.current.setRemoteDescription(answer);
})

socket.on("ice-candidate", (candidate) => {
    pc.current.addIceCandidate(candidate);
})