import { View, Text, Alert, StyleSheet, ScrollView } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown'; // Import the Dropdown component
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import LoginField from '../../components/LoginField';
import { useRouter } from 'expo-router';
import { NativeWindStyleSheet } from "nativewind";
import FileUpload from '../../components/FileUploading/FileUpload';
import fonts from '../../constants/fonts';
import { signup } from '../../src/utils/auth';  // Import the signup function
import colors from '../../constants/colors';

NativeWindStyleSheet.setOutput({
    default: "native",
});

const SignUp = () => {
    const [selectedProject, setSelectedProject] = useState(''); // State for dropdown selection
    const [projectsDetail, setProjectsDetail] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isDropdownFocused, setIsDropdownFocused] = useState(false); // Add state for dropdown focus
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        socialSecurity: '',
        contractorLicense: null
    });

    const [errors, setErrors] = useState({});
    const router = useRouter();

    const cardDataArray = [
        {
            projectId: 1,
            projectName: "Survey and Marking",
            projectDescription: "Ensure survey accuracy by cross-referencing multiple points. Verify site layout against survey plans.",
            deadline: Date.now(),
            taskStatus: "Task Completed",
            taskStatusColor: "#A3D65C",
            cardColor: "#EEF7E0",
            status: "",
        },
        {
            projectId: 2,
            projectName: "Verification & Inspection",
            projectDescription: "Regular site walkthroughs to ensure compliance with safety regulations and quality standards.",
            deadline: Date.now(),
            taskStatus: "Rejected",
            taskStatusColor: "#FC5275",
            cardColor: "#FED5DD",
            status: "rejected",
        },
        {
            projectId: 2,
            projectName: "Verification & Inspection",
            projectDescription: "Regular site walkthroughs to ensure compliance with safety regulations and quality standards.",
            deadline: Date.now(),
            taskStatus: "Rejected",
            taskStatusColor: "#FC5275",
            cardColor: "#FED5DD",
            status: "rejected",
        },
        {
            projectId: 2,
            projectName: "Verification & Inspection",
            projectDescription: "Regular site walkthroughs to ensure compliance with safety regulations and quality standards.",
            deadline: Date.now(),
            taskStatus: "Rejected",
            taskStatusColor: "#FC5275",
            cardColor: "#FED5DD",
            status: "rejected",
        },
        {
            projectId: 2,
            projectName: "Verification & Inspection",
            projectDescription: "Regular site walkthroughs to ensure compliance with safety regulations and quality standards.",
            deadline: Date.now(),
            taskStatus: "Rejected",
            taskStatusColor: "#FC5275",
            cardColor: "#FED5DD",
            status: "rejected",
        },
    ];

    useEffect(() => {
        setProjectsDetail(cardDataArray);
    }, []);

    const handleChangeText = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const validate = () => {
        const newErrors = {};

        if (!form.name) newErrors.name = 'Full name is required';
        if (!form.email) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Enter a valid email address';
        if (!form.password) newErrors.password = 'Password is required';
        else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters long';
        if (!form.socialSecurity) newErrors.socialSecurity = 'Social Security Number is required';
        else if (form.socialSecurity.length < 6) newErrors.socialSecurity = 'Enter a valid 6-digit Social Security Number';
        if (!uploadedFiles && !form.contractorLicense) newErrors.contractorLicense = 'File is required';

        return newErrors;
    };

    const submit = async () => {
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const { name, email, password, socialSecurity } = form;
            const contractorLicense = uploadedFiles || form.contractorLicense;
            const res = await signup(name, email, password, socialSecurity, contractorLicense);
            if (res) {
                router.replace('/login');
            }
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || error.message);
        }
    };

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

                    {/* Project Selection Dropdown with search */}
                    <View style={styles.projectSelectionContainer}>
                        <Text className="font-inter400" style={styles.labelText}>Project Selection</Text>
                        <View style={styles.dropdownContainer}>
                            <Dropdown
                                data={projectsDetail.map(project => ({
                                    label: project.projectName,
                                    value: project.projectId,
                                }))}
                                labelField="label"
                                valueField="value"
                                placeholder={!isDropdownFocused ? 'Select project' : '...'}
                                search
                                searchPlaceholder="Search your project"
                                value={selectedProject}

                                onFocus={() => setIsDropdownFocused(true)}
                                onBlur={() => setIsDropdownFocused(false)}
                                onChange={item => {
                                    setSelectedProject(item.value);
                                    setIsDropdownFocused(false);
                                }}
                                style={styles.dropdown}
                                containerStyle={styles.dropdownContainerStyle} // Apply style for dropdown list container
                                searchStyle={styles.searchBox} // Apply style for search box
                            />
                        </View>
                        {errors.project && <Text style={styles.errorText}>{errors.project}</Text>}
                    </View>

                    <View>
                        <FileUpload uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} />
                        {errors.contractorLicense && <Text style={styles.errorText}>{errors.contractorLicense}</Text>}
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
        marginBottom: 5,
        fontFamily: fonts.inter400,
        color: colors.loginSignUpLabelColor,
        fontSize: 14
    },
    loginField: {
        marginBottom: 10,
    },

    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,

    },
    dropdownContainerStyle: {
        maxHeight: 200, // Maximum height for the dropdown list
        overflow: 'scroll',
        marginTop: 10,
        borderRadius: 10,
        borderWidth: 1, // Set the border width
        borderColor: '#B3B3B3', // Set the border color
        backgroundColor: '#FFF', // Set the background color
        shadowColor: 'rgba(211, 209, 216, 0.25)', // Set the shadow color
        shadowOffset: { width: 15, height: 15 }, // Offset for the shadow
        shadowOpacity: 1, // Set the shadow opacity
        shadowRadius: 30, // Set the shadow radius
        elevation: 5, // Needed for Android to apply shadow
    },
    searchBox: {
        borderRadius: 5, // Border radius for search box
        borderColor: 'transparent', // Make the border disappear while typing
        padding: 8,


    },
    errorText: {
        color: 'red',
        marginTop: 5,
        fontFamily: fonts.inter400,
    },
    buttonContainer: {
        marginTop: 20,
        alignItems: 'center',
    },

    SignUpContainer: {
        marginTop: 50,
        alignItems: 'center',
    },
    
});
