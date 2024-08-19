import React from 'react';
import { Text, View, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import CustomButton from '../CustomButton/CustomButton';
import icons from '../../constants/icons';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const CustomHomePageCard = ({ cardValue, cardColor }) => {
    const navigation = useNavigation();
    const formattedDate = new Date(cardValue.deadline).toLocaleDateString();

    return (
        <ScrollView>
            <TouchableOpacity
                style={[styles.cardContainer, { backgroundColor: cardColor }]}
                onPress={() => navigation.navigate('(pages)/taskDetails')}
            >
                <View style={{ backgroundColor: '#D9D9D9', width: '100%', height: 131 }} />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20 }}>
                    <Text style={styles.projectName}>{cardValue.projectName}</Text>
                    {cardValue.projectName && (
                        <CustomButton
                            buttonStyle={{ backgroundColor: '#D5DDF9', width: 76, height: 25 }}
                            textStyle={{ fontFamily: 'WorkSans_500Medium', color: '#577CFF', fontSize: 9, letterSpacing: 0 }}
                            text='Substructure'
                        />
                    )}
                </View>

                <Text style={styles.projectDescription}>{cardValue.projectDescription}</Text>

                <View style={[styles.deadlineContainer, { borderTopColor: cardValue.taskStatusColor }]}>
                    <View>
                        <View style={styles.deadlineText}>
                            <Image source={icons.calendar} />
                            <Text> {formattedDate}</Text>
                        </View>

                        {cardValue.taskStatus && (
                            <View style={styles.deadlineText}>
                                <FontAwesome
                                    name={cardValue.taskStatus === 'Rejected' ? 'times-circle' : 'check-circle'}
                                    size={20}
                                    style={{ color: cardValue.taskStatusColor, marginLeft: 4 }}
                                />
                                <Text style={[styles.taskStatus, { color: cardValue.taskStatusColor }]}>
                                    {cardValue.taskStatus}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                <View style={{ flexDirection: 'column', justifyContent: 'flex-end', width: '100%', paddingTop: 10 }}>
                    {['rejected', 'uploading'].includes(cardValue.status) && (
                        <View style={{ alignItems: 'flex-end' }}>
                            <CustomButton
                                buttonStyle={{
                                    backgroundColor: cardValue.taskStatusColor,
                                    width: '80%',
                                    height: 34,
                                    alignSelf: 'flex-end',
                                }}
                                textStyle={{
                                    fontFamily: 'WorkSans_500Medium',
                                    color: '#FFF',
                                    fontSize: 12,
                                    letterSpacing: 0,
                                }}
                                text={cardValue.status === 'rejected' ? 'Reupload your Proof of work' : 'Upload your Proof of work'}
                                handlePress={() => navigation.navigate('(pages)/notification')}
                            />
                            <Image
                                style={styles.uploadeIcon}
                                source={cardValue.status === 'rejected' ? icons.reUpload : icons.upload}
                            />
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default CustomHomePageCard;

const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: 20,
        padding: 20,
        height: 'auto',
        marginVertical: 10,
    },
    projectName: {
        color: '#000B23',
        fontFamily: 'WorkSans_500Medium',
        fontSize: 18,
        fontWeight: '600', // Corrected to string
        lineHeight: 30,
        letterSpacing: 0.09,
    },
    projectDescription: {
        color: '#7B7B7B',
        fontFamily: 'WorkSans_500Medium',
        fontSize: 12,
        fontWeight: '300',
        lineHeight: 15,
        letterSpacing: -0.06,
        marginTop: 10,
    },
    deadlineContainer: {
        marginTop: 30,
        paddingTop: 10,
        paddingBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    deadlineText: {
        color: '#7B7B7B',
        fontFamily: 'WorkSans_400Regular',
        fontSize: 14,
        fontWeight: '400',
        letterSpacing: 0.06,
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10,
    },
    taskStatus: {
        fontFamily: 'WorkSans_500Medium',
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 15,
        marginLeft: 10,
    },
    checkIcon: {
        backgroundColor: '#A3D65C',
        width: 24,
        height: 24,
        borderRadius: 12, // Corrected borderRadius
        position: 'relative',
        top: 6,
        marginRight: 8,
    },
    uploadeIcon: {
        position: 'absolute',
        top: 10,
        left: 85, // Consider changing this to percentage or flexbox for better responsiveness
    },
});
