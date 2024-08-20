import { View, Text, TouchableOpacity, Alert, Image, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import LoginField from '../../components/LoginField';
import { useRouter } from 'expo-router';
import { NativeWindStyleSheet } from "nativewind";
import { icons } from '../../constants';
import FileUpload from '../../components/FileUploading/FileUpload';

NativeWindStyleSheet.setOutput({
    default: "native",
});

const signup = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        socialSecurity: ''
    });

    const [errors, setErrors] = useState({});
    const router = useRouter();

    const validate = () => {
        const newErrors = {};
        
        if (!form.name) newErrors.name = 'Full name is required';
        if (!form.email) newErrors.email = 'Email is required';
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Enter a valid email address';
        if (!form.password) newErrors.password = 'Password is required';
        else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters long';
        if (!form.socialSecurity) newErrors.socialSecurity = 'Social Security Number is required';
        else if (!/^\d{9}$/.test(form.socialSecurity)) newErrors.socialSecurity = 'Enter a valid 9-digit Social Security Number';
        
        return newErrors;
    };

    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });

        if (errors[field]) {
            setErrors({ ...errors, [field]: null });
        }
    };

    const submit = async () => {
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            router.replace('/login');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <ScrollView >
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <View>
                        <View style={styles.header}>
                            <Text className="font-pbold text-3xl font-inter600">Sign Up</Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text className="font-inter400" style={styles.labelText}>Full name</Text>
                            <LoginField
                                placeholder="Your full name"
                                value={form.name}
                                handleChangeText={(e) => handleChange('name', e)}
                                className="mb-4"
                            />
                            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                            
                            <Text className="font-inter400 mt-8" style={styles.labelText}>E-mail</Text>
                            <LoginField
                                placeholder="Your email or phone"
                                value={form.email}
                                handleChangeText={(e) => handleChange('email', e)}
                                keyboardType='email-address'
                                className="mb-4"
                            />
                            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                            <View style={styles.passwordContainer}>
                                <Text className="font-inter400" style={styles.labelText}>Password</Text>
                                <LoginField
                                    style={styles.loginField}
                                    placeholder="Password"
                                    value={form.password}
                                    handleChangeText={(e) => handleChange('password', e)}
                                    secureTextEntry={true}
                                />
                                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                            </View>

                            <View style={styles.passwordContainer}>
                                <Text className="font-inter400" style={styles.labelText}>Social Security Number</Text>
                                <LoginField
                                    placeholder="Social Security"
                                    value={form.socialSecurity}
                                    handleChangeText={(e) => handleChange('socialSecurity', e)}
                                    secureTextEntry={true}
                                />
                                {errors.socialSecurity && <Text style={styles.errorText}>{errors.socialSecurity}</Text>}
                            </View>
                        </View>
                    </View>

                    <View>
                        <FileUpload />
                    </View>

                    <View style={styles.buttonContainer}>
                        <CustomButton
                            buttonStyle={{ backgroundColor: '#577CFF', fontSize: 13, width: 140, letterSpacing: 1 }}
                            textStyle={{ fontFamily: 'font-inter400', color: '#FFFFFF' }}
                            text='SIGNUP'
                            onPress={submit}
                        />
                    </View>

                    <View style={styles.SignUpContainer}>
                        <Text className="font-pmedium text-sm text-[#9C9C9C] font-inter400">
                            Already have an account? <Text className="text-[#577CFF]" onPress={() => router.replace('/login')}>Login</Text>
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
        </ScrollView>
    );
};

export default signup;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        paddingTop: 20
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
    labelText: {
        color: '#9796A1',
        fontSize: 13,
        paddingBottom: 2,
    },
    buttonContainer: {
        marginTop: 32,
        alignItems: 'center',
    },
    SignUpContainer: {
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
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    },
});
