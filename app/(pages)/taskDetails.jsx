import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Image } from 'react-native';
import CustomButton from '../../components/CustomButton';
import BottomNavigation from './BottomNavigation ';
import { icons } from '../../constants';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';

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
        backgroundColor: colors.whiteColor,
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
        fontFamily: fonts.WorkSans600,
    },
    deadlineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    deadlineText: {
        color: colors.radiusColor,
        marginLeft: 8,
        fontFamily: fonts.WorkSans500,
    },
    imagePlaceholder: {
        height: 150,
        backgroundColor: colors.background,
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
        fontFamily: fonts.WorkSans600,
    },
    projectDescription: {
        color: colors.blackColor,
        fontFamily: fonts.WorkSans400,
        fontSize: 12,
        paddingTop: 25,
    },
    tableContainer: {
        borderWidth: 1,
        borderColor: colors.borderColor,
        borderRadius: 10,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderColor,
    },
    tableHeader: {
        flex: 2,
        fontWeight: '600',
        color: colors.primary,
        fontFamily: fonts.WorkSans500,
        fontSize: 12,
        borderRightWidth: 1,
        borderRightColor: colors.borderColor,
        paddingRight: 10,
    },
    tableContent: {
        flex: 1,
        textAlign: 'right',
        color: colors.blackColor,
        fontFamily: fonts.WorkSans400,
        fontSize: 10,
        paddingLeft: 10,
    },
});

export default taskDetails;