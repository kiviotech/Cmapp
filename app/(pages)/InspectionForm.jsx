import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import fonts from '../../constants/fonts';
const InspectionForm = () => {
    const [checkedItems, setCheckedItems] = useState(new Array(7).fill(false));
    const [isAllChecked, setIsAllChecked] = useState(false);

    const toggleCheckbox = (index) => {
        const newCheckedItems = [...checkedItems];
        newCheckedItems[index] = !newCheckedItems[index];
        setCheckedItems(newCheckedItems);
        setIsAllChecked(newCheckedItems.every(item => item));
    };

    const handleCheckAll = () => {
        const newCheckedState = !isAllChecked;
        setIsAllChecked(newCheckedState);
        setCheckedItems(new Array(7).fill(newCheckedState));
    };

    // useEffect(() => {
    //    const 
    // }, [checkedItems]);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("(pages)/projectDetails")}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={styles.headerTitle}>Inspection Form</Text>
                </View>

            </View>



            <Text style={styles.title}>Dirt Pad Inspection</Text>
            <Text style={styles.description}>
                Verify the level and extent of the Dirt Pad after completion of excavation, filling, compaction, and grading.
            </Text>

            <View style={styles.checklistHeader}>
                <Text style={styles.checklistTitle}>Checklist</Text>
                <Text style={styles.checklistCount}>
                    {checkedItems.filter(item => item).length} out of {checkedItems.length}
                </Text>
                <TouchableOpacity 
                    style={styles.checkAllButton}
                    onPress={handleCheckAll}
                >
                    <Text style={styles.checkAllButtonText}>
                        {isAllChecked ? 'Uncheck All' : 'Check All'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.checklistContainer}>

                {checkedItems.map((checked, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.checklistItem}
                        onPress={() => toggleCheckbox(index)}
                    >
                        <View style={[styles.checkbox, checked && styles.checked]}>
                            {checked && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <Text style={styles.checklistItemText}>
                            Lorem ipsum dolor sit amet consectetur. Sit mi integer pharetra euismod. Vulputate nisl nam nibh id amet.
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.uploadSection}>
                <Text style={styles.uploadTitle}>📁 Upload up to 5 related files</Text>
                <TouchableOpacity style={styles.browseButton}>
                    <Text style={styles.browseButtonText}>Browse files</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    backButton: {
        paddingTop: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: fonts.WorkSans400,
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
        fontFamily: fonts.WorkSans400,
    },
    checklistHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    checklistTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: fonts.WorkSans400,
    },
    checklistCount: {
        marginLeft: 8,
        color: '#577CFF',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: fonts.WorkSans400,
    },
    checkAllButton: {
        marginLeft: 'auto',
        backgroundColor: '#577CFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
    },
    checkAllButtonText: {
        color: '#fff',
    },
    checklistContainer: {
        marginBottom: 24,
        backgroundColor: '#fff',
        borderRadius: 8,
        boxShadow: '0px 0px 9px 6px #00000014',
    },
    checklistItem: {
        flexDirection: 'row',
        padding: 15,
        marginBottom: 8,
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: '#C4C4C4',
      
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        top: 3,
    },
    checked: {
        backgroundColor: '#577CFF',
        borderColor: '#577CFF',
    },
    checkmark: {
        color: '#fff',
        fontWeight: 'bold',
        fontFamily: fonts.WorkSans400,
        fontSize: 12,
    },
    checklistItemText: {
        flex: 1,
        fontFamily: fonts.WorkSans400,
        fontSize: 12,
        color: '#000000',
        fontWeight: '400',
    },
    uploadSection: {
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 30,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 24,
    },
    uploadTitle: {
        marginBottom: 8,
        fontFamily: fonts.WorkSans400,
        fontSize: 16,
        color: '#000000',
        fontWeight: 'bold',
    },
    browseButton: {
        borderWidth: 1,
        borderColor: '#4169E1',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
    },
    browseButtonText: {
        color: '#577CFF',
        fontFamily: fonts.WorkSans400,
        fontWeight: '500',

    },
    submitButton: {
        backgroundColor: '#577CFF',
        padding: 16,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 24,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: fonts.WorkSans400,
    },
});

export default InspectionForm;
