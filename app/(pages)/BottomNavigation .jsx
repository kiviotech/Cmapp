import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import the hook
import { icons } from '../../constants';

const BottomNavigation = () => {
    const navigation = useNavigation(); // Use the hook to get navigation object

    return (
        <View style={styles.navContainer}>
            <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate('(pages)/dashboard')} // Navigate to Dashboard on Home press
            >
                <Image source={icons.home} />
                <Text style={styles.navTextActive}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate('(pages)/profile')} // Navigate to Profile on Profile press
            >
                <Image source={icons.user} />
                <Text style={[styles.navText, styles.profile]}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate('(pages)/settings')} // Navigate to Settings on Settings press
            >
                <Image source={icons.settings} />
                <Text style={styles.navText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate('(auth)/login')} // Navigate to Login on Logout press
            >
                <Image source={icons.logout} />
                <Text style={styles.navText}>Logout</Text>
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
