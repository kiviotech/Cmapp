import { View, Text, Image, Alert, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { Tabs, router } from 'expo-router';
import { icons } from '../../../constants';


const TabIcon = ({ icon, color, name, focused }) => {
    return (
        <View className="items-center justify-center gap-2 ">
            <Image
                source={icon}
                resizeMode="contain"
                tintColor={color}
                className="w-6 h-6"
            />
        </View>
    );
};

const TabIcon2 = ({ DefaultIcon, FocusedIcon, color, name, focused }) => {
    return (
        <View className="items-center justify-center gap-2 ">
            {focused ? <FocusedIcon className="h-8 w-8" /> : <DefaultIcon className="h-8 w-8" />}
        </View>
    );
};

const TabsLayout = () => {
    const logOut = async () => {
        try {
            router.replace('/login');
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    const orderHistory = async () => {
        try {
            router.replace('OrderHistory');
        } catch (error) {
            console.log('Error', error.message);
        }
    };
    return (
        <>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: 'black',
                    tabBarInactiveTintColor: '#70706e',
                    tabBarStyle: styles.tabBar
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        title: 'Home',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.home}
                                name="Home"
                                focused={focused}
                            />
                        )
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Profile',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon2
                                DefaultIcon={icons.profile}
                                color={color}
                                name="Profile"
                                focused={focused}
                            />
                        )
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        title: 'Settings',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon2
                                DefaultIcon={icons.Settings}
                                FocusedIcon={svgs.SettingsSelect}
                                color={color}
                                name="Settings"
                                focused={focused}
                            />
                        )
                    }}
                />


            </Tabs>
        </>
    );
};

export default TabsLayout;


const styles = StyleSheet.create({
    // tabBar: {
    //     backgroundColor: '#FFF',
    //     borderTopWidth: 1,
    //     height: 52,
    //     borderTopColor: '#F4F2F0',
    //     marginLeft: 14,
    //     marginRight: 14,
    //     marginBottom: 20,
    //     borderRadius: 26,


    // },

    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        marginTop: 20,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        position: 'absolute',
        top: -100,
    },
    yourOrderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15
    },
    section: {
        marginBottom: 20,
        borderColor: '#D9D9D9',
        borderBottomWidth: 1,
        paddingBottom: 10
    },
    sectionTitle: {
        fontFamily: 'Montserrat',
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 21.94,
        letterSpacing: 0.3,
        color: '#5360A8',
        paddingBottom: 10

    },

    option: {
        paddingVertical: 10,


    },
    optionText: {
        fontSize: 16,
        color: '#000000',
        fontFamily: 'Montserrat',
        fontWeight: '400',
        lineHeight: 18.29,
        letterSpacing: 0.3,

    },
});