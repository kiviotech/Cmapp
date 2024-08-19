import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '../../constants/icons';
import HomePageCard from '../../components/CustomHomePageCard/HomePageCard';
import BottomNavigation from './BottomNavigation ';

const HomePage = () => {
    const [isSearchVisible, setSearchVisible] = useState(false);
    const cardDataArray = [
        {
            projectName: 'Survey and Marking',
            projectDescription: 'Ensure survey accuracy by cross-referencing multiple points. Verify site layout against survey plans.',
            deadline: Date.now(),
            taskStatus: 'Task Completed',
            taskStatusColor: '#A3D65C',
            cardColor: '#EEF7E0',
            status: ''
        },
        {
            projectName: 'Verification & Inspection',
            projectDescription: 'Regular site walkthroughs to ensure compliance with safety regulations and quality standards.',
            deadline: Date.now(),
            taskStatus: 'Rejected',
            taskStatusColor: '#FC5275',
            cardColor: '#FED5DD',
            status: 'rejected'
        },
        {
            projectName: 'Verification & Inspection',
            projectDescription: 'Regular site walkthroughs to ensure compliance with safety regulations and quality standards.',
            deadline: Date.now(),
            taskStatus: 'Upload your Proof of work',
            taskStatusColor: 'blue',
            cardColor: '#FFFFFF',
            status: 'uploading'
        },

        {
            projectName: 'Verification & Inspection',
            projectDescription: 'Regular site walkthroughs to ensure compliance with safety regulations and quality standards.',
            deadline: Date.now(),
            taskStatus: 'Pending Approval',
            taskStatusColor: '#7B7B7B',
            cardColor: '#FFFFFF',
            rejected: true,
            status: 'uploaded'

        },
    ];
    const handleSearchPress = () => {
        setSearchVisible(!isSearchVisible);
    };
    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.header}>
                <Image source={icons.user1} style={styles.profileImage} />
                <View>
                    <Text style={styles.greeting}>Good Evening!</Text>
                    <Text style={styles.userName}>Dan Smith</Text>
                </View>

                <View style={styles.iconsContainer}>
                    <TouchableOpacity style={styles.icon} onPress={handleSearchPress}>
                        <Image source={icons.search} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.icon}>
                        <Image source={icons.bell} />
                    </TouchableOpacity>
                </View>

            </View>

            {isSearchVisible && (
                <View style={styles.searchBarContainer}>
                    <TextInput
                        style={styles.searchBar}
                        placeholder="Search..."
                        placeholderTextColor="#999"
                    />
                </View>
            )}


            <ScrollView>
                <View style={{ flexDirection: 'row', paddingLeft: 10, paddingBottom: 10 }}>
                    <Text style={styles.userName}>Role:</Text>
                    <Text style={[styles.userName, styles.projectName]}>PROJECT SUPERVISOR</Text>
                </View>

                <View style={{ flexDirection: 'row', paddingLeft: 10, paddingBottom: 40, paddingTop: 30, alignItems: 'center' }}>
                    <View>
                        <Text style={styles.userName}>Today’s Tasks</Text>
                        <Text style={[styles.greeting, { paddingTop: 5 }]}>7 Tasks Pending</Text>
                    </View>

                    <View style={styles.iconsContainer}>
                        <TouchableOpacity style={styles.icon}>
                            <Image source={icons.filters} />
                        </TouchableOpacity>

                    </View>
                </View>

                {cardDataArray.map((cardData, index) => (
                    <HomePageCard key={index} cardValue={cardData} cardColor={cardData.cardColor} />
                ))}
            </ScrollView>
            <BottomNavigation />
        </SafeAreaView>
    );
};

export default HomePage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f0f0f0',
        paddingBottom:90
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        paddingBottom: 20
    },
    searchBarContainer: {
        padding: 10,
        marginTop: -10,
        marginBottom: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        shadowColor: '#171717',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,

    },
    searchBar: {
        height: 40,
        width: '100%',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    projectName: {
        color: '#577CFF',
        fontFamily: 'WorkSans_600SemiBold',
        paddingLeft: 10
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    greeting: {
        fontSize: 12,
        color: '#7B7B7B',
        fontFamily: 'WorkSans_400Regular'
    },
    userName: {
        color: '#000B23',
        fontSize: 20,
        fontFamily: 'WorkSans_600SemiBold',
    },
    iconsContainer: {
        flexDirection: 'row',
        marginLeft: 'auto',
    },
    icon: {
        marginLeft: 15,
        borderColor: '#E4E4E4',
        borderRadius: '100%',
        borderWidth: 1,
        padding: 10
    },
});
