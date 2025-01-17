import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";

const FileUpload = forwardRef(({ onFileUploadSuccess, message }, ref) => {
  const [cameraActive, setIsCameraActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const uploadIntervals = useRef({});

  useImperativeHandle(ref, () => ({
    clearFiles: () => {
      setUploadedFiles([]);
    },
  }));

  const updateFileProgress = (fileName, progress) => {
    setUploadedFiles((prev) =>
      prev.map((file) =>
        file.name === fileName ? { ...file, progress } : file
      )
    );
  };

  const updateFileStatus = (fileName, status) => {
    setUploadedFiles((prev) =>
      prev.map((file) => (file.name === fileName ? { ...file, status } : file))
    );
  };

  const removeFile = (fileName) => {
    setUploadedFiles((prev) => prev.filter((file) => file.name !== fileName));
  };

  const getAllFileIds = () => {
    return uploadedFiles.map((file) => file.name);
  };

  const handleImageSelected = (imageUris) => {
    const files = (Array.isArray(imageUris) ? imageUris : [imageUris]).map(
      (imageUri) => ({
        uri: imageUri,
        name: `image-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}.jpg`,
        progress: 0,
        status: "uploading",
      })
    );

    // Add files to local state
    setUploadedFiles((prev) => [...prev, ...files]);

    files.forEach((newFile) => {
      let currentProgress = 0;

      const interval = setInterval(() => {
        currentProgress += 10;
        updateFileProgress(newFile.name, currentProgress);

        if (currentProgress >= 60) {
          clearInterval(interval);
        }
      }, 500);

      uploadIntervals.current[newFile.name] = interval;

      // Simulate upload - replace with actual upload logic
      setTimeout(() => {
        clearInterval(uploadIntervals.current[newFile.name]);
        delete uploadIntervals.current[newFile.name];
        updateFileProgress(newFile.name, 100);
        updateFileStatus(newFile.name, "success");
        onFileUploadSuccess(getAllFileIds());
      }, 3000);
    });
  };

  const handleFileUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        base64: false,
        allowsMultipleSelection: true, // Ensure your version supports this
      });

      // Check if the user canceled the picker
      if (!result.canceled && result.assets?.length > 0) {
        // Extract all selected URIs
        const imageUris = result.assets.map((asset) => asset.uri);
        handleImageSelected(imageUris); // Pass an array of URIs
      } else if (result.canceled) {
        console.log("Image selection was canceled.");
      } else {
        alert("No images selected.");
      }
    } catch (error) {
      console.error("Error selecting files:", error);
      alert("Failed to select files. Please try again.");
    }
  };

  const handleCameraUpload = async () => {
    if (Platform.OS === "web") {
      setIsCameraActive(true);
      openWebCamera();
    } else {
      try {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          alert("Camera permission is required to use this feature.");
          return;
        }

        let result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
          base64: false,
          cameraType: ImagePicker.CameraType.Back,
        });

        if (!result.canceled) {
          handleImageSelected(result.assets[0].uri);
        }
      } catch (error) {
        console.error("Error capturing image:", error);
        alert("Failed to capture image. Please try again.");
      }
    }
  };

  const handleRemoveFile = (fileName) => {
    if (uploadIntervals.current[fileName]) {
      clearInterval(uploadIntervals.current[fileName]);
      delete uploadIntervals.current[fileName];
    }

    removeFile(fileName);
    onFileUploadSuccess(getAllFileIds());
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
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

  const captureImage = () => {
    if (Platform.OS === "web" && videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        const imageUrl = URL.createObjectURL(blob);
        handleImageSelected(imageUrl);
        closeCamera();
      }, "image/jpeg");
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      Object.values(uploadIntervals.current).forEach(clearInterval);
    };
  }, [stream]);

  return (
    <View style={styles.container}>
      <View style={styles.uploadContainer}>
        <Text style={styles.uploadText}>
          {message
            ? message
            : "Upload your proof of work in .png or .jpeg format"}
        </Text>

        {!cameraActive && (
          <>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleFileUpload}
            >
              <Text style={styles.buttonText}>Browse files</Text>
            </TouchableOpacity>

            <Text style={styles.orText}>OR</Text>
          </>
        )}

        {cameraActive ? (
          <View style={styles.cameraContainer}>
            <video ref={videoRef} style={styles.videoPreview} autoPlay muted />
            <TouchableOpacity
              style={styles.captureButton}
              onPress={captureImage}
            >
              <Text style={styles.buttonText}>Capture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={closeCamera}>
              <Text style={styles.buttonText}>Close Camera</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleCameraUpload}
          >
            <Text style={styles.buttonText}>Use Camera</Text>
          </TouchableOpacity>
        )}
        {uploadedFiles.map((file, index) => (
          <View key={`${file.name}-${index}`} style={styles.fileRow}>
            <FontAwesome name="file" size={24} color="#6B7280" />
            <View style={styles.progressBarContainer}>
              <View style={styles.docNameContainer}>
                <Text style={styles.fileName}>{file?.name}</Text>
                {file.status === "success" ? (
                  <FontAwesome name="check-circle" size={15} color="#A3D65C" />
                ) : file.status === "error" ? (
                  <FontAwesome
                    name="exclamation-circle"
                    size={15}
                    color="#FC5275"
                  />
                ) : (
                  <Text style={{ color: "#838383", fontSize: 10 }}>
                    {`${
                      typeof file.progress === "number"
                        ? Math.round(file.progress)
                        : 0
                    }%`}
                  </Text>
                )}
              </View>
              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${
                        typeof file.progress === "number"
                          ? Math.round(file.progress)
                          : 0
                      }%`,
                      backgroundColor:
                        file.status === "success"
                          ? "#A3D65C"
                          : file.status === "error"
                          ? "#FC5275"
                          : "#FFD439",
                    },
                  ]}
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={() => handleRemoveFile(file.name)}
              disabled={file.status === "uploading"}
            >
              <FontAwesome
                style={{ marginTop: 15 }}
                name="trash"
                size={15}
                color={file.status === "uploading" ? "#CCCCCC" : "#FC5275"}
              />
            </TouchableOpacity>
          </View>
        ))}

        {/* {uploadedFiles.map((file, index) => (
          <View key={index} style={styles.thumbnailContainer}>
            <Image source={{ uri: file.uri }} style={styles.thumbnail} />
            <TouchableOpacity onPress={() => handleRemoveFile(file.name)}>
              <FontAwesome name="trash" size={20} color="#FC5275" />
            </TouchableOpacity>
          </View>
        ))}

        {uploading && (
          <ActivityIndicator size="large" color="#3B82F6" style={styles.loader} />
        )} */}
      </View>
    </View>
  );
});

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
    alignItems: "center",
  },
  videoPreview: {
    width: "100%",
    height: "auto",
    borderRadius: 10,
  },
  captureButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
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
  thumbnailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  loader: {
    marginTop: 20,
  },
});

export default FileUpload;
