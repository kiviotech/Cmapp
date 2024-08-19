import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyProjectCard from '../../components/MyProjectCard/MyProjectCard';
import { icons } from '../../constants';

const YourProject = () => {
    const cardDataArray = [
        {
            projectName: 'Project 1',
            projectDescription: 'Description',
            deadline: 'Some important info',

            taskStatusColor: '#DFDFDF',
            cardColor: '#FFFFFF',
            userImg: [
                { userId: 1, img: icons.user1 },
                { userId: 2, img: icons.user2 },
                { userId: 3, img: icons.user2 }
            ]
        },
        {
            projectName: 'Project 2',
            projectDescription: 'Description',
            deadline: 'Some important info',

            taskStatusColor: '#DFDFDF',
            cardColor: '#FFFFFF',
            userImg: [
                { userId: 1, img: icons.user1 },
                { userId: 2, img: icons.user2 },
                { userId: 3, img: icons.user2 }
            ]
        },

    ];

    return (
        <ScrollView>
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Select Your Project</Text>
                {cardDataArray.map((cardData, index) => {
                    console.log(cardData);
                    return <MyProjectCard key={index} cardValue={cardData} cardColor={cardData.cardColor} />;
                })}


            </SafeAreaView>
        </ScrollView>
    );
};

export default YourProject;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f0f0f0',
        paddingTop: 30
    },
    title: {
        color: '#000',
        fontFamily: 'WorkSans_600SemiBold',
        fontSize: 26,
        paddingBottom: 30
    }
});
