import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '../../constants/icons';
import BottomNavigation from './BottomNavigation ';
import SubtaskCard from '../../components/SubtaskCard';
import SelectYourProjectCard from '../../components/SelectYourProjectCard';
import UpcommingAppointments from '../../components/UpcommingAppointmentsCard/UpcommingAppointments';
import { useNavigation } from '@react-navigation/native'; // Import the hook
import CustomHomePageCard from '../../components/CustomHomePageCard/CustomHomePageCard';
const dashboard = () => {
    const [isSearchVisible, setSearchVisible] = useState(false);
    const navigation = useNavigation(); // Use the hook to get navigation object
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

    const yourProject = [
        {
            name: 'Project 1',
            desc: 'Description Over view',
            update: 'Ongoing: Phase - I',
            deadline: 'Ahead of Schedule',
            cardColor: '#EEF7E0',
            active: true
        },
        {
            name: 'Project 1',
            desc: 'Description Over view',
            update: 'Ongoing: Phase - I',
            deadline: 'Ahead of Schedule',
            cardColor: '#FFFFFF',
            active: true
        },
    ];

    const subTask = [
        {
            task: 'Tesk-1',
            proName: 'Project Name',
            deadline: 'Done by 22nd August, 2022'
        },
        {
            task: 'Tesk-1',
            proName: 'Project Name',
            deadline: 'Done by 22nd August, 2022'
        },
    ];
    const upcomingAppointemntArr = [
        {
            name: 'Inspection',
            proName: 'Project Name',
            deadline: 'Mon, 10 July 2022',
            time: '9 AM - 10:30 AM'
        },
        {
            name: 'Inspection',
            task: 'Inspection',
            proName: 'Project Name',
            deadline: 'Mon, 10 July 2022',
            time: '9 AM - 10:30 AM'
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
                    <Text style={styles.userName}>Dan Smith</Text>
                    <Text style={styles.greeting}>Project Supervisor</Text>
                </View>
                <View style={styles.iconsContainer}>
                    <TouchableOpacity style={styles.icon} onPress={handleSearchPress}>
                        <Image source={icons.search} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('(pages)/notification')} style={styles.icon}>
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
                <Text style={styles.title}>Select Your Project</Text>

                {/* Horizontal ScrollView for the Carousel */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
                    {yourProject.map((cardData, index) => (
                        <View key={index} style={styles.cardWrapper}>
                            <SelectYourProjectCard
                                cardValue={cardData}
                                cardColor={cardData.cardColor}
                            />
                        </View>
                    ))}
                </ScrollView>

                <Text style={styles.projectitle}>Project 1</Text>
                <View style={{ flexDirection: 'row', paddingLeft: 0, paddingBottom: 10, marginTop: 10, alignItems: 'center' }}>
                    <View>
                        <Text style={styles.userName}>Recent Milestones</Text>
                        <Text style={[styles.greeting, { paddingTop: 5 }]}>7 Tasks Done</Text>
                    </View>
                    <View style={styles.iconsContainer}>
                        <TouchableOpacity style={styles.icon}>
                            <Image source={icons.filters} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.yourProjectCOntainer}>
                    {subTask.map((cardData, index) => (
                        <SubtaskCard key={index} cardValue={cardData} cardColor={cardData.cardColor} />
                    ))}
                </View>

                <View style={{ flexDirection: 'row', paddingLeft: 10, paddingBottom: 40, paddingTop: 30, alignItems: 'center' }}>
                    <View>
                        <Text style={styles.userName}>Upcoming Milestones</Text>
                        <Text style={[styles.greeting, { paddingTop: 5 }]}>7 Tasks Pending</Text>
                    </View>
                    <View style={styles.iconsContainer}>
                        <TouchableOpacity style={styles.icon}>
                            <Image source={icons.filters} />
                        </TouchableOpacity>
                    </View>
                </View>

                {cardDataArray.map((cardData, index) => (
                    <CustomHomePageCard key={index} cardValue={cardData} cardColor={cardData.cardColor} />
                ))}


                {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
                    {yourProject.map((cardData, index) => (
                        <View key={index} style={styles.cardWrapper}>
                            <SelectYourProjectCard
                                cardValue={cardData}
                                cardColor={cardData.cardColor}
                            />
                        </View>
                    ))}
                </ScrollView> */}
                <View>
                    <Text style={styles.projectitle}>Upcoming Appointments</Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.carousel, { marginTop: -5 }]}>
                        {upcomingAppointemntArr.map((cardData, index) => (
                            <View key={index} style={styles.cardWrapper}>
                                <UpcommingAppointments key={index} cardValue={cardData} cardColor={cardData.cardColor} />
                            </View>
                        ))}
                    </ScrollView>

                </View>

            </ScrollView>
            <BottomNavigation />
        </SafeAreaView>
    );
};

export default dashboard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f0f0f0',
        paddingBottom: 45,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        paddingBottom: 20,
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
    projectitle: {
        color: '#000',
        fontFamily: 'WorkSans_600SemiBold',
        fontSize: 26,
        marginTop: 20,
    },
    title: {
        color: '#000',
        fontFamily: 'WorkSans_600SemiBold',
        fontSize: 26,
        marginTop: 40,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    greeting: {
        fontSize: 12,
        color: '#577CFF',
        fontFamily: 'WorkSans_400Regular',
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
        padding: 10,
    },

    carousel: {
        marginTop: 20,
        borderColor: '#ddd',
        borderBottomWidth: 1,
        borderRadius: 5,
        paddingBottom: 20
    },
    cardWrapper: {
        marginRight: 15, // Adjust the space between the cards
    },
    cardStyle: {
        marginRight: 15,
    },
});
