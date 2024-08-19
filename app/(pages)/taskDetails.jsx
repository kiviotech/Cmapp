import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Image } from 'react-native';
import CustomButton from '../../components/CustomButton';
import BottomNavigation from './BottomNavigation ';
import { icons } from '../../constants';

const taskDetails = () => {
    return (
        <View style={styles.rootContainer}>
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    {/* Header Section */}
                    <View style={styles.header}>
                        <Text style={styles.detailsText}>Details</Text>
                        <View style={styles.deadlineContainer}>
                            <Image source={icons.calendar} />
                            <Text style={styles.deadlineText}>Deadline: Mon, 10 July 2022</Text>
                        </View>
                    </View>

                    {/* Image Placeholder */}
                    <View style={styles.imagePlaceholder} />

                    {/* Project Info Section */}
                    <View style={styles.projectInfo}>
                        <View style={styles.projectTitleContainer}>
                            <Text style={styles.projectTitle}>Verification & Inspection</Text>
                            <CustomButton
                                buttonStyle={{ backgroundColor: '#D5DDF9', fontSize: 8, width: 120, height: 35 }}
                                textStyle={{ fontFamily: 'WorkSans_500Medium', color: '#577CFF' }}
                                text='Substructure'
                            />
                        </View>
                        <Text style={styles.projectDescription}>
                            Regular site walkthroughs to ensure compliance with safety regulations and quality standards.
                        </Text>
                    </View>

                    {/* Table Section */}
                    <View style={styles.tableContainer}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableHeader}>Consultant / Third Party / Inspector</Text>
                            <Text style={styles.tableContent}>Surveyor</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableHeader}>Required Drawings / Documents</Text>
                            <Text style={styles.tableContent}>Topographic Survey</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableHeader}>QA Team Process</Text>
                            <Text style={styles.tableContent}>
                                Inspection of survey markings for accuracy. Verify site layout against survey plans.
                            </Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableHeader}>QC Team Process</Text>
                            <Text style={styles.tableContent}>
                                Review of survey accuracy and compliance with specifications.
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
            <BottomNavigation />
        </View>
    );
};

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        padding: 16, // Space from all sides
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
    },
    header: {
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailsText: {
        fontSize: 24,
        fontFamily: 'WorkSans_600SemiBold',
    },
    deadlineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    deadlineText: {
        color: '#FC5275',
        marginLeft: 8,
        fontFamily: 'WorkSans_500Medium',
    },
    imagePlaceholder: {
        height: 150,
        backgroundColor: '#E0E0E0',
        borderRadius: 10,
        marginBottom: 16,
    },
    projectInfo: {
        marginBottom: 16,
    },
    projectTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
    },
    projectTitle: {
        fontSize: 18,
        fontFamily: 'WorkSans_600SemiBold',
    },
    projectDescription: {
        color: '#000000',
        fontFamily: 'WorkSans_400Regular',
        fontSize: 12,
        paddingTop: 25,
    },
    tableContainer: {
        borderWidth: 1,
        borderColor: '#DADADA',
        borderRadius: 10,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA',
    },
    tableHeader: {
        flex: 2,
        fontWeight: '600',
        color: '#577CFF',
        fontFamily: 'WorkSans_500Medium',
        fontSize: 10,
        borderRightWidth: 1,
        borderRightColor: '#DADADA',
        paddingRight: 10,
    },
    tableContent: {
        flex: 1,
        textAlign: 'right',
        color: '#000000',
        fontFamily: 'WorkSans_400Regular',
        fontSize: 10,
        paddingLeft: 10,
    },
});

export default taskDetails;