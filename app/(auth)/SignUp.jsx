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
import { signup } from '../../src/utils/auth';  // Import the signup function

NativeWindStyleSheet.setOutput({
    default: "native",
});

const SignUp = () => {
    const [selectedProject, setSelectedProject] = useState(''); // State for dropdown selection
    const [projectsDetail, setProjectsDetail] = useState([]);

    const cardDataArray = [
        {
            projectId: 1,
            projectName: "Survey and Marking",
            projectDescription:
                "Ensure survey accuracy by cross-referencing multiple points. Verify site layout against survey plans.",
            deadline: Date.now(),
            taskStatus: "Task Completed",
            taskStatusColor: "#A3D65C",
            cardColor: "#EEF7E0",
            status: "",
        },
        {
            projectId: 2,
            projectName: "Verification & Inspection",
            projectDescription:
                "Regular site walkthroughs to ensure compliance with safety regulations and quality standards.",
            deadline: Date.now(),
            taskStatus: "Rejected",
            taskStatusColor: "#FC5275",
            cardColor: "#FED5DD",
            status: "rejected",
        },
    ];

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
        // if (!form.socialSecurity) newErrors.socialSecurity = 'Social Security Number is required';
        // else if (!/^\d{9}$/.test(form.socialSecurity)) newErrors.socialSecurity = 'Enter a valid 9-digit Social Security Number';
        // if (!selectedProject) newErrors.project = 'Please select a project';  // Update validation rule to check selectedProject

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
            const { name, email, password, socialSecurity } = form;
            const project = selectedProject;

            // Call the signup function with the form data
            await signup(name, email, password, socialSecurity, project);

            // Navigate to the login page after successful signup
            router.replace('/login');
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        setProjectsDetail(cardDataArray);
        // Uncomment if fetching projects from an API
        // const fetchProjects = async () => {
        //     const data = await getProjects();
        //     setProjectsDetail(data.data.data);
        //     console.log(data.data.data);
        // };
        // fetchProjects();
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
                                onValueChange={(itemValue) => {
                                    setSelectedProject(itemValue);
                                    handleChangeText('project', itemValue);  // Update project selection and validate
                                }}
                                style={styles.picker}
                            >
                                <Picker.Item label="Select a project" value="" />
                                {projectsDetail.map((project, index) => (
                                    <Picker.Item
                                        key={index}
                                        label={project?.projectName}
                                        value={project?.projectId}
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

                        {/* <View style={styles.socialButtonsContainer}>
                            <TouchableOpacity activeOpacity={0.8} className="bg-[#FFFFFF] rounded-full shadow flex justify-center items-center p-3">
                                <Image
                                    source={icons.google}
                                    resizeMode="contain"
                                    style={styles.socialIcon}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} className="bg-[#FFFFFF] rounded-full shadow flex justify-center items-center p-3">
                                <Image
                                    source={icons.facebook}
                                    resizeMode="contain"
                                    style={styles.socialIcon}
                                />
                            </TouchableOpacity>
                        </View> */}
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
};

export default SignUp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    inputContainer: {
        marginVertical: 20,
    },
    passwordContainer: {
        marginTop: 20,
    },

    buttonContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    labelText: {
        marginBottom: 10,
        fontFamily: fonts.inter400,
    },
    loginField: {
        marginBottom: 15,
    },

    picker: {
        height: 50,
        borderRadius: 10,
        padding: 5
    },
    errorText: {
        color: 'red',
        marginTop: 5,
        fontFamily: fonts.inter400,
    },
    SignUpContainer: {
        marginTop: 50,
        alignItems: 'center',
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    separator: {
        flex: 1,
        height: 1,
        backgroundColor: '#E1E1E1',
    },
    // socialButtonsContainer: {
    //     flexDirection: 'row',
    //     marginTop: 20,
    //     justifyContent: 'center',
    // },
    // socialIcon: {
    //     width: 24,
    //     height: 24,
    // },
    scrollContent: {
        flexGrow: 1,
    }
});
