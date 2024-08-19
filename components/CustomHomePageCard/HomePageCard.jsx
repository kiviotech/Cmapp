import React from 'react'
import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';
import CustomButton from '../CustomButton/CustomButton';
import icons from '../../constants/icons';
import { FontAwesome } from '@expo/vector-icons';
const HomePageCard = ({ cardValue, cardColor }) => {
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
                        <View style={styles.deadlineText}>
                            <Image source={icons.calendar}></Image>
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
}

export default HomePageCard
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


    deadlineText: {
        color: '#7B7B7B',
        fontFamily: 'WorkSans_400Regular',
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: '400',
        letterSpacing: 0.06,
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10
    },
    taskStatus: {
        color: '#7B7B7B',
        fontFamily: 'WorkSans_500Medium',
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 15, // Adjust as needed
        marginLeft: 10
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
