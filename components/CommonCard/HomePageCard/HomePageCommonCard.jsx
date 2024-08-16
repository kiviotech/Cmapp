import React from 'react';
import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';
import CustomButton from '../../CustomButton';
import icons from '../../../constants/icons';

const HomePageCommonCard = ({ cardValue, cardColor }) => {
    // Handle date formatting
    const formattedDate = new Date(cardValue.deadline).toLocaleDateString();
    return (
        <ScrollView>
            <View style={[styles.cardContainer, { backgroundColor: cardColor }]}>

                <View style={{
                    background: '#D9D9D9', width: '100%',
                    height: 131,
                }}></View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20 }}>
                    <Text style={styles.projectName}>{cardValue.projectName}</Text>
                    {cardValue.projectName && (
                        <CustomButton
                            buttonStyle={{ backgroundColor: '#D5DDF9', width: 76, height: 25, letterSpacing: 0 }}
                            textStyle={{ fontFamily: 'WorkSans_500Medium', color: '#577CFF', fontSize: 9 }}
                            text='Substructure'
                            handlePress={() => submit('login')}
                        />
                    )}

                </View>

                <Text style={styles.projectDescription}>{cardValue.projectDescription}</Text>
                <View style={[styles.deadlineContainer, { borderTopColor: cardValue.taskStatusColor }]}>
                    <View>
                        <Text style={styles.deadlineText}>
                            <svg style={styles.dateICon} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M15 2.50003V6.50003M9 2.50003V6.50003M20.4826 11.5H3.51733M20.4826 11.5C20.2743 5.7928 18.154 4.00003 12 4.00003C5.84596 4.00003 3.7256 5.7928 3.51733 11.5M20.4826 11.5C20.4943 11.8209 20.5 12.1541 20.5 12.5C20.5 19 18.5 21 12 21C5.5 21 3.5 19 3.5 12.5C3.5 12.1541 3.50563 11.8209 3.51733 11.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {formattedDate}
                        </Text>
                        {cardValue.taskStatus && (
                            <Text style={[styles.taskStatus, { color: cardValue.taskStatusColor }]}>
                                <svg style={styles.checkIcon} xmlns="http://www.w3.org/2000/svg" viewBox="-1 0 10 6" fill="none">
                                    <path d="M7 1L2.87503 5L1 3.18183" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                </svg> {cardValue.taskStatus}
                            </Text>
                        )}
                    </View>
                </View>
                <View style={{ flexDirection: 'column', justifyContent: 'flex-end', width: '100%', paddingTop: 10 }}>
                    {cardValue.status === 'rejected' && (
                        <View style={{ alignItems: 'flex-end' }}>
                            <CustomButton
                                buttonStyle={{
                                    backgroundColor: cardValue.taskStatusColor,
                                    width: '80%',
                                    height: 34,
                                    letterSpacing: 0,
                                    alignSelf: 'flex-end', // This aligns the button to the right
                                }}
                                textStyle={{
                                    fontFamily: 'WorkSans_500Medium',
                                    color: '#FFF',
                                    fontSize: 12,
                                }}
                                text={cardValue.status === 'rejected' ? 'Reupload your Proof of work' : 'Upload your Proof of work'}
                                handlePress={() => submit('login')}
                            />
                            <Image style={styles.uploadeIcon} source={icons.reUpload} />
                        </View>
                    )}
                    {cardValue.status === 'uploading' && (
                        <View style={{ alignItems: 'flex-end' }}>
                            <CustomButton
                                buttonStyle={{
                                    backgroundColor: cardValue.taskStatusColor,
                                    width: '80%',
                                    height: 34,
                                    letterSpacing: 0,
                                    alignSelf: 'flex-end', // This aligns the button to the right
                                }}
                                textStyle={{
                                    fontFamily: 'WorkSans_500Medium',
                                    color: '#FFF',
                                    fontSize: 12,
                                }}
                                text={cardValue.status === 'rejected' ? 'Reupload your Proof of work' : 'Upload your Proof of work'}
                                handlePress={() => submit('login')}
                            />
                            <Image style={styles.uploadeIcon} source={icons.upload} />
                        </View>
                    )}
                </View>

            </View>
        </ScrollView>

    );
};
export default HomePageCommonCard;
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
        marginTop: 10
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
        fontFamily: 'WorkSans_500Medium',
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 15, // Adjust as needed
        marginTop: 10
    },
    checkIcon: {
        backgroundColor: '#A3D65C',
        width: 24,
        height: 24,
        borderRadius: '100%',
        position: 'relative',
        top: 6,
        marginRight: 8
    },
    uploadeIcon: {
        position: 'absolute',
        top: 10,
        left: 85
    }
});

