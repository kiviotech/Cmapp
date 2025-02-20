import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TaskCard = ({ taskName, contractorName, date, status }) => {
    return (
        <View style={styles.card}>
            {/* Top Row: Task Name and Status */}
            <View style={styles.topRow}>
                <Text style={styles.taskName}>{taskName}</Text>
                <Text style={styles.status}>{status}</Text>
            </View>

            {/* Bottom Row: Assigned Contractor & Date */}
            <View style={styles.bottomRow}>
                <Text style={styles.contractorName}>{contractorName}</Text>
                <Text style={styles.date}>{date}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
        marginVertical: 8,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    taskName: {
        fontSize: 16,
        fontWeight: '400',
        color: '#000',
    },
    status: {
        fontSize: 14,
        fontWeight: '400',
        color: '#A3D65C', // Green color for "Completed"
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    contractorName: {
        fontSize: 14,
        color: '#A8A8A8',
    },
    date: {
        fontSize: 14,
        color: '#A8A8A8',
    },
});

export default TaskCard;
