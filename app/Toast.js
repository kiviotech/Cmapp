// Toast.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { icons } from '../constants';
import fonts from '../constants/fonts';

const Toast = ({ visible, message, type }) => {
    if (!visible) return null;

    return (
        <View style={[styles.toastContainer, type === 'success' ? styles.success : styles.error]}>
            <Image 
                source={type === 'success' ? icons.approved : icons.reject} 
                style={styles.toastIcon} 
            />
            <Text style={[styles.toastMessage, type === 'success' ? styles.successText : styles.errorText]}>
                {message}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    toastContainer: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        padding: 10,
        borderRadius: 8,
        zIndex: 999,
        elevation: 10,
        padding: 20,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
       
    },
    success: {
        backgroundColor: '#EEF7E0',
        borderColor: '#A3D65C',
    },
    error: {
        backgroundColor: '#FED5DD',
        borderColor: '#FC5275',
    },
    toastMessage: {
        textAlign: 'center',
        fontFamily:fonts.WorkSans500
    },
    successText: {
        color: '#A3D65C',
    },
    errorText: {
        color: '#FC5275',
    },
    toastIcon: {
        width: 20,
        height: 20,
    },
});

export default Toast;
