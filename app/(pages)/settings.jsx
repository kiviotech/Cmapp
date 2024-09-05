import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Switch, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import colors from '../../constants/colors';
import BottomNavigation from './BottomNavigation ';
import fonts from '../../constants/fonts';
import { icons } from '../../constants';

const Settings = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Text style={styles.title}>Settings</Text>

                <View style={[styles.section, {
                    borderBottomWidth: 1,
                    borderBottomColor: '#CACACA',
                }]}>
                    <Text style={styles.sectionTitle}>Account Settings</Text>

                    <TouchableOpacity style={styles.item}>
                        <Text style={styles.itemText}>Edit profile</Text>
                        <FontAwesome
                            style={{ color: colors.blackColor }}
                            name="chevron-right"
                            size={15}
                            color="#FFFFFF"
                        />

                    </TouchableOpacity>

                    <TouchableOpacity style={styles.item}>
                        <Text style={styles.itemText}>Change password</Text>
                        <FontAwesome
                            style={{ color: colors.blackColor }}
                            name="chevron-right"
                            size={15}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>

                    <View style={styles.item}>
                        <Text style={styles.itemText}>Push notifications</Text>
                        <View style={styles.switchContainer}>
                            <Switch
                                trackColor={{ false: "#767577", true: colors.primary }}
                                thumbColor={isEnabled ? colors.whiteColor : colors.whiteColor}
                                onValueChange={toggleSwitch}
                                value={isEnabled}
                                style={styles.switch}
                            />
                        </View>

                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>More</Text>

                    <TouchableOpacity style={styles.item}>
                        <Text style={styles.itemText}>About us</Text>
                        <FontAwesome
                            style={{ color: colors.blackColor }}
                            name="chevron-right"
                            size={15}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.item}>
                        <Text style={styles.itemText}>Privacy policy</Text>
                        <FontAwesome
                            style={{ color: colors.blackColor }}
                            name="chevron-right"
                            size={15}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.item}>
                        <Text style={styles.itemText}>Terms and conditions</Text>
                        <FontAwesome
                            style={{ color: colors.blackColor }}
                            name="chevron-right"
                            size={15}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <BottomNavigation />
        </SafeAreaView>
    );
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.background,
        paddingBottom: 45,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    section: {
        marginBottom: 30,
        marginTop: 20,
        paddingBottom: 20
    },

    switchContainer: {
        height: 50, // Adjust height as needed
        justifyContent: 'center', // Centers the switch vertically
        paddingRight:20
    },

    switch: {
        transform: [{ scale: 2 }], // Adjust the scale factor to increase or decrease the size
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: fonts.WorkSans400,
        marginBottom: 10,
        color: '#ADADAD',
        fontSize: 18
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,

    },
    itemText: {
        fontSize: 18,
        color: colors.blackColor,
        fontFamily: fonts.WorkSans400
    },
});
