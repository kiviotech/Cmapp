import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import LoginField from '../../components/LoginField';
import { useRouter } from 'expo-router';
import { NativeWindStyleSheet } from "nativewind";
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

import fonts from '../../constants/fonts';
import colors from '../../constants/colors';
import { useToast } from '../ToastContext';
import Toast from '../Toast';
import { getProjects } from '../../src/api/repositories/projectRepository';

NativeWindStyleSheet.setOutput({
    default: "native",
});

const SignUp = () => {
    const [selectedProject, setSelectedProject] = useState('');
    const [projectsDetail, setProjectsDetail] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isDropdownFocused, setIsDropdownFocused] = useState(false);
    const { toast, showToast } = useToast();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        socialSecurity: '',
    });

    const [errors, setErrors] = useState({});
    const router = useRouter();

    const handleChangeText = (field, value) => {
        setForm({ ...form, [field]: value });
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
        }
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
        if (!uploadedFiles.length) newErrors.contractorLicense = 'Please upload contractor license documents';
        if (!selectedProject) newErrors.project = 'Please select a project';

        return newErrors;
    };

    const handleDocumentPick = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                multiple: true,
                copyToCacheDirectory: false
            });

            if (result.canceled === false && result.assets) {
                setUploadedFiles(result.assets);
                if (errors.contractorLicense) {
                    setErrors({ ...errors, contractorLicense: '' });
                }
            }
        } catch (err) {
            console.error('DocumentPicker Error:', err);
            showToast('Error selecting documents', 'error');
        }
    };

    const createFormData = (files) => {
        const formData = new FormData();

        files.forEach((file) => {
            // For web, we can directly append the File object
            if (Platform.OS === 'web') {
                const fileObj = {
                    uri: file.uri,
                    name: file.name,
                    type: file.mimeType,
                };
                formData.append('files', fileObj);
            } else {
                // For native platforms
                formData.append('files', {
                    uri: file.uri,
                    name: file.name,
                    type: file.mimeType
                });
            }
        });

        return formData;
    };

    const uploadFiles = async () => {
        if (!uploadedFiles.length) {
            throw new Error('Please select files to upload');
        }

        try {
            const formData = createFormData(uploadedFiles);

            // First, upload the files
            const uploadResponse = await axios.post('http://localhost:1337/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!uploadResponse.data) {
                throw new Error('Failed to upload files');
            }

            // Return the array of file IDs
            return uploadResponse.data.map(file => file.id);
        } catch (error) {
            console.error('Upload error:', error.response?.data || error);
            throw new Error(
                error.response?.data?.error?.message || 'Failed to upload files. Please try again.'
            );
        }
    };

    const registerUser = async (fileIds) => {
        const registrationData = {
            data: {
                fullname: form.name,
                socialSecurityNumber: form.socialSecurity,
                email: form.email,
                password: form.password,
                project: selectedProject,
                label: "pending",
                locale: "en",
                documents: fileIds
            }
        };

        try {
            const response = await axios.post('http://localhost:1337/api/registrations', registrationData);
            return response.data;
        } catch (error) {
            console.error('Registration error:', error.response?.data || error);
            throw new Error(
                error.response?.data?.error?.message || 'Registration failed. Please try again.'
            );
        }
    };

    const submit = async () => {
        try {
            const newErrors = validate();
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }

            showToast('Uploading files...', 'info');
            const fileIds = await uploadFiles();

            showToast('Registering user...', 'info');
            await registerUser(fileIds);

            showToast('Registration successful!', 'success');
            router.replace('/login');
        } catch (error) {
            console.error('Submit error:', error);
            showToast(error.message, 'error');
        }
    };

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const projectData = await getProjects();
                setProjectsDetail(projectData.data.data);
            } catch (error) {
                console.error("Error fetching projects:", error);
                showToast("Failed to load projects", "error");
            }
        };

        fetchProjects();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Toast visible={toast.visible} message={toast.message} type={toast.type} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
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
                            placeholder="Your email"
                            value={form.email}
                            handleChangeText={(e) => handleChangeText('email', e)}
                            keyboardType='email-address'
                            className="mb-4"
                        />
                        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                        <View style={styles.passwordContainer}>
                            <Text className="font-inter400" style={styles.labelText}>Password</Text>
                            <LoginField
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

                    <View style={styles.projectSelectionContainer}>
                        <Text className="font-inter400" style={styles.labelText}>Project Selection</Text>
                        <View style={styles.dropdownContainer}>
                            <Dropdown
                                data={projectsDetail.map(project => ({
                                    label: project?.name,
                                    value: project.id,
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
                                containerStyle={styles.dropdownContainerStyle}
                                searchStyle={styles.searchBox}
                            />
                        </View>
                        {errors.project && <Text style={styles.errorText}>{errors.project}</Text>}
                    </View>

                    <View style={styles.uploadSection}>
                        <Text className="font-inter400" style={styles.labelText}>
                            Contractor License Documents
                        </Text>
                        <TouchableOpacity
                            style={styles.uploadButton}
                            onPress={handleDocumentPick}
                        >
                            <Text style={styles.uploadButtonText}>
                                Select Documents
                            </Text>
                        </TouchableOpacity>
                        {uploadedFiles.length > 0 && (
                            <View style={styles.fileList}>
                                <Text style={styles.fileCountText}>
                                    {uploadedFiles.length} file(s) selected
                                </Text>
                                {uploadedFiles.map((file, index) => (
                                    <Text key={index} style={styles.fileName}>
                                        {file.name}
                                    </Text>
                                ))}
                            </View>
                        )}
                        {errors.contractorLicense && (
                            <Text style={styles.errorText}>{errors.contractorLicense}</Text>
                        )}
                    </View>

                    <View style={styles.buttonContainer}>
                        <CustomButton
                            buttonStyle={{ backgroundColor: '#577CFF', fontSize: 13, width: 140, letterSpacing: 1 }}
                            textStyle={{ fontFamily: 'font-inter400', color: '#FFFFFF' }}
                            text='SIGNUP'
                            handlePress={submit}
                        />
                    </View>

                    <View style={styles.signUpContainer}>
                        <Text className="font-pmedium text-sm text-[#9C9C9C] font-inter400">
                            Already have an account? <Text className="text-[#577CFF]" onPress={() => router.replace('/login')}>Login</Text>
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        padding: 24,
    },
    header: {
        marginBottom: 30,
    },
    inputContainer: {
        marginBottom: 20,
    },
    passwordContainer: {
        marginTop: 20,
    },
    projectSelectionContainer: {
        marginVertical: 20,
    },
    dropdownContainer: {
        marginTop: 5,
    },
    buttonContainer: {
        marginTop: 30,
        alignItems: 'center',
    },
    signUpContainer: {
        marginTop: 30,
        alignItems: 'center',
    },
    labelText: {
        marginBottom: 5,
        fontFamily: fonts.inter400,
        color: colors.loginSignUpLabelColor,
        fontSize: 14,
    },
    errorText: {
        color: '#FF4444',
        marginTop: 5,
        fontFamily: fonts.inter400,
        fontSize: 12,
    },
    dropdown: {
        height: 50,
        borderColor: '#DDDDDD',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#FFFFFF',
    },
    dropdownContainerStyle: {
        maxHeight: 200,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DDDDDD',
        backgroundColor: '#FFFFFF',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 4,
    },
    searchBox: {
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
        padding: 10,
        fontSize: 14,
        fontFamily: fonts.inter400,
    },
    uploadSection: {
        marginVertical: 20,
    },
    uploadButton: {
        backgroundColor: '#F5F5F5',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DDDDDD',
        alignItems: 'center',
    },
    uploadButtonText: {
        color: '#577CFF',
        fontFamily: fonts.inter400,
        fontSize: 14,
    },
    fileList: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#F8F8F8',
        borderRadius: 8,
    },
    fileCountText: {
        color: '#4CAF50',
        fontFamily: fonts.inter400,
        marginBottom: 8,
        fontSize: 14,
    },
    fileName: {
        color: '#666666',
        fontFamily: fonts.inter400,
        fontSize: 12,
        marginBottom: 4,
    },
});

export default SignUp;