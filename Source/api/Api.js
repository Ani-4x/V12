import axios from "axios";
import { API_BASE_URL} from '@env';

const Api = axios.create({
    baseURL: 'http://192.168.56.1:80',
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

const socket = io("http://192.168.56.1:5001");

socket.on("offer", (offer) =>{
    pc.current.setRemoteDescription(offer);
});

socket.on("answer", (answer) => {
    pc.current.setRemoteDescription(answer);
})

socket.on("ice-candidate", (candidate) => {
    pc.current.addIceCandidate(candidate);
})




const cacheChatMessages = async (req , res, next) => {
    const { chatId } = req.params;

    client.get(chatId, async(err, data) => {
        if(err) throw err;

        if (data) {
            res.send(JSON.parse(data));
        } else {
            const messages = await Api.get(Message.find({chatId}));
            client.setex(chatId , 3600, JSON.stringify(messages));
            res.send(messages);
        }
    })
}