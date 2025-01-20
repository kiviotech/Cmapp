import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import fonts from '../../constants/fonts';
import colors from '../../constants/colors';

const UploadedFileHistory = ({ historyData }) => {
  const [taskData, setTaskData] = useState(null);
  const [submissionsData, setSubmissionsData] = useState([]);

  useEffect(() => {
    if (historyData) {
      setTaskData(historyData);
      setSubmissionsData(historyData?.attributes?.submissions?.data || []);
    }
  }, [historyData]);

  return (
    <View style={styles.historyContainer}>
      <Text style={styles.historyTitle}>Previous Submissions</Text>
      {submissionsData.length === 0 ? (
        <Text style={styles.noHistoryText}>No previous submissions found.</Text>
      ) : (
        submissionsData.map((submission, index) => (
          <View key={index} style={styles.submissionContainer}>
            <Text style={styles.historyTitle}>
              {taskData?.attributes?.standard_task?.data?.attributes?.Name || 'Unnamed Task'}
            </Text>

            <View>
              <Text style={styles.commentText}>
                {index + 1}. Comment: {submission?.attributes?.comment || 'No comment provided'}
              </Text>
              <Text style={styles.statusText}>
                Status: {submission?.attributes?.status || 'Unknown'}
              </Text>
              <Text style={styles.dateText}>
                Submitted on: {submission?.attributes?.createdAt?.slice(0, 10) || 'N/A'}
              </Text>
            </View>

            {submission?.attributes?.files?.map((file, fileIndex) => (
              <TouchableOpacity
                key={fileIndex}
                style={styles.fileRow}
                onPress={() => Linking.openURL(file?.url || '#')}
              >
                <FontAwesome name="file" size={24} color={colors.primary} />
                <Text style={styles.fileName}>{file?.fileName || 'Unknown File'}</Text>
                <FontAwesome name="download" size={15} color={colors.downloadIconColor} />
              </TouchableOpacity>
            ))}
          </View>
        ))
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  historyContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: colors.historyBackgroundColor,
    borderRadius: 10,
  },
  historyTitle: {
    fontSize: 18,
    // fontFamily: fonts.WorkSans600,
    marginBottom: 10,
  },
  noHistoryText: {
    fontSize: 14,
    color: colors.noHistoryTextColor,
    // fontFamily: fonts.WorkSans500,
  },
  submissionContainer: {
    marginBottom: 20,
  },
  commentText: {
    fontSize: 14,
    // fontFamily: fonts.WorkSans500,
    color: colors.blackColor,
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    // fontFamily: fonts.WorkSans500,
    color: colors.statusTextColor,
    marginBottom: 5,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  fileName: {
    flex: 1,
    fontSize: 14,
    marginLeft: 10,
    // fontFamily: fonts.WorkSans500,
    color: colors.blackColor,
  },
});

export default UploadedFileHistory;