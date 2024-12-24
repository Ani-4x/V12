// import React, { useEffect, useRef, useState } from 'react';
// import { View, StyleSheet, TextInput, Button } from 'react-native';
// import { WebView } from 'react-native-webview';
// import firestore from '@react-native-firebase/firestore';


// const DocEditing = ({ documentId, currentUser }) => {

    
//     const webViewRef = useRef(null);
//     const [documentContent, setDocumentContent] = useState('');

//     // firestore document reference
//     const documentRef = firestore().collection('documents').doc('V12');

//     useEffect(() => {
//         // listen for real-time updates to the document
//         const unsubscribe = documentRef.onSnapshot(snapshot => {
//             if (snapshot.exists) {
//                 const data = snapshot.data();
//                 setDocumentContent(data.content || '');
//                 if (webViewRef.current) {
//                     webViewRef.current.postMessage(JSON.stringify({ content: data.content }));
//                 }
//             }
//         });

//         return unsubscribe;
//     }, [documentId]);

//     // function to handle incoming messages from the WebView
//     const handleWebViewMessage = event => {
//         const { content } = JSON.parse(event.nativeEvent.data);
//         setDocumentContent(content);

//         // update Firestore with the new content
//         documentRef.set({ content }, { merge: true });
//     };

//     return (
//         <View style={styles.container}>
//             <WebView
//                 ref={webViewRef}
//                 originWhitelist={['*']}
//                 source={{
//                     html: `
//             <!DOCTYPE html>
//             <html>
//             <head>
//               <style>
//                 body {
//                   font-family: Arial, sans-serif;
//                   margin: 0;
//                   padding: 0;
//                   height: 100%;
//                 }
//                 #editor {
//                   height: 100%;
//                   border: none;
//                   padding: 10px;
//                   box-sizing: border-box;
//                 }
//               </style>
//             </head>
//             <body>
//               <div id="editor" contenteditable="true" style="border:1px solid #ccc; border-radius:5px;"></div>
//               <script>
//                 const editor = document.getElementById('editor');
//                 window.addEventListener('message', (event) => {
//                   const { content } = JSON.parse(event.data);
//                   if (content !== editor.innerHTML) {
//                     editor.innerHTML = content;
//                   }
//                 });

//                 editor.addEventListener('input', () => {
//                   const content = editor.innerHTML;
//                   window.ReactNativeWebView.postMessage(JSON.stringify({ content }));
//                 });
//               </script>
//             </body>
//             </html>
//           `,
//                 }}
//                 onMessage={handleWebViewMessage}
//                 javaScriptEnabled={true}
//                 domStorageEnabled={true}
//                 style={{ flex: 1 }}
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 10,

//     },
// });

// export default DocEditing;
