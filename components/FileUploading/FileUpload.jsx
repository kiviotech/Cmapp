import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";

const FileUpload = ({
  uploadedFiles,
  setUploadedFiles,
  onFileUploadSuccess,
}) => {
  const [cameraActive, setIsCameraActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const uploadIntervals = useRef({});

  const handleFileUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [4, 3],
      // quality: 1,
      base64: false,
    });

    if (!result.canceled) {
      const newFile = {
        uri: result.assets[0].uri,
        name: result.assets[0].fileName,
        progress: 0,
        status: "uploading",
      };
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
              file.name === newFile.name
                ? { ...file, status: "success", progress: 100 }
                : file
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

  const handleCameraUpload = async () => {
    if (Platform.OS === "web") {
      setIsCameraActive(true);
      openWebCamera();
    } else {
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
                file.name === newFile.name
                  ? { ...file, status: "success", progress: 100 }
                  : file
              )
            );
            setUploading(false);

            // Send the file to the API after upload is complete
            uploadFileToAPI(newFile);
          }
        }, 500);

        uploadIntervals.current[newFile.name] = interval;
      }
    }
  };

  const uploadFileToAPI = async (file) => {
    try {
      const formData = new FormData();
      const imgblob = await (await fetch(file.uri)).blob();
      formData.append("files", imgblob, file.name);

      const response = await fetch("http://192.168.0.253:1337/api/upload", {
        method: "POST",
        headers: {
          Authorization:
            "Bearer 774c8271487ea9952dfacae2ed7b92fe9286acbe3e9a59cc38580ea335cefb62ef20ace353793ed34130a988701498b8aa096e02a1afdda6621bffe733bd17fd83e5170a03b3ee068a8c132b70d0dce216cb198b65b5d59058cf08335338e34dd7b31379bed78f4170108dfd68e83cf37be35f6df30d3346f7985f651a7fedb3",
          // 'Content-Type': 'form-data',
        },
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        const fileIds = responseData.map((item) => item.id);
        onFileUploadSuccess(fileIds); // Passing only file IDs to the parent component
      } else {
        console.log("Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const closeCamera = () => {
    setIsCameraActive(false);
  };

  const openWebCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      })
      .catch((error) => {
        console.error("Error accessing the camera: ", error);
      });
  };

  const handleRemoveFile = (fileName) => {
    // Clear the interval if the file is uploading
    if (uploadIntervals.current[fileName]) {
      clearInterval(uploadIntervals.current[fileName]);
      delete uploadIntervals.current[fileName];
    }

    // Remove the file from the list
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      // Clear all intervals on component unmount
      Object.values(uploadIntervals.current).forEach(clearInterval);
    };
  }, [stream]);

  return (
    <View style={styles.container}>
      <View style={styles.uploadContainer}>
        <Text style={styles.uploadText}>
          Upload your proof of work in .png or .jpeg format
        </Text>

        {/* Browse Files Button */}
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleFileUpload}
        >
          <Text style={styles.buttonText}>Browse files</Text>
        </TouchableOpacity>

        {/* OR Separator */}
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
          >
            <Text style={styles.buttonText}>Use Camera</Text>
          </TouchableOpacity>
        )}

        {/* Camera Preview */}
        {Platform.OS === "web" && cameraActive && (
          <View style={styles.cameraContainer}>
            <video ref={videoRef} style={styles.videoPreview} autoPlay muted />
          </View>
        )}

        {/* Uploaded Files List */}
        {uploadedFiles.map((file, index) => (
          <View key={index} style={styles.fileRow}>
            <FontAwesome name="file" size={24} color="#6B7280" />
            <View style={styles.progressBarContainer}>
              <View style={styles.docNameContainer}>
                <Text style={styles.fileName}>{file?.name}</Text>
                {file.status === "success" ? (
                  <FontAwesome name="check-circle" size={15} color="#A3D65C" />
                ) : file.status === "uploading" ? (
                  <Text
                    style={{ color: "#838383", fontSize: 10 }}
                  >{`${file.progress}%`}</Text>
                ) : null}
              </View>
              {/* Always render progress bar */}
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    backgroundColor: "#F1F1F1",
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
    paddingBottom: 40,
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
  cameraContainer: {
    width: "100%",
    height: "auto",
    marginTop: 16,
  },
  videoPreview: {
    width: "100%",
    height: "auto",
    borderRadius: 10,
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
    width: "100%",
    marginTop: 20,
  },
  docNameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  fileName: {
    color: "#4B5563",
  },
  progressBarContainer: {
    flex: 1,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBackground: {
    height: 8,
    backgroundColor: "#DADADA",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
});

export default FileUpload;
