import React from 'react';
import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';
import { icons } from '../../constants';

const UpcommingAppointments = ({ cardValue, cardColor }) => {
    return (
        <ScrollView>
            <View style={[styles.cardContainer, { backgroundColor: '#FFFFFF' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.projectName}>{cardValue.name}</Text>
                    <Image source={icons.bellFilled}></Image>
                </View>

                <Text style={styles.projectDescription}>{cardValue.proName}</Text>
                <View style={[styles.deadlineContainer, { borderTopColor: "#DFDFDF", borderTopWidth: 1 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Image source={icons.calendar}></Image>
                        <Text style={styles.deadlineText}>
                            {cardValue.deadline}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingTop: 10 }}>
                        <Image source={icons.clock}></Image>

                        <Text style={styles.deadlineText}>
                            {cardValue.time}
                        </Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: 10,
        padding: 20,
        height: 185,
        marginVertical: 20,

    },
    projectName: {
        color: '#577CFF',
        fontFamily: 'WorkSans_600SemiBold',
        fontSize: 20,
        fontWeight: 600,
        lineHeight: 40,
        letterSpacing: 0.09,
    },
    projectDescription: {
        color: '#000000',
        fontFamily: 'WorkSans_500Medium',
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: '300',
        lineHeight: 15, // Adjust as needed
        letterSpacing: -0.06,
    },
    deadlineContainer: {
        marginTop: 20,
        paddingTop: 10,
        paddingBottom: 15,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },

    dateICon: {
        width: 28,
        height: 28,
        position: 'relative',
        top: 9,
        marginRight: 10
    },
    deadlineText: {
        color: '#000000',
        fontFamily: 'WorkSans_400Regular',
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 18, // Adjust as needed
        letterSpacing: 0.06,
    },
});

export default UpcommingAppointments;