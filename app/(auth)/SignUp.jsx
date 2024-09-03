import { View, Text, TouchableOpacity, Alert, Image, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import Picker component
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import LoginField from '../../components/LoginField';
import { useRouter } from 'expo-router';
import { NativeWindStyleSheet } from "nativewind";
import { icons } from '../../constants';
import FileUpload from '../../components/FileUploading/FileUpload';
import fonts from '../../constants/fonts';
import colors from '../../constants/colors';
import { getProjects } from "../../src/api/repositories/projectRepository";
NativeWindStyleSheet.setOutput({
    default: "native",
});

const SignUp = () => {
    const [selectedProject, setSelectedProject] = useState(''); // State for dropdown selection
    const [projectsDetail, setProjectsDetail] = useState([]);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        socialSecurity: '',
        project: '',  // New state for project selection
    });

    const [errors, setErrors] = useState({});
    const router = useRouter();

    const validate = () => {
        const newErrors = {};

        if (!form.name) newErrors.name = 'Full name is required';
        if (!form.email) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Enter a valid email address';
        if (!form.password) newErrors.password = 'Password is required';
        else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters long';
        if (!form.socialSecurity) newErrors.socialSecurity = 'Social Security Number is required';
        else if (!/^\d{9}$/.test(form.socialSecurity)) newErrors.socialSecurity = 'Enter a valid 9-digit Social Security Number';
        if (!form.project) newErrors.project = 'Please select a project';  // New validation rule

        return newErrors;
    };

    const handleChangeText = (field, value) => {
        setForm({ ...form, [field]: value });

        // Clear the error for the field that the user is editing, and validate immediately
        const newErrors = { ...errors, [field]: null };
        const updatedErrors = validate();
        if (updatedErrors[field]) {
            newErrors[field] = updatedErrors[field];
        }
        setErrors(newErrors);
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

    useEffect(() => {
        const fetchProjects = async () => {
            const data = await getProjects();
            setProjectsDetail(data.data.data);
            console.log(data.data.data);
        };

        fetchProjects();
    }, []);
    return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text className="font-pbold text-3xl font-inter600">Sign Up</Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text className="font-inter400" style={styles.labelText}>Full name</Text>
                        <LoginField
                            placeholder="Your full name"
                            value={form.name}
                            handleChangeText={(e) => handleChangeText('name', e)}
                            className="mb-4"
                        />
                        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

                        <Text className="font-inter400 mt-8" style={styles.labelText}>E-mail</Text>
                        <LoginField
                            placeholder="Your email or phone"
                            value={form.email}
                            handleChangeText={(e) => handleChangeText('email', e)}
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
                                handleChangeText={(e) => handleChangeText('password', e)}
                                secureTextEntry={true}
                            />
                            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                        </View>

                        <View style={styles.passwordContainer}>
                            <Text className="font-inter400" style={styles.labelText}>Social Security Number</Text>
                            <LoginField
                                placeholder="Social Security"
                                value={form.socialSecurity}
                                handleChangeText={(e) => handleChangeText('socialSecurity', e)}
                                secureTextEntry={true}
                            />
                            {errors.socialSecurity && <Text style={styles.errorText}>{errors.socialSecurity}</Text>}
                        </View>
                    </View>


                    {/* Project Selection Dropdown */}
                    <View style={styles.projectSelectionContainer}>
                        <Text className="font-inter400" style={styles.labelText}>Project Selection</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedProject}
                                onValueChange={(itemValue) => setSelectedProject(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Select a project" value="" />
                                {projectsDetail.map((project, index) => (
                                    <Picker.Item
                                        key={index}
                                        label={project.attributes.name}
                                        value={project.attributes.name}
                                    />
                                ))}
                            </Picker>
                        </View>

                        {errors.project && <Text style={styles.errorText}>{errors.project}</Text>}
                    </View>
                    <View>
                        <FileUpload />
                    </View>

                    <View style={styles.buttonContainer}>
                        <CustomButton
                            buttonStyle={{ backgroundColor: '#577CFF', fontSize: 13, width: 140, letterSpacing: 1 }}
                            textStyle={{ fontFamily: 'font-inter400', color: '#FFFFFF' }}
                            text='SIGNUP'
                            handlePress={submit}
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

export default SignUp;

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
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
    projectSelectionContainer: {  // Styles for project selection container
        marginVertical: 16,
    },
    belText: {
        color: colors.loginSignUpLabelColor,
        fontSize: 13,
        paddingBottom: 2,
        fontFamily: fonts.WorkSans400
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
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 140,
        height: 42,
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    socialButtonText: {
        fontSize: 14,
        fontFamily: fonts.WorkSans500,
        color: '#333',
        marginLeft: 8,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 2,
        fontFamily: fonts.Inter500
    },

    pickerContainer: {
        borderWidth: 0,
        borderColor: colors.borderColor,

        marginTop: 8,
    },
    picker: {
        height: 50,
        width: '100%',
        color: '#000',
        borderRadius: 10,
        fontFamily: fonts.WorkSans400,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 2,
        fontFamily: fonts.Inter500
    },
});
