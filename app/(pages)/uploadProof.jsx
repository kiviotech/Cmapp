import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import fonts from "../../constants/fonts";
import { useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import apiClient from "../../src/api/apiClient";
import { icons } from "../../constants";
import submissionEndpoints from "../../src/api/endpoints/submissionEndpoints";
import UploadedFileHIstory from "../../components/UploadedFileHIstory";
import { getTaskById } from "../../src/api/repositories/taskRepository";
import BottomNavigation from "./contractor/BottomNavigation ";
import FileUpload from "../../components/FileUploading/FileUpload";
import { fetchTaskById } from "../../src/services/taskService";
import { useNavigation } from "expo-router";
import colors from "../../constants/colors";
import useFileUploadStore from "../../src/stores/fileUploadStore";
import { Camera, CameraType } from 'expo-camera';

const UploadProof = ({}) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [cameraActive, setIsCameraActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [taskStatus, setTaskStatus] = useState("Yet to Upload");
  const [uploadedHistory, setUploadedHistory] = useState([]);
  const [rejectionComment, setRejectionComment] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false); // State for showing toast
  const [toastMessage, setToastMessage] = useState("");
  const [errors, setErrors] = useState("");
  const videoRef = useRef(null);
  const uploadIntervals = useRef({});
  const [uploadedFileIds, setUploadedFileIds] = useState([]);
  const [filesSelected, setFilesSelected] = React.useState(false);
  const [comment, setComment] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route?.params;
  const fileUploadRef = useRef(null);
  const clearFiles = useFileUploadStore((state) => state.clearFiles);
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(CameraType.back); // Default to back camera

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const taskData = await fetchTaskById(id);
        const submissions = taskData?.data?.attributes?.submissions?.data;

        if (submissions.length > 0) {
          const latestSubmission = submissions[submissions.length - 1];
          const status = latestSubmission?.attributes?.status;
          const taskName =
            taskData?.data?.attributes?.standard_task?.data?.attributes?.Name;
          setTaskStatus(status === "ongoing" ? status : "pending");
          if (status === "rejected") {
            setRejectionComment(latestSubmission?.attributes?.rejectionComment);
          }
          setUploadedHistory(taskData?.data);
        } else {
          setTaskStatus("Yet to Upload");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, [id]);

  // Request camera permissions when component mounts
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const uploadFiles = async (files) => {
    try {
      const formData = new FormData();
      for (const file of files) {
        const base64File = await toBase64(file);
        formData.append("files", base64File);
      }
      formData.append("refId", 4);
      formData.append("ref", "api::submission.submission");
      formData.append("field", "proofOfWork");

      const response = await apiClient.post("/upload", formData);
      const data = response.data;

      if (response.status === 200) {
        const fileIds = data.map((file) => file.id);
        return fileIds;
      } else {
        console.error("Error uploading files:", data);
        return [];
      }
    } catch (error) {
      console.error("Upload failed:", error);
      return [];
    }
  };

  const filesToUpload = [
    new File(["file1"], "Screenshot_1.png", { type: "image/png" }),
    new File(["file2"], "Screenshot_2.png", { type: "image/png" }),
  ];

  const createSubmission = async (fileIds, taskId) => {
    try {
      const response = await apiClient.post("/submissions", {
        data: {
          comment: comment,
          status: "pending",
          task: taskId,
          notification_status: "unread",
          proofOfWork: fileIds && fileIds.length > 0 ? fileIds : [],
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error creating submission:", error);
      throw error;
    }
  };

  const handleCommentChange = (text) => {
    setComment(text);
    const hasAlphabet = /[a-zA-Z]/.test(text);

    if (uploadedFileIds.length === 0 && text.length === 0) {
      setErrors("Images and comments are required");
    } else if (uploadedFileIds.length === 0) {
      setErrors("Images are required");
    } else if (text.length === 0) {
      setErrors("Comment is required");
    } else if (!hasAlphabet) {
      setErrors("Comment must contain at least one letter");
    } else {
      setErrors("");
    }
  };

  const validateSubmission = () => {
    const hasAlphabet = /[a-zA-Z]/.test(comment);
    let errorMessage = "";

    if (uploadedFileIds.length === 0 && !comment) {
      errorMessage = "Images and comment are required";
    } else if (uploadedFileIds.length === 0) {
      errorMessage = "Images are required";
    } else if (!comment) {
      errorMessage = "Comment is required";
    } else if (!hasAlphabet) {
      errorMessage = "Comment must contain at least one letter";
    }

    return errorMessage;
  };

  const handleSubmit = async () => {
    try {
      // Validate comment first
      if (!comment.trim()) {
        setErrors("Comment is required");
        return;
      }

      const hasAlphabet = /[a-zA-Z]/.test(comment);
      if (!hasAlphabet) {
        setErrors("Comment must contain at least one letter");
        return;
      }

      // Instead of trying to call handleSubmit on the ref, use the uploadedFileIds
      if (!uploadedFileIds || uploadedFileIds.length === 0) {
        setErrors("Please upload at least one file");
        return;
      }

      const submission = await createSubmission(uploadedFileIds, id);

      // Clear form
      setComment("");
      if (fileUploadRef.current) {
        fileUploadRef.current.clearFiles();
      }
      setErrors("");
      setUploadedFileIds([]); // Clear the uploaded file IDs

      // Show success message
      setToastMessage("Submission successful!");
      setToastVisible(true);

      // Navigate after delay
      setTimeout(() => {
        setToastVisible(false);
        navigation.navigate("(pages)/taskDetails", {
          taskData: { id },
          refresh: true,
        });
      }, 3000);
    } catch (error) {
      console.error("Error during submission:", error);
      setErrors("Error during submission. Please try again.");
    }
  };

  const startFileUpload = (file) => {
    if (!uploadedFiles.find((f) => f.name === file.name)) {
      setUploadedFiles((prevFiles) => [
        ...prevFiles,
        { ...file, status: "uploading", progress: 0 },
      ]);
    }

    setUploading(true);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;

      setUploadedFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.name === file.name
            ? {
                ...f,
                progress,
                status: progress < 100 ? "uploading" : "success",
              }
            : f
        )
      );

      if (progress >= 100) {
        clearInterval(interval);
        setUploading(false);

        setUploadedFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.name === file.name
              ? { ...f, status: "success", progress: 100 }
              : f
          )
        );

        uploadFileToAPI(file);
      }
    }, 500);

    uploadIntervals.current[file.name] = interval;
  };

  const handleCameraUpload = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Camera permission is required to use this feature.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newFile = {
        uri: result.uri,
        name: result.uri.split("/").pop(),
        progress: 0,
        status: "uploading",
      };
      setUploadedFiles([...uploadedFiles, newFile]);
      setUploading(true);

      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadedFiles((prevFiles) =>
          prevFiles?.map((file) =>
            file.name === newFile.name ? { ...file, progress } : file
          )
        );

        if (progress >= 100) {
          clearInterval(interval);
          setUploadedFiles((prevFiles) =>
            prevFiles?.map((file) =>
              file.name === newFile.name
                ? { ...file, status: "success", progress: 100 }
                : file
            )
          );
          setUploading(false);

          uploadFileToAPI(newFile);
        }
      }, 500);

      uploadIntervals.current[newFile.name] = interval;
    }
  };

  const uploadFileToAPI = async (file) => {
    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      name: file.name,
      type: "image/jpeg",
    });

    try {
      const response = await apiClient.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
      } else {
      }
    } catch (error) {
      console.error("Error uploading file:", error);
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

    setUploadedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  const handleFileUploadSuccess = (fileIds) => {
    setUploadedFileIds((prevIds) => [...prevIds, ...fileIds]);
  };

  const handleBackNavigation = () => {
    clearFiles();
    setUploadedFiles([]);
    setUploadedFileIds([]);
    if (fileUploadRef.current) {
      fileUploadRef.current.clearFiles();
    }
    navigation.navigate("(pages)/taskDetails", {
      taskData: { id },
      refresh: true,
    });
  };

  useEffect(() => {
    return () => {
      clearFiles();
      setUploadedFiles([]);
      setUploadedFileIds([]);
      if (fileUploadRef.current) {
        fileUploadRef.current.clearFiles();
      }
    };
  }, []);

  // Function to handle taking a picture
  const takePicture = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync();
        // Create a file object from the photo
        const photoFile = {
          uri: photo.uri,
          name: `photo_${Date.now()}.jpg`,
          type: 'image/jpeg',
        };
        
        // Add the photo to uploaded files
        setUploadedFiles((prevFiles) => [...prevFiles, {
          ...photoFile,
          status: 'uploading',
          progress: 0
        }]);

        // Start the upload process
        startFileUpload(photoFile);
        
        // Close camera after taking picture
        setIsCameraActive(false);
      } catch (error) {
        console.error('Error taking picture:', error);
        alert('Failed to take picture');
      }
    }
  };

  // Camera component
  const renderCamera = () => {
    if (hasPermission === null) {
      return <View />;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={isCameraActive}
        onRequestClose={() => setIsCameraActive(false)}
      >
        <View style={styles.cameraContainer}>
          <Camera
            ref={(ref) => setCameraRef(ref)}
            type={type}
            style={styles.camera}
          >
            <View style={styles.cameraButtonContainer}>
              <TouchableOpacity 
                style={styles.flipButton}
                onPress={() => {
                  setType(type === CameraType.back ? CameraType.front : CameraType.back);
                }}
              >
                <Text style={styles.flipText}>Flip</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.captureButton}
                onPress={takePicture}
              >
                <Text style={styles.captureText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setIsCameraActive(false)}
              >
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handleBackNavigation}>
            <Image source={icons.backarrow}></Image>
          </TouchableOpacity>
          <Text style={styles.detailsText}>Upload your proof of work</Text>
        </View>
      </View>

      <View>
        <Text>
          {errors ? <Text style={styles.errorText}>{errors}</Text> : null}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainer}>
          <View style={styles.uploadContainer}>
            <FileUpload
              ref={fileUploadRef}
              onFileUploadSuccess={(fileIds) => setUploadedFileIds(fileIds)}
              message="Upload your proof of work"
              comment={comment}
              setErrors={setErrors}
              id={id}
            />

            {uploadedFiles
              .filter((file) => file.name && file.status)
              .map((file, index) => (
                <View key={index} style={styles.fileRow}>
                  <FontAwesome name="file" size={24} color="#6B7280" />
                  <View style={styles.progressBarContainer}>
                    <View style={styles.docNameContainer}>
                      <Text style={styles.fileName}>{file.name}</Text>
                      {file.status === "success" ? (
                        <FontAwesome
                          name="check-circle"
                          size={15}
                          color="#A3D65C"
                        />
                      ) : file.status === "uploading" ? (
                        <Text style={{ color: "#838383", fontSize: 10 }}>
                          ${file.progress}%
                        </Text>
                      ) : null}
                    </View>
                    <View style={styles.progressBackground}>
                      <View
                        style={[
                          styles.progressBar,
                          {
                            width: `${file.progress}%`,
                            backgroundColor:
                              file.status === "success" ? "#A3D65C" : "#FFD439",
                          },
                        ]}
                      />
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => handleRemoveFile(file.name)}>
                    <FontAwesome
                      style={{ marginTop: 15 }}
                      name="trash"
                      size={15}
                      color="#FC5275"
                    />
                  </TouchableOpacity>
                </View>
              ))}

            <TextInput
              style={styles.commentInput}
              placeholder="Add your comment..."
              value={comment}
              onChangeText={handleCommentChange}
              multiline={true}
              numberOfLines={5}
            />

            <TouchableOpacity
              style={[styles.uploadButton, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            {toastVisible && (
              <View style={styles.toast}>
                <Text style={styles.toastText}>{toastMessage}</Text>
              </View>
            )}

            {/* Modal */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalBackground}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalText}>{toastMessage}</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </ScrollView>
      {renderCamera()}
      {/* <BottomNavigation /> */}
    </SafeAreaView>
  );
};

export default UploadProof;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 15,
    paddingTop: 20,
    marginBottom: 50,
  },
  header: {
    paddingTop: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    flex: 1,
    paddingHorizontal: 25,
    alignItems: "center",
  },
  detailsText: {
    fontSize: 24,
    paddingLeft: 15,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 20,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: "100%",
    minHeight: 100, // Adjust to make the text input larger
    verticalAlign: "top", // Align text to the top in multiline mode
  },
  uploadContainer: {
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#8D8D8D",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
    height: "auto",
    paddingBottom: 60,
  },
  uploadText: {
    textAlign: "center",
    marginBottom: 16,
    marginTop: 20,
    color: "#4B5563",
  },
  uploadButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 16,
    height: 39,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
  },
  orText: {
    color: "#6B7280",
    marginBottom: 16,
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  progressBarContainer: {
    flex: 1,
    marginLeft: 10,
  },
  docNameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fileName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
    color: "#4B5563",
  },
  progressBackground: {
    width: "100%",
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
    marginBottom: 10,
    position: "relative",
  },
  uploadStatusButton: {
    position: "absolute",
    backgroundColor: "#E5E7EB",
    width: 113,
    alignItems: "center",
    left: 0,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 16,
    height: 39,
    marginTop: 5,
  },
  submitButton: {
    position: "absolute",
    bottom: 0,
    right: 10,
  },
  toast: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  toastText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: 250,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  errorContainer: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  errorText: {
    color: "#FC5275",
    fontSize: 14,
    textAlign: "center",
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraButtonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 20,
  },
  flipButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  captureButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  flipText: {
    fontSize: 18,
    color: 'white',
  },
  captureText: {
    fontSize: 18,
    color: 'black',
  },
  closeText: {
    fontSize: 18,
    color: 'white',
  },
  uploadOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  cameraOption: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
});
