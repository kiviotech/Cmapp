import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { icons } from '../../constants';

const FileUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState([
    { name: 'Document_name.png', progress: 100, status: 'success' },
    { name: 'Document_name.jpeg', progress: 55, status: 'uploading' },
  ]);

  const handleFileUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Handle the file upload process here
      // For now, let's simulate adding the file with a dummy progress
      setUploadedFiles([...uploadedFiles, { name: result.uri.split('/').pop(), progress: 0, status: 'uploading' }]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instructions}>1. Upload your proof of work</Text>

      <View style={styles.uploadContainer}>
        <Image source={icons.fileUpload}></Image>

        {/* Upload Instructions */}
        <Text style={styles.uploadText}>Upload your proof of work in .png or .jpeg format</Text>

        {/* Browse Files Button */}
        <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
          <Text style={styles.buttonText}>Browse files</Text>
        </TouchableOpacity>

        {/* OR Separator */}
        <Text style={styles.orText}>OR</Text>

        {/* Use Camera Button */}
        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.buttonText}>Use Camera</Text>
        </TouchableOpacity>

        {/* Uploaded Files List */}
        {uploadedFiles.map((file, index) => (
          <View key={index} style={styles.fileRow}>
            <FontAwesome name="file" size={24} color="#6B7280" />
            <Text style={styles.fileName}>{file.name}</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${file.progress}%`, backgroundColor: file.status === 'success' ? 'green' : '#FFA500' }]} />
            </View>
            {file.status === 'success' ? (
              <FontAwesome name="check-circle" size={24} color="green" />
            ) : (
              <FontAwesome name="times-circle" size={24} color="red" />
            )}
          </View>
        ))}
      </View>

      <Text style={styles.instructions}>2. Wait for your supervisor’s Approval</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F1F1F1'
  },
  instructions: {
    fontSize: 18,
    fontFamily:'WorkSans_600SemiBold',
    marginBottom: 30,
  },
  uploadContainer: {
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#8D8D8D',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    height:440,
    alignItems:'center'
  },
  folderIcon: {
    marginBottom: 16,
  },
  uploadText: {
    textAlign: 'center',
    marginBottom: 16,
    marginTop:20,
    color: '#4B5563',
  },
  uploadButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 16,
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
    marginBottom: 10,
    width: '100%',
  },
  fileName: {
    flex: 1,
    marginLeft: 10,
    color: '#4B5563',
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 10,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
});

export default FileUpload;
