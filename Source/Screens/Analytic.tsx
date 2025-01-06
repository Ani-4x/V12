// import React, { useEffect, useState } from 'react';
// import { View, Image, Text, StyleSheet } from 'react-native';
// import axios from 'axios';

// const AnalyticsScreen = () => {
//     const [chart, setChart] = useState(null);
//     const [prediction, setPrediction] = useState(null);

//     useEffect(() => {
//         // Fetch prediction
//         axios.get('http://127.0.0.1:8000/predict')
//             .then(res => setPrediction(res.data.prediction))
//             .catch(err => console.error(err));

//         // Fetch visualization
//         axios.get('http://127.0.0.1:8000/visualize')
//             .then(res => setChart(res.data.img))
//             .catch(err => console.error(err));
//     }, []);

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Analytics Dashboard</Text>
//             {prediction && <Text>Prediction: {prediction}</Text>}
//             {chart && <Image source={{ uri: chart }} style={styles.chart} />}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor:"#2d3b9b"
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 20,
//         color:'#fff'
//     },
//     chart: {
//         width: 300,
//         height: 300,
//     }
// });

// export default AnalyticsScreen;
