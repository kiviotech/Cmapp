import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { icons } from '../../constants';

const FileUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState([
    { name: 'Document_name.png', progress: 100, status: 'success' },
    { name: 'Document_name.jpeg', progress: 55, status: 'uploading' },
  ]);

  const [cameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null); // Ref for the video element
  const [stream, setStream] = useState(null);

  const handleFileUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUploadedFiles([...uploadedFiles, { name: result.uri.split('/').pop(), progress: 0, status: 'uploading' }]);
    }
  };

  const handleCameraUpload = async () => {
    if (Platform.OS === 'web') {
      setIsCameraActive(true);
      openWebCamera();
    } else {
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
        setUploadedFiles([...uploadedFiles, { name: result.uri.split('/').pop(), progress: 0, status: 'uploading' }]);
      }
    }
  };

  const closeCamera = () => {
    setIsCameraActive(false);
  }

  const openWebCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(mediaStream => {
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      })
      .catch(error => {
        console.error('Error accessing the camera: ', error);
      });
  };

  useEffect(() => {
    // Clean up the stream when the component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <View style={styles.container}>
      <View style={styles.uploadContainer}>
        <Text style={styles.uploadText}>Upload your proof of work in .png or .jpeg format</Text>

        {/* Browse Files Button */}
        <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
          <Text style={styles.buttonText}>Browse files</Text>
        </TouchableOpacity>

        {/* OR Separator */}
        <Text style={styles.orText}>OR</Text>

        {/* Use Camera Button */}
        {cameraActive === true ? (
          <TouchableOpacity style={styles.uploadButton} onPress={closeCamera}>
            <Text style={styles.buttonText}>Close Camera</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.uploadButton} onPress={handleCameraUpload}>
            <Text style={styles.buttonText}>Use Camera</Text>
          </TouchableOpacity>
        )}

        {/* Camera Preview */}
        {Platform.OS === 'web' && cameraActive && (
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
                <Text style={styles.fileName}>{file.name}</Text>
                {file.status === 'success' ? (
                  <FontAwesome name="check-circle" size={15} color="#A3D65C" />
                ) : (
                  <Text style={{ color: '#838383', fontSize: 10 }}>{`${file.progress}%`}</Text>
                )}
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
            {file.status === 'success' ? (
              <FontAwesome style={{ marginTop: 15 }} name="trash" size={15} color="#FC5275" />
            ) : (
              <FontAwesome style={{ marginTop: 15 }} name="times" size={15} color="#FC5275" />
            )}
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
    backgroundColor: '#F1F1F1',
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
    paddingBottom: 40
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
    height: 39
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  orText: {
    color: '#6B7280',
    marginBottom: 16,
  },
  cameraContainer: {
    width: '100%',
    height: 'auto',
    marginTop: 16,
  },
  videoPreview: {
    width: '100%',
    height: 'auto',
    borderRadius: 10,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
    width: '100%',
    marginTop: 20,
  },
  docNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  fileName: {
    color: '#4B5563',
  },
  progressBarContainer: {
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBackground: {
    height: 8,
    backgroundColor: '#DADADA',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
});

export default FileUpload;
