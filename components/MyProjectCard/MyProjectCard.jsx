import React from 'react';
import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';
const MyProjectCard = ({ cardValue, cardColor }) => {
    const maxImagesToShow = 2;
    const userImagesToShow = cardValue.userImg?.slice(0, maxImagesToShow);
    const remainingCount = cardValue.userImg?.length - maxImagesToShow;
    return (
        <ScrollView>
            <View style={[styles.cardContainer, { backgroundColor: '#FFFFFF' }]}>
                <Text style={styles.projectName}>{cardValue.projectName}</Text>
                <Text style={styles.projectDescription}>{cardValue.projectDescription}</Text>
                <View style={[styles.deadlineContainer, { borderTopColor: cardValue.taskStatusColor, borderTopWidth: 1 }]}>
                    <View>
                        <Text style={styles.deadlineText}>
                            <svg style={styles.dateICon} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M15 2.50003V6.50003M9 2.50003V6.50003M20.4826 11.5H3.51733M20.4826 11.5C20.2743 5.7928 18.154 4.00003 12 4.00003C5.84596 4.00003 3.7256 5.7928 3.51733 11.5M20.4826 11.5C20.4943 11.8209 20.5 12.1541 20.5 12.5C20.5 19 18.5 21 12 21C5.5 21 3.5 19 3.5 12.5C3.5 12.1541 3.50563 11.8209 3.51733 11.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {cardValue.deadline}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10, paddingRight: 10 }}>
                        {userImagesToShow?.map((imgObj, key) => (
                            <Image key={key} source={imgObj.img} style={{ marginRight: -10 }} />
                        ))}
                        {remainingCount > 0 && (
                            <View
                                style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 15,
                                    backgroundColor: '#FFB057',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: 5,
                                    marginLeft: -3
                                }}
                            >
                                <Text style={{ color: '#FFF' }}>{remainingCount}+</Text>
                            </View>
                        )}
                    </View>


                </View>
            </View>
        </ScrollView>

    );
};

const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: 20,
        padding: 20,
        height: 'auto',
        marginVertical: 10
    },
    projectName: {
        color: '#000B23',
        fontFamily: 'WorkSans_500Medium',
        fontSize: 18,
        fontWeight: 600,
        lineHeight: 30,
        letterSpacing: 0.09,
    },
    projectDescription: {
        color: '#7B7B7B',
        fontFamily: 'WorkSans_500Medium',
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: '300',
        lineHeight: 15, // Adjust as needed
        letterSpacing: -0.06,
    },
    deadlineContainer: {
        marginTop: 30,
        paddingTop: 10,
        paddingBottom: 15,
        flexDirection: 'row',
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
        color: '#7B7B7B',
        fontFamily: 'WorkSans_400Regular',
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 12, // Adjust as needed
        letterSpacing: 0.06,

    },
    taskStatus: {
        color: '#7B7B7B',
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 15, // Adjust as needed
        marginTop: 10
    },
});

export default MyProjectCard;