
import { View, Text, StyleSheet } from 'react-native';
import React,{useEffect} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Toast from '../Toast';
import { login } from '../../src/utils/auth';


const Wait = () => {

 
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login'); // Navigate to targetPage after 3 seconds
    }, 3000); // 3000ms = 3 seconds

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, [router]);


  return (
    <SafeAreaView style={styles.container}>
        <Toast visible={true} message={'Request for new account sent'} type={'success'} />
      <View style={styles.content}>
        <Text style={styles.title}>Request Submitted</Text>
        <Text style={styles.message}>
          Your request has been submitted. Please wait till the supervisor approves your request.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Wait;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
});