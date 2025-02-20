import React, { useState,useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import ProjectOverview from './ProjectOverview/ProjectOverview';
import ProjectTracking from './ProjectTracking/ProjectTracking';
import { icons } from '../../../constants';
import { fetchUserById } from '../../../src/services/userService';
import useAuthStore from '../../../useAuthStore';

const HomwBuyer = () => {
    const [selectedTab, setSelectedTab] = useState('ProjectOverview');
    const [userName, setUserName] = useState('');
    const user = useAuthStore((state) => state.user);
    const userId = user?.id;

    useEffect(() => {
        const getUser = async () => {
            if (!userId) return; // Prevent API call if userId is null

            try {
                const userData = await fetchUserById(userId);
                setUserName(userData?.username || 'User'); // Set username, fallback to "User"
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        };

        getUser();
    }, [userId]); // Fetch user when userId changes


    return (
        <View style={styles.container}>
            {/* User Profile Section */}
            <View style={styles.profileContainer}>
                <Image source={icons.Ellipse} style={styles.profileImage} />
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{userName}</Text>
                    <Text style={styles.userRole}>Home Buyer</Text>
                </View>
            </View>

            {/* Tab Navigation */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'ProjectOverview' && styles.activeTab]}
                    onPress={() => setSelectedTab('ProjectOverview')}
                >
                    <Text style={[styles.tabText, selectedTab === 'ProjectOverview' && styles.activeTabText]}>
                        Project Overview
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'ProjectTracking' && styles.activeTab]}
                    onPress={() => setSelectedTab('ProjectTracking')}
                >
                    <Text style={[styles.tabText, selectedTab === 'ProjectTracking' && styles.activeTabText]}>
                        Project Tracking
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Display Selected Component */}
            {selectedTab === 'ProjectOverview' ? <ProjectOverview /> : <ProjectTracking />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
        alignItems: 'center',
        paddingTop: 40,
        
    },
    profileContainer: {
        flexDirection: 'row', // Aligns items horizontally
        alignItems: 'center', // Centers items vertically
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 15, // Adds spacing between the image and text
    },
    userInfo: {
        flexDirection: 'column', // Keeps text in a vertical stack
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    userRole: {
        fontSize: 16,
        color: '#577CFF',
    },
    tabContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly',
        borderBottomWidth: 1,
        borderBottomColor: '#E9E8E8',
        paddingHorizontal: 20
    },
    tab: {
        paddingVertical: 12,
        flex: 1,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 3,
        borderBottomColor: '#577CFF',
    },
    tabText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    activeTabText: {
        color: '#577CFF',
    },
});

export default HomwBuyer;
