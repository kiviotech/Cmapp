import { View, Text, TouchableOpacity, Alert, Image, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import LoginField from '../../components/LoginField';
import { useRouter } from 'expo-router';
import { NativeWindStyleSheet } from "nativewind";
import { icons } from '../../constants';

NativeWindStyleSheet.setOutput({
  default: "native",
});

const Login = () => {
  const [usePassword, setUsePassword] = useState(true);
  const [form, setForm] = useState({
    mobile: '',
    password: '',
    otp: '',
    usePassword: usePassword
  });

  const router = useRouter();

  const submit = async (action) => {
    try {
      if (action === 'SignUp') {
        // Navigate to the Sign Up page
        router.replace('/SignUp');
      } else {
        // Handle login action
        router.replace('/HomePage');
      }
    } catch (error) {
      console.error('Error', error.message);
    }
  };


  const toggleUsePassword = () => {
    setUsePassword(!usePassword);
    setForm({ ...form, usePassword: !usePassword });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View>
          <View style={styles.header}>
            <Text className="font-pbold text-3xl font-inter600">Login</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text className="font-inter400" style={styles.labelText}>E-mail</Text>
            <LoginField
              placeholder="Your email or phone"
              value={form.mobile}
              handleChangeText={(e) => setForm({ ...form, mobile: e })}
              keyboardType='email-address'
              className="mb-4"
            />

            {usePassword ? (
              <View style={styles.passwordContainer}>
                <Text className="font-inter400" style={styles.labelText}>Password</Text>
                <LoginField
                  style={styles.loginField}
                  placeholder="Password"
                  value={form.password}
                  handleChangeText={(e) => setForm({ ...form, password: e })}
                  secureTextEntry={true}
                />
              </View>
            ) : (
              <View style={styles.otpContainer}>
                <Text className="font-pbold">OTP</Text>
                <LoginField
                  placeholder="OTP"
                  value={form.otp}
                  handleChangeText={(e) => setForm({ ...form, otp: e })}
                  keyboardType='number-pad'
                  className="mb-4"
                />
              </View>
            )}

            <TouchableOpacity activeOpacity={0.8}>
              <Text className="font-pmedium text-sm text-left text-[#577CFF] font-inter400" style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            buttonStyle={{ backgroundColor: '#577CFF', fontSize: 13, width: 140, letterSpacing: 1 }}
            textStyle={{ fontFamily: 'font-inter400', color: '#FFFFFF' }}
            text='LOGIN'
            handlePress={() => submit('login')}
          />
        </View>

        <View style={styles.signUpContainer}>
          <Text className="font-pmedium text-sm text-[#9C9C9C] font-inter400">
            Don’t have an account?
            <TouchableOpacity onPress={() => submit('SignUp')}>
              <Text className="text-[#577CFF]"> Sign Up</Text>
            </TouchableOpacity>
          </Text>

          <View style={styles.separatorContainer}>
            <View style={styles.separator} />
            <Text className="mx-4 font-pmedium text-sm text-[#9C9C9C] font-inter400">Sign up with</Text>
            <View style={styles.separator} />
          </View>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity activeOpacity={0.8} className="bg-[#FFFFFF] rounded-full shadow flex flex-row justify-center items-center space-x-2" style={styles.socialButton}>
              <Image source={icons.facebook} className="w-6 h-6" />
              <Text className="font-inter400" style={styles.socialButtonText}>FACEBOOK</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} className="bg-[#FFFFFF] rounded-full p-4 shadow flex flex-row justify-center items-center space-x-2" style={styles.socialButton}>
              <Image source={icons.google} className="w-6 h-6" />
              <Text className="font-inter400" style={styles.socialButtonText}>GOOGLE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  passwordContainer: {
    marginTop: 32,
  },
  otpContainer: {
    marginTop: 32,
  },
  labelText: {
    color: '#9796A1',
    fontSize: 13,
    paddingBottom: 2,
  },
  forgotPasswordText: {
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  signUpContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  separator: {
    borderColor: '#D1D1D1',
    borderWidth: 1,
    width: 100,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    spaceX: 16,
  },
  socialButton: {
    width: 147,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  socialButtonText: {
    fontSize: 13,
  },
});
