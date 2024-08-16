import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import LogIn from './(auth)/login';
import { icons } from '../constants';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <SafeAreaView style={styles.container}>
        <Text className={`font-pbold text-4xl w-max`}>Cmapp Logo</Text>
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }

  return <LogIn />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,  // Adjust the width as needed
    height: 200, // Adjust the height as needed
    resizeMode: 'contain',
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   title : {
//     fontSize : 20,
//     fontWeight : "bold",
//     // textTransform : "uppercase",
//     textAlign: "center",
//     paddingVertical : 40,
//     color : "black"
//   },

//   input : {
//     height : 50,
//     paddingHorizontal : 20,
//     borderColor : "black",
//     borderWidth : 1,
//     borderRadius: 7
//   },

// });
