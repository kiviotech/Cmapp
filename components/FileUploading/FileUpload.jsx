import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useCallback,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import apiClient from "../../src/api/apiClient";

const FileUpload = forwardRef(({ onFileUploadSuccess, message }, ref) => {
  const [cameraActive, setIsCameraActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileIds, setFileIds] = useState([]);
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const uploadIntervals = useRef({});
  const callbackRef = useRef(onFileUploadSuccess);

  // Update callback ref when prop changes
  useEffect(() => {
    callbackRef.current = onFileUploadSuccess;
  }, [onFileUploadSuccess]);

  useImperativeHandle(ref, () => ({
    clearFiles: () => {
      setUploadedFiles([]);
      setFileIds([]);
      setTimeout(() => {
        if (callbackRef.current) {
          callbackRef.current([]);
        }
      }, 0);
    },
  }));

  const addFiles = (files) => {
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const updateFileProgress = (fileName, progress) => {
    setUploadedFiles((prev) =>
      prev.map((file) =>
        file.name === fileName ? { ...file, progress } : file
      )
    );
  };

  const updateFileStatus = useCallback((fileName, status, fileId) => {
    if (status === "success" && fileId) {
      setFileIds((prevIds) => {
        const newIds = !prevIds.includes(fileId)
          ? [...prevIds, fileId]
          : prevIds;
        if (!prevIds.includes(fileId)) {
          // Defer callback execution
          setTimeout(() => {
            if (callbackRef.current) {
              callbackRef.current(newIds);
            }
          }, 0);
        }
        return newIds;
      });
    }

    setUploadedFiles((prev) =>
      prev.map((file) => {
        if (file.name === fileName) {
          return {
            ...file,
            status,
            fileId: status === "success" ? fileId : file.fileId,
          };
        }
        return file;
      })
    );
  }, []);

  const uploadFileToAPI = async (file) => {
    try {
      const formData = new FormData();

      // Handle base64 images
      if (typeof file.uri === "string" && file.uri.startsWith("data:image")) {
        // Convert base64 to blob
        const response = await fetch(file.uri);
        const blob = await response.blob();

        // Use original filename if available, otherwise generate one
        const fileName =
          file.fileName ||
          `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${
            file.type?.split("/")[1] || "png"
          }`;

        formData.append("file", blob, fileName);

        try {
          const uploadResponse = await apiClient.post("/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              updateFileProgress(fileName, percentCompleted);
            },
          });

          if (uploadResponse.status === 200) {
            updateFileStatus(fileName, "success");
            if (onFileUploadSuccess) {
              onFileUploadSuccess(uploadResponse.data);
            }
          }
        } catch (error) {
          console.error(`Upload failed for ${fileName}:, error`);
          updateFileStatus(fileName, "error");
          throw error;
        }
      }
    } catch (error) {
      console.error("Error in uploadFileToAPI:", error);
      throw error;
    }
  };

  const handleImageSelected = async (result) => {
    try {
      if (!result.canceled && result.assets?.length > 0) {
        const files = result.assets.map((asset) => ({
          uri: asset.uri,
          fileName:
            asset.fileName ||
            `image-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 9)}.png`,
          type: asset.mimeType || "image/png",
        }));

        // Add files to store before starting upload
        const fileObjects = files.map((file) => ({
          name: file.fileName,
          progress: 0,
          status: "uploading",
        }));
        addFiles(fileObjects);

        // Create a single FormData instance for all files
        const formData = new FormData();

        for (const file of files) {
          if (file.uri.startsWith("data:image")) {
            const response = await fetch(file.uri);
            const blob = await response.blob();
            formData.append(
              "files",
              new File([blob], file.fileName, { type: file.type })
            );
          } else {
            formData.append("files", {
              uri: file.uri,
              type: file.type,
              name: file.fileName,
            });
          }
        }

        try {
          const uploadResponse = await apiClient.post("/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Accept: "application/json",
            },
            transformRequest: [
              function (data) {
                return data;
              },
            ],
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              files.forEach((file) => {
                updateFileProgress(file.fileName, percentCompleted);
              });
            },
          });

          if (uploadResponse.status === 200) {
            const uploadedFileData = Array.isArray(uploadResponse.data)
              ? uploadResponse.data
              : [uploadResponse.data];

            // Update status and store file IDs
            files.forEach((file, index) => {
              const fileData = uploadedFileData[index];
              if (fileData && fileData.id) {
                updateFileStatus(file.fileName, "success", fileData.id);
              }
            });

            if (onFileUploadSuccess) {
              onFileUploadSuccess(fileIds);
            }
          }
        } catch (error) {
          console.error("Upload failed:", error);
          console.error("Error details:", error.response?.data);
          files.forEach((file) => {
            updateFileStatus(file.fileName, "error");
          });
        }
      }
    } catch (error) {
      console.error("Error in handleImageSelected:", error);
    }
  };

  const handleFileUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        allowsMultipleSelection: true,
        quality: 1,
        base64: false,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const imageUris = result.assets.map((asset) => asset.uri);
        await handleImageSelected(result);
      }
    } catch (error) {
      console.error("Error in handleFileUpload:", error);
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

        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        if (!result.canceled && result.assets?.length > 0) {
          const asset = result.assets[0];
          const fileName = `camera-${Date.now()}.jpg`;

          // Add file to state to show progress
          setUploadedFiles((prev) => [
            ...prev,
            {
              name: fileName,
              progress: 0,
              status: "uploading",
            },
          ]);

          // Create FormData with the correct file structure
          const formData = new FormData();

          // Handle different platform file structures
          if (Platform.OS === "web") {
            // For web, fetch the blob first
            const response = await fetch(asset.uri);
            const blob = await response.blob();
            formData.append(
              "files",
              new File([blob], fileName, { type: "image/jpeg" })
            );
          } else {
            // For native platforms
            formData.append("files", {
              uri: asset.uri,
              type: asset.mimeType || "image/jpeg",
              name: fileName,
            });
          }

          try {
            const uploadResponse = await apiClient.post("/upload", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                Accept: "application/json",
              },
              transformRequest: [
                function (data) {
                  return data;
                },
              ],
              onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                updateFileProgress(fileName, percentCompleted);
              },
            });

            if (uploadResponse.status === 200) {
              const fileData = Array.isArray(uploadResponse.data)
                ? uploadResponse.data[0]
                : uploadResponse.data;

              if (fileData && fileData.id) {
                updateFileStatus(fileName, "success", fileData.id);
                if (onFileUploadSuccess) {
                  onFileUploadSuccess(fileIds);
                }
              }
            }
          } catch (error) {
            console.error("Upload failed:", error);
            console.error("Error response:", error.response?.data);
            updateFileStatus(fileName, "error");
            alert("Failed to upload image. Please try again.");
          }
        }
      } catch (error) {
        console.error("Error in handleCameraUpload:", error);
        alert("Failed to capture image. Please try again.");
      }
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsCameraActive(false);
  };

  const openWebCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing the camera: ", error);
      alert(
        "Failed to access camera. Please make sure camera permissions are granted."
      );
      setIsCameraActive(false);
    }
  };

  const captureImage = () => {
    if (Platform.OS === "web" && videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const fileName = `camera-${Date.now()}.jpg`;

      // Add file to uploadedFiles first to show progress
      setUploadedFiles((prev) => [
        ...prev,
        {
          name: fileName,
          progress: 0,
          status: "uploading",
        },
      ]);

      canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append(
          "files",
          new File([blob], fileName, { type: "image/jpeg" })
        );

        try {
          const uploadResponse = await apiClient.post("/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Accept: "application/json",
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              updateFileProgress(fileName, percentCompleted);
            },
          });

          if (uploadResponse.status === 200) {
            const fileData = Array.isArray(uploadResponse.data)
              ? uploadResponse.data[0]
              : uploadResponse.data;

            if (fileData && fileData.id) {
              updateFileStatus(fileName, "success", fileData.id);
              if (onFileUploadSuccess) {
                onFileUploadSuccess(fileIds);
              }
            }
          }
        } catch (error) {
          console.error("Upload failed:", error);
          updateFileStatus(fileName, "error");
        }

        closeCamera();
      }, "image/jpeg");
    }
  };

  const handleRemoveFile = useCallback((fileName) => {
    if (uploadIntervals.current[fileName]) {
      clearInterval(uploadIntervals.current[fileName]);
      delete uploadIntervals.current[fileName];
    }

    setUploadedFiles((prev) => {
      const removedFile = prev.find((file) => file.name === fileName);
      if (removedFile?.fileId) {
        setFileIds((prevIds) => {
          const newIds = prevIds.filter((id) => id !== removedFile.fileId);
          // Defer callback execution
          setTimeout(() => {
            if (callbackRef.current) {
              callbackRef.current(newIds);
            }
          }, 0);
          return newIds;
        });
      }
      return prev.filter((file) => file.name !== fileName);
    });
  }, []);

  // Cleanup effect
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
        <View style={styles.folderIconContainer}>
          <FontAwesome name="folder" size={50} color="#FFB02E" />
        </View>

        <Text style={styles.uploadText}>
          {message || "Upload your file in .png or .jpeg format"}
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
            {Platform.OS === "web" && (
              <video
                ref={videoRef}
                style={styles.videoPreview}
                autoPlay
                playsInline
                muted
              />
            )}
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
            style={styles.cameraButton}
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
                  <Text style={styles.progressText}>
                    {`${Math.round(file.progress)}%`}
                  </Text>
                )}
              </View>
              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${Math.round(file.progress)}%`,
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
                style={styles.trashIcon}
                name="trash"
                size={15}
                color={file.status === "uploading" ? "#CCCCCC" : "#FC5275"}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    width: "100%",
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
    backgroundColor: "#FFFFFF",
    marginTop: 20,
    width: "100%",
  },
  uploadText: {
    textAlign: "center",
    marginBottom: 16,
    marginTop: 20,
    color: "#4B5563",
  },
  uploadButton: {
    backgroundColor: "#577CFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 8,
    height: 39,
    minWidth: 150,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    textAlign: "center",
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
    width: "100%",
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  docNameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  fileName: {
    color: "#4B5563",
    fontSize: 13,
    fontWeight: "500",
  },
  progressText: {
    color: "#838383",
    fontSize: 12,
    fontWeight: "500",
  },
  progressBarContainer: {
    flex: 1,
    borderRadius: 4,
    overflow: "hidden",
    marginRight: 10,
  },
  progressBackground: {
    height: 6,
    backgroundColor: "#EAEAEA",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 10,
  },
  trashIcon: {
    marginTop: 0,
    padding: 5,
  },
  folderIconContainer: {
    marginBottom: 16,
    marginTop: 30,
  },
  orText: {
    color: "#6B7280",
    marginVertical: 12,
    fontSize: 16,
    fontWeight: "500",
    marginTop: 10,
  },
  cameraButton: {
    backgroundColor: "#577CFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 16,
    height: 39,
    minWidth: 150,
    alignItems: "center",
    marginTop: 10,
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
    backgroundColor: "#577CFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
    height: 39,
    minWidth: 150,
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
    height: 39,
    minWidth: 150,
    alignItems: "center",
  },
});

export default FileUpload;
