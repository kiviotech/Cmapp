import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import { FontAwesome } from '@expo/vector-icons';
import fonts from '../../constants/fonts';
import colors from '../../constants/colors';
const uploadProof = () => {
    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.mainContainer}>
                    <View style={styles.border}>
                        <Text style={styles.instructions}>Notifications</Text>
                    </View>

                    <Text style={styles.pagraph}>Contractor ABC has requested to something something...</Text>
                    <Text style={[styles.pagraph, { textAlign: 'right', paddingRight: 20 }]}>see more</Text>
                </View>
                <View style={{
                    flexDirection: 'row', justifyContent: 'flex-end', gap: 10, borderColor: '#DFDFDF', paddingRight: 20, borderBottomWidth: 1,
                    paddingBottom: 30,
                }}>
                    <FontAwesome style={{ position: 'absolute', left: 35, zIndex: 1000, top: 12 }} name="check-circle" size={15} color="#FFFFFF" />
                    <CustomButton
                        buttonStyle={{ backgroundColor: colors.greenessColor, fontSize: 10, width: 170, letterSpacing: 1 }}
                        textStyle={{ fontFamily: fonts.WorkSans600, color: colors.whiteColor, marginLeft: 20 }}
                        text='Approve Request'

                    />
                    <FontAwesome style={{ position: 'absolute', right: 155, zIndex: 1000, top: 12, }} name="check-circle" size={15} color="#FFFFFF" />
                    <CustomButton
                        buttonStyle={{ backgroundColor: colors.radiusColor, fontSize: 10, width: 160, letterSpacing: 1 }}
                        textStyle={{ fontFamily: fonts.WorkSans400, color: colors.whiteColor, marginLeft: 10 }}
                        text='Reject Request'

                    />
                </View>
            </ScrollView>

        </SafeAreaView>

    )
}

export default uploadProof

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,

    },

    instructions: {
        fontSize: 24,
        fontFamily: fonts.WorkSans600,
        padding: 15,
    },
    pagraph: {
        color: colors.blackColor,
        fontSize: 14,
        paddingTop: 20,
        padding: 15,
        fontFamily: fonts.WorkSans400,
    },
    border: {
        borderColor: colors.borderColor,
        borderBottomWidth: 1,
        paddingBottom: 30,
        paddingTop: 30
    }
})