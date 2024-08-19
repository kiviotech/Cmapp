import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FileUpload from '../../components/FileUploading/FileUpload'

const uploadProof = () => {
    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.mainContainer}>
                    <Text style={styles.instructions}>1. Upload your proof of work</Text>
                    <FileUpload />
                    <Text style={styles.instructions}>2. Wait for your supervisor’s Approval</Text>
                </View>
            </ScrollView>

        </SafeAreaView>

    )
}

export default uploadProof

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 15,
        paddingTop: 20
    },

    instructions: {
        fontSize: 18,
        fontFamily: 'WorkSans_600SemiBold',
    },
})