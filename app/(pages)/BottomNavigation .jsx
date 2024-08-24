import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; // Import the hook
import { icons } from '../../constants';
import { logout } from '../../src/utils/auth';


const BottomNavigation = () => {
    const navigation = useNavigation(); // Use the hook to get navigation object
    const route = useRoute(); // Get the current route

    return (
        <View style={styles.navContainer}>
            <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate('(pages)/dashboard')} // Navigate to Dashboard on Home press
            >
                <Image source={route.name === '(pages)/dashboard' ? icons.homeFilled : icons.home} />
                <Text style={route.name === '(pages)/dashboard' ? styles.navTextActive : styles.navText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate('(pages)/profile')} // Navigate to Profile on Profile press
            >
                <Image source={route.name === '(pages)/profile' ? icons.userFilled : icons.user} />
                <Text style={route.name === '(pages)/profile' ? styles.navTextActive : styles.navText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate('(pages)/settings')} // Navigate to Settings on Settings press
            >
                <Image source={route.name === '(pages)/settings' ? icons.settingsFilled : icons.settings} />
                <Text style={route.name === '(pages)/settings' ? styles.navTextActive : styles.navText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.navItem}
                onPress={() => {
                    logout(); // Call the logout function
                    navigation.navigate('(auth)/login'); // Navigate to Login screen
                }} // Navigate to Login on Logout press
            >
                <Image source={route.name === '(auth)/login' ? icons.logoutFilled : icons.logout} />
                <Text style={route.name === '(auth)/login' ? styles.navTextActive : styles.navText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    navContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#DADADA',
        paddingVertical: 15,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    navItem: {
        alignItems: 'center',
    },
    navTextActive: {
        color: '#577CFF',
        fontFamily: 'WorkSans_500Medium',
    },
    navText: {
        color: '#A8A8A8',
        fontFamily: 'WorkSans_500Medium',
        marginTop: 6,
        fontSize: 12
    },
    profile: {
        position: 'relative',
        top: 3
    }
});

export default BottomNavigation;