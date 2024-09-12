import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Image,TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import  axios  from "axios";
import fonts from '../../constants/fonts';
import { useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import apiClient from '../../src/api/apiClient';
import { icons } from '../../constants';
import submissionEndpoints from '../../src/api/endpoints/submissionEndpoints';
import UploadedFileHIstory from '../../components/UploadedFileHIstory/UploadedFileHistory';
import { getTaskById } from '../../src/api/repositories/taskRepository'; // Import the function

const UploadProof = ({ }) => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [cameraActive, setIsCameraActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [taskStatus, setTaskStatus] = useState('Yet to Upload');
    const [uploadedHistory, setUploadedHistory] = useState([]);
    const [rejectionComment, setRejectionComment] = useState('');
    const videoRef = useRef(null);
    const uploadIntervals = useRef({});
    const [filesSelected, setFilesSelected] = React.useState(false);
    const [comment, setComment] = useState('');  // New state for the comment
    const route = useRoute();
    const { id } = route?.params;

         useEffect(() => {
            const fetchTaskDetails = async () => {
                try {
                    const taskData = await getTaskById(id); // Fetch the task details using the ID
                    const taskAttributes = taskData.data.data.attributes;
        
                    // Check if submissions exist
                    if (taskAttributes.submissions && taskAttributes.submissions.data.length > 0) {
                        // There are submissions, set the status to pending or based on the submission status
                        const submissionHistory = taskAttributes.submissions.data.map(submission => ({
                            id: submission.id,
                            status: submission.attributes.status,
                            comment: submission.attributes.comment,
                            createdAt: submission.attributes.createdAt,
                            updatedAt: submission.attributes.updatedAt,
                            files: submission.attributes.proofOfWork?.data?.map(file => ({
                                id: file.id,
                                fileName: file.attributes.name,
                                url: file.attributes.url // If URL is available
                            })) || [], // Default to empty array if no files
                        }));
                        setUploadedHistory(submissionHistory);
                        setTaskStatus('Pending Approval');
                    } else {
                        // No submissions, set the status to 'Yet to Upload'
                        setTaskStatus('Yet to Upload');
                    }
        
                    // Additional logic for rejection comments
                    if (taskAttributes.status === 'rejected') {
                        setTaskStatus('Rejected');
                        setRejectionComment(taskAttributes.rejection_comment);
                    }
                    
                } catch (error) {
                    console.error("Error fetching task details:", error);
                }
            };
        
            fetchTaskDetails();
        }, [id]);
    const handleFileUpload = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
          allowsMultipleSelection: true,
        });
      
        if (!result.canceled) {
          const newFiles = result.assets.map(asset => ({
            uri: asset.uri,
            name: asset.fileName || `image_${Date.now()}.jpg`,
            type: 'image/jpeg',
            progress: 0,
            status: 'pending',
          }));
          setUploadedFiles([...uploadedFiles, ...newFiles]);
          setFilesSelected(true);
          
          // Call uploadFiles immediately after selecting files
        } else {
          setFilesSelected(false);
        }
      };

      // Utility function to convert file to base64 string
const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]); // Extract the base64 string part
      reader.onerror = (error) => reject(error);
    });
  };
  
  const uploadFiles = async (files) => {
    try {
      // Prepare FormData for binary file upload
      const formData = new FormData();
  
      for (const file of files) {
        // Convert each file to base64 string
        const base64File = await toBase64(file);
        formData.append('files', base64File);  // Add binary string
      }
  
      // Add additional fields
      formData.append('refId', 4);  // Replace '4' with your dynamic reference ID
      formData.append('ref', 'api::submission.submission');  // Reference to the model
      formData.append('field', 'proofOfWork');  // Field in Strapi
  
      // Send the request
      const response = await fetch('http://localhost:1338/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer f2f7f391c3cde0eb722388c3a3477824b39c1d7858952cc2e728da6834ca98f29a82b172e31da04b21b6bf00fc20e5d7cb19995f4a0777ccb3130333d8bd663245832223bce82dd2d2ffcd21703af961f9594a854caa3ffe2010444e1731218c99c272558dadce2111fc09f6ded861f71c285d5edf161f11c1180619484b1023',
        //   'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Files uploaded successfully:', data);
        // Extract and return file IDs from the response
        const fileIds = data.map(file => file.id);
        return fileIds;
      } else {
        console.error('Error uploading files:', data);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };
  
  // Example usage: dynamically pass a list of files
  const filesToUpload = [
    new File(['file1'], 'Screenshot_1.png', { type: 'image/png' }),
    new File(['file2'], 'Screenshot_2.png', { type: 'image/png' }),
  ];
  
  //uploadFiles(filesToUpload);

  const createSubmission = async (fileIds, taskId) => {
    try {
      const response = await apiClient.post('/submissions', {
        data: {
          comment: comment,  // Pass the comment
          status: 'pending',
          task: taskId,  // Reference to the task
          proofOfWork: fileIds.length > 0 ? fileIds : null,  // Only pass if there are files
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error creating submission:', error);
      throw error;
    }
  };

      const handleSubmit = async () => {
        try {
          let fileIds = [];
          
          // Check if there are files to upload, otherwise skip upload
          if (false) {
            fileIds = await uploadFiles(uploadedFiles);
          }
          //startFileUpload
          // Create submission with or without fileIds
          const submission = await createSubmission(fileIds, id);
          console.log('Submission created successfully:', submission);
          
          // Clear form after successful submission
          setUploadedFiles([]);
          setComment('');  // Clear the comment
          
          // Optionally fetch task details to refresh the submission history
          fetchTaskDetails();
        } catch (error) {
          console.error('Error during submission:', error);
        }
      };


    const startFileUpload = (file) => {
        setUploading(true);

        // Simulate the file upload progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setUploadedFiles((prevFiles) =>
                prevFiles.map((f) => f.name === file.name ? { ...f, progress, status: 'uploading' } : f)
            );

            if (progress >= 100) {
                clearInterval(interval);
                setUploadedFiles((prevFiles) =>
                    prevFiles.map((f) =>
                        f.name === file.name ? { ...f, status: 'success', progress: 100 } : f
                    )
                );
                setUploading(false);

                // Send the file to the API after upload is complete
                uploadFileToAPI(file);
            }
        }, 500);

        uploadIntervals.current[file.name] = interval;
    };

    const handleCameraUpload = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Camera permission is required to use this feature.');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const newFile = { uri: result.uri, name: result.uri.split('/').pop(), progress: 0, status: 'uploading' };
            setUploadedFiles([...uploadedFiles, newFile]);
            setUploading(true);

            // Simulate the file upload progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                setUploadedFiles((prevFiles) =>
                    prevFiles.map((file) =>
                        file.name === newFile.name ? { ...file, progress } : file
                    )
                );

                if (progress >= 100) {
                    clearInterval(interval);
                    setUploadedFiles((prevFiles) =>
                        prevFiles.map((file) =>
                            file.name === newFile.name ? { ...file, status: 'success', progress: 100 } : file
                        )
                    );
                    setUploading(false);

                    // Send the file to the API after upload is complete
                    uploadFileToAPI(newFile);
                }
            }, 500);

            uploadIntervals.current[newFile.name] = interval;
        }
    };

    const uploadFileToAPI = async (file) => {
        const formData = new FormData();
        formData.append('file', {
            uri: file.uri,
            name: file.name,
            type: 'image/jpeg',
        });

        try {
            const response = await apiClient.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                console.log('File uploaded successfully:', response.data);
            } else {
                console.log('Failed to upload file');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const closeCamera = () => {
        setIsCameraActive(false);
    };

    useEffect(() => {
        return () => {
            if (uploadIntervals.current) {
                Object.values(uploadIntervals.current).forEach(clearInterval);
            }
        };
    }, []);

    const handleRemoveFile = (fileName) => {
        if (uploadIntervals.current[fileName]) {
            clearInterval(uploadIntervals.current[fileName]);
            delete uploadIntervals.current[fileName];
        }

        setUploadedFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    };

    return (
        <SafeAreaView style={{ flex: 1 }}> 
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}> 
                <View style={styles.mainContainer}>
                    <Text style={styles.instructions}>1. Upload your proof of work</Text>
                    <View style={styles.uploadContainer}>
  <Text style={styles.uploadText}>Upload your proof of work in .png or .jpeg format</Text>

  {/* Browse Files Button */}
  <TouchableOpacity
    style={styles.uploadButton}
    onPress={handleFileUpload}
    disabled={uploading}
  >
    <Text style={styles.buttonText}>Browse files</Text>
  </TouchableOpacity>

  <Text style={styles.orText}>OR</Text>

  {/* Use Camera Button */}
  {cameraActive ? (
    <TouchableOpacity style={styles.uploadButton} onPress={closeCamera}>
      <Text style={styles.buttonText}>Close Camera</Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      style={styles.uploadButton}
      onPress={handleCameraUpload}
      disabled={uploading}
    >
      <Text style={styles.buttonText}>Use Camera</Text>
    </TouchableOpacity>
  )}

  {/* Uploaded Files Display */}
  {uploadedFiles.map((file, index) => (
    <View key={index} style={styles.fileRow}>
      <FontAwesome name="file" size={24} color="#6B7280" />
      <View style={styles.progressBarContainer}>
        <View style={styles.docNameContainer}>
          <Text style={styles.fileName}>{file?.name}</Text>
          {file.status === 'success' ? (
            <FontAwesome name="check-circle" size={15} color="#A3D65C" />
          ) : file.status === 'uploading' ? (
            <Text style={{ color: '#838383', fontSize: 10 }}>{`${file.progress}%`}</Text>
          ) : null}
        </View>
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${file.progress}%`,
                backgroundColor: file.status === 'success' ? '#A3D65C' : '#FFD439',
              },
            ]}
          />
        </View>
      </View>
      <TouchableOpacity onPress={() => handleRemoveFile(file.name)}>
        <FontAwesome style={{ marginTop: 15 }} name="trash" size={15} color="#FC5275" />
      </TouchableOpacity>
    </View>
  ))}

  {/* Comment Box */}
  <TextInput
    style={styles.commentInput}
    placeholder="Add your comment..."
    value={comment}
    onChangeText={setComment}
    multiline={true}
    numberOfLines={5}  // This will make the text box bigger
  />

  {/* Submit Button */}
  <TouchableOpacity
    style={[styles.uploadButton, styles.submitButton]}
    onPress={handleSubmit}
    disabled={uploading || !comment}
  >
    <Text style={styles.buttonText}>Submit</Text>
  </TouchableOpacity>
</View>

                    <Text style={styles.instructions}>2. Supervisor’s Approval</Text>
                    <View style={styles.notificationApproval}>
                        <Image source={icons.uploadApproval} />
                        <Text style={{ color: '#FBBC55' }}>{taskStatus}</Text>
                    </View>

                    {taskStatus === 'Rejected' && (
                        <View style={styles.rejectionContainer}>
                            <Text style={styles.rejectionText}>Rejection Comment: {rejectionComment}</Text>
                        </View>
                    )}

                    {/* Uploaded history */}
                    <UploadedFileHIstory historyData={uploadedHistory} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default UploadProof;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 15,
        paddingTop: 20,
    },
    instructions: {
        fontSize: 18,
        fontFamily: fonts.WorkSans600,
        paddingBottom: 10,
    },
    commentInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        width: '100%',
        minHeight: 100,  // Adjust to make the text input larger
        textAlignVertical: 'top',  // Align text to the top in multiline mode
      },
    uploadContainer: {
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: '#8D8D8D',
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
        marginBottom: 16,
        height: 'auto',
        paddingBottom: 60,
    },
    uploadText: {
        textAlign: 'center',
        marginBottom: 16,
        marginTop: 20,
        color: '#4B5563',
    },
    uploadButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginBottom: 16,
        height: 39,
    },
    buttonText: {
        color: '#FFF',
        fontWeight: '600',
    },
    orText: {
        color: '#6B7280',
        marginBottom: 16,
    },
    fileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 16,
    },
    progressBarContainer: {
        flex: 1,
        marginLeft: 10,
    },
    docNameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    fileName: {
        flex: 1,
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 2,
        color: '#4B5563',
    },
    progressBackground: {
        width: '100%',
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E5E7EB',
    },
    progressBar: {
        height: '100%',
        borderRadius: 4,
        marginBottom: 10,
        position: 'relative',
    },
    uploadStatusButton: {
        position: 'absolute',
        backgroundColor: '#E5E7EB',
        width: 113,
        alignItems: 'center',
        left: 0,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginBottom: 16,
        height: 39,
        marginTop: 5
    },
    submitButton: {
        position: 'absolute',
        bottom: 0,
        right: 10
    },
    notificationApproval: {
        backgroundColor: 'rgba(251, 188, 85, 0.30)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 16,
        height: 50,
        marginTop: 5,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 10
    },
    rejectionContainer: {
        backgroundColor: '#FED5DD',
        padding: 10,
        borderRadius: 10,
        marginBottom: 16,
    },
    rejectionText: {
        color: '#FC5275',
        fontFamily: fonts.WorkSans500,
    },
});