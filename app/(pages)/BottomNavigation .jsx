import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { icons } from '../../constants';


const BottomNavigation = ({ navigation }) => {
    return (
        <View style={styles.navContainer}>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
                <Image source={icons.home}></Image>
                <Text style={styles.navTextActive}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
                <Image source={icons.user}></Image>
                <Text style={[styles.navText,styles.profile]}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Settings')}>
                <Image source={icons.settings}></Image>
                <Text style={styles.navText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Logout')}>
                <Image source={icons.logout}></Image>
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
        fontSize:12
    },
    profile:{
        position:'relative',top:3

    }
});

export default BottomNavigation;