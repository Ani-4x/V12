import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    FlatList,
    StyleSheet,
} from "react-native";
import io from "socket.io-client";

// Initialize Socket.IO
const socket = io("http://192.168.56.1:80");

const Extra = ({ route }) => {
    const { userId, userName} = route.params;

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    // Join user's room and set up event listeners
    useEffect(() => {
        // Join the room
        socket.on("joinRoom", (userId) => {
            socket.join(userId);
            console.log(`socketId ${socket.id} joint ${userId}`)
        });

        // Fetch old messages
        socket.emit("fetchMessages", { userId, userName }, (fetchedMessages) => {
            if (fetchedMessages && Array.isArray(fetchedMessages)) {
                setMessages(fetchedMessages);
            } else {
                console.error("Failed to fetch messages or invalid data format");
                setMessages([]);
            }
        });

        // Listen for incoming messages
        socket.on("receiveMessage", (msg) => {
            if (
                (msg.senderId === userId && msg.receiverId === userName) ||
                (msg.senderId === userName && msg.receiverId === userId)
            ) {
                setMessages((prev) => [...prev, msg]);
            }
        });

        // Cleanup on unmount
        return () => {
            socket.off("receiveMessage"); // Remove the listener
            socket.disconnect();
        };
    }, [userId, userName]);

    // Send a new message
    const sendMessage = () => {
        if (message.trim()) {
            const msg = { senderId: userId, receiverId: userName, message };

            // Emit the message to the server
            socket.emit("sendMessage", msg, (error) => {
                if (error) {
                    console.error("Error sending message:", error);
                }
            });

            // Update local messages state for instant feedback
            setMessages((prev) => [...prev, { ...msg, timestamp: new Date() }]);
            setMessage("");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{userName}</Text>
            <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Text
                        style={
                            item.senderId === userId
                                ? styles.sentMessage
                                : styles.receivedMessage
                        }
                    >
                        {item.message}
                    </Text>
                )}
                contentContainerStyle={styles.messageList}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    value={message}
                    onChangeText={setMessage}
                />
                <Button title="Send" onPress={sendMessage} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
        padding: 10,
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    messageList: {
        flexGrow: 1,
        justifyContent: "flex-end", // Ensures new messages are displayed at the bottom
    },
    sentMessage: {
        alignSelf: "flex-end",
        backgroundColor: "#d1ffc4",
        padding: 10,
        borderRadius: 15,
        marginVertical: 5,
        maxWidth: "75%",
    },
    receivedMessage: {
        alignSelf: "flex-start",
        backgroundColor: "#f0f0f0",
        padding: 10,
        borderRadius: 15,
        marginVertical: 5,
        maxWidth: "75%",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        paddingTop: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 15,
        padding: 10,
        marginRight: 10,
    },
});

export default Extra;
