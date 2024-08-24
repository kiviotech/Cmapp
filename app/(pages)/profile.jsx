import React from 'react';
import { StyleSheet, View, ScrollView, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavigation from './BottomNavigation ';
import colors from '../../constants/colors';

const profile = () => {

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View>
                    <Text>Profile</Text>
                </View>
            </ScrollView>
            <BottomNavigation />
        </SafeAreaView>
    );
};

export default profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: colors.background,
        paddingBottom: 45
    },
});
