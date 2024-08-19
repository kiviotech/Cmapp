import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import CustomButton from '../../components/CustomButton';
import BottomNavigation from './BottomNavigation ';
const taskDetails = () => {
    return (
        <View style={{ flex: 1 }}>

            <SafeAreaView>
                <ScrollView style={styles.container}>
                    {/* Header Section */}
                    <View style={styles.header}>
                        <Text style={styles.detailsText}>Details</Text>
                        <View style={styles.deadlineContainer}>
                            <svg style={styles.dateIcon} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M15 2.50003V6.50003M9 2.50003V6.50003M20.4826 11.5H3.51733M20.4826 11.5C20.2743 5.7928 18.154 4.00003 12 4.00003C5.84596 4.00003 3.7256 5.7928 3.51733 11.5M20.4826 11.5C20.4943 11.8209 20.5 12.1541 20.5 12.5C20.5 19 18.5 21 12 21C5.5 21 3.5 19 3.5 12.5C3.5 12.1541 3.50563 11.8209 3.51733 11.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <Text style={styles.deadlineText}>Deadline: Mon, 10 July 2022</Text>
                        </View>
                    </View>

                    {/* Image Placeholder */}
                    <View style={styles.imagePlaceholder} />

                    {/* Project Info Section */}
                    <View style={styles.projectInfo}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                            <Text style={styles.projectTitle}>Verification & Inspection</Text>
                            <CustomButton
                                buttonStyle={{ backgroundColor: '#D5DDF9', fontSize: 8, width: 100, height: 25 }}
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
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    detailsText: {
        fontSize: 24,
        fontFamily: 'WorkSans_600SemiBold'
    },
    deadlineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    deadlineText: {
        color: '#FC5275',
        marginLeft: 8,
        fontFamily: 'WorkSans_500Medium'
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
    projectTitle: {
        fontSize: 18,
        fontFamily: 'WorkSans_600SemiBold',
    },

    projectDescription: {
        color: '#000000',
        fontFamily: 'WorkSans_400Regular',
        fontSize: 12,
        paddingTop: 25
    },
    tableContainer: {
        borderWidth: 1,
        borderColor: '#DADADA',
        borderRadius: 10,

    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 10,
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
        borderBottomColor: '#DADADA',

    },
    tableContent: {
        flex: 1,
        textAlign: 'right',
        color: '#000000',
        fontFamily: 'WorkSans_400Regular',
        fontSize: 10,
        paddingLeft: 10
    },
});

export default taskDetails;