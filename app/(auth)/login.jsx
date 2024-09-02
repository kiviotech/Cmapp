import { View, Text, TouchableOpacity, Alert, Image, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import LoginField from '../../components/LoginField';
import { useRouter } from 'expo-router';
import { NativeWindStyleSheet } from "nativewind";
import { icons } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import { login } from '../../src/utils/auth';

NativeWindStyleSheet.setOutput({
  default: "native",
});

const Login = () => {
  const [usePassword, setUsePassword] = useState(true);
  const [form, setForm] = useState({
    mobile: '',
    password: '',
    otp: '',
  });
  const [errors, setErrors] = useState({
    mobile: '',
    password: '',
    otp: '',
  });

  const router = useRouter();
  const navigation = useNavigation();

  const validateField = (name, value) => {
    let error = '';
    if (name === 'mobile') {
      const mobileRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        error = 'Email is required';
      } else if (!mobileRegex.test(value)) {
        error = 'Invalid email';
      }
    }
    if (usePassword && name === 'password') {
      if (!value) {
        error = 'Password is required';
      } else if (value.length < 6) {
        error = 'Password must be at least 6 characters';
      }
    }
    if (!usePassword && name === 'otp') {
      if (!value) {
        error = 'OTP is required';
      } else if (value.length !== 6) {
        error = 'OTP must be 6 digits';
      }
    }
    return error;
  };

  const handleChangeText = (name, value) => {
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
    setForm({ ...form, [name]: value });
  };

  const handleLogin = async () => {
    
    try {
      const mobileError = validateField('mobile', form.mobile);
      const passwordError = usePassword ? validateField('password', form.password) : '';
      const otpError = !usePassword ? validateField('otp', form.otp) : '';

      if (mobileError || passwordError || otpError) {
        setErrors({
          mobile: mobileError,
          password: passwordError,
          otp: otpError,
        });
        return;
      }

      // Attempt to log in with the provided mobile and password/otp
      const response = await login(form.mobile, usePassword ? form.password : form.otp);

      // Store the JWT token in localStorage
      localStorage.setItem('authToken', response.jwt);

      // Navigate to the dashboard after successful login
      router.replace('/dashboard');

    } catch (error) {
      console.error('Error', error.message);
      // Handle error, such as showing an error message to the user
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View>
          <View style={styles.header}>
            <Text className="font-pbold text-3xl font-inter600">Login</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.labelText}>E-mail</Text>
            <LoginField
              placeholder="Your email or phone"
              value={form.mobile}
              handleChangeText={(value) => handleChangeText('mobile', value)}
              keyboardType='email-address'
              className="mb-4"
            />
            {errors.mobile ? <Text style={styles.errorText}>{errors.mobile}</Text> : null}

            {usePassword ? (
              <View style={styles.passwordContainer}>
                <Text style={styles.labelText}>Password</Text>
                <LoginField
                  style={styles.loginField}
                  placeholder="Password"
                  value={form.password}
                  handleChangeText={(value) => handleChangeText('password', value)}
                  secureTextEntry={true}
                />
                {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
              </View>
            ) : (
              <View style={styles.otpContainer}>
                <Text className="font-pbold">OTP</Text>
                <LoginField
                  placeholder="OTP"
                  value={form.otp}
                  handleChangeText={(value) => handleChangeText('otp', value)}
                  keyboardType='number-pad'
                  className="mb-4"
                />
                {errors.otp ? <Text style={styles.errorText}>{errors.otp}</Text> : null}
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
            handlePress={() => handleLogin('login')}
          />
        </View>

        <View style={styles.signUpContainer}>
          <Text className="font-pmedium text-sm text-[#9C9C9C] font-inter400">
            Don’t have an account?
            <TouchableOpacity onPress={() => navigation.navigate('(auth)/SignUp')}>
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
    backgroundColor: colors.background,
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
    color: colors.loginSignUpLabelColor,
    fontSize: 13,
    fontFamily: fonts.WorkSans400,
    paddingBottom: 2,
  },
  forgotPasswordText: {
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
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
    borderColor: colors.borderColor,
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