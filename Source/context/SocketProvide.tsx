import React, { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();


export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket;
};


export const SocketProvider = (props) => {
       
     const socket = useMemo(() => io(`http://192.168.1.5:5001`), []);



    return(
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    )
}