import { StyleSheet, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';

const UploadedFileHIstory = ({ historyData }) => {
    return (

        <View style={[styles.uploadedHistory, { backgroundColor: colors.whiteColor }]}>
            <Text style={{ color: colors.blackColor, fontFamily: fonts.WorkSans500, fontSize: 16, letterSpacing: 0.8 }}>Uploaded History!</Text>
            {historyData.map((file, index) => (
                <View style={{ paddingTop: 20 }} key={index}>

                    <View style={{ paddingTop: 10, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                        <FontAwesome name="file" size={24} color="#6B7280" />
                        <Text style={{ color: colors.blackColor, fontFamily: fonts.WorkSans500, fontSize: 16, letterSpacing: 0.8 }}>{file.fileName}</Text>
                    </View>

                </View>
            ))}



        </View>

    )
}

export default UploadedFileHIstory

const styles = StyleSheet.create({

    uploadedHistory: {
        borderRadius: 17,
        minHeight: 150,
        padding: 25,
        marginTop: 20
    }
})