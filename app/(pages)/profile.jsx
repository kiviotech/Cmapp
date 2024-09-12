import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavigation from './BottomNavigation ';
import colors from '../../constants/colors';
import { icons } from '../../constants';
import fonts from '../../constants/fonts';
import UploadedFileHIstory from '../../components/UploadedFileHIstory';
import { getProjects } from '../../src/api/repositories/projectRepository';

const profile = () => {
    const uploadedHistory = [
        {
            id: 1, fileName: 'Document_name1.png',
        },
        {
            id: 2, fileName: 'Document_name2.png',
        },
        {
            id: 3, fileName: 'Document_name3.png',
        }
    ];

    const [projectsDetail, setProjectsDetail] = useState([]); // to store all user project

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const projectData = await getProjects();

                setProjectsDetail(projectData.data.data);

                const taskData = await getTasks();
                setTasksDetail(taskData.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchProjects();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ padding: 10 }}>
                <View>
                    <View style={styles.profileImageContiner}>
                        <Image style={styles.userImage} source={icons.userProfile}></Image>
                    </View>
                    <View style={styles.profileDetailSection}>
                        <Text style={styles.userName}>Dan Smith</Text>
                        <Text style={[styles.userName, { color: colors.primary }]}>Project Supervisor</Text>
                    </View>

                </View>


                <UploadedFileHIstory historyData={uploadedHistory} />{/* to view user uploaded file history */}

                {/* to view user project  */}
                <View style={{ marginTop: 20 }}>

                    <Text style={{ fontFamily: fonts.WorkSans600, fontSize: 16, letterSpacing: 0.8, color:colors.blackColor,paddingLeft:10 }}>Your Projects</Text>


                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.carousel}
                    >
                        {projectsDetail.map((project, index) => (
                            <View key={index} style={styles.cardWrapper}>
                                <SelectYourProjectCard
                                    cardValue={{
                                        name: project.attributes.name,
                                        desc: project.attributes.description,
                                        update: project.attributes.update_status,
                                        deadline: project.attributes.deadline,
                                    }}
                                />
                            </View>
                        ))}
                    </ScrollView>
                </View>

            </ScrollView>
            <BottomNavigation />
        </SafeAreaView>





    );
};

export default profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: colors.background,
        paddingBottom: 45
    },
    profileImageContiner: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,

    },
    userImage: {
        width: 115,
        height: 115,
        borderRadius: '100%',
        objectFit: 'cover'
    },
    profileDetailSection: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 30
    },
    userName: {
        color: colors.blackColor,
        fontFamily: fonts.WorkSans600,
        fontSize: 26,
        letterSpacing: 0.13,
        paddingBottom: 10
    }
});
