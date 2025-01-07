// import React, { useState, useEffect } from 'react';
// import { View, Text, Button } from 'react-native';
// import axios from 'axios';

// const UserProfile = () => {
//   const [user, setUser] = useState(null);

//   const fetchUserInfo = async () => {
//     try {
//       const response = await axios.get('https://192.168.56.1:80/GoogleUser');
//       setUser(response.data);
//     } catch (err) {
//       console.error('Error fetching user info', err);
//     }
//   };

//   useEffect(() => {
//     fetchUserInfo();
//   }, []);

//   return (
//     <View>
//       {user ? (
//         <Text>Welcome, {user.name}</Text>
//       ) : (
//         <Text></Text>
//       )}
//     </View>
//   );
// };

// export default UserProfile;
