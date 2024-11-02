import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const AssignContractors = () => {
  const [contractorTypeOpen, setContractorTypeOpen] = useState(false);
  const [contractorTypeValue, setContractorTypeValue] = useState(null);
  const [contractorTypeItems, setContractorTypeItems] = useState([
    { label: "Dirtwork Contractor", value: "dirtwork" },
    { label: "Electrical Contractor", value: "electrical" },
    { label: "Plumbing Contractor", value: "plumbing" },
  ]);

  const [contractorOpen, setContractorOpen] = useState(false);
  const [contractorValue, setContractorValue] = useState(null);
  const [contractorItems, setContractorItems] = useState([
    { label: "Contractor 1", value: "contractor1" },
    { label: "Contractor 2", value: "contractor2" },
    { label: "Contractor 3", value: "contractor3" },
  ]);

  const [taskOpen, setTaskOpen] = useState(false);
  const [taskValue, setTaskValue] = useState(null);
  const [taskItems, setTaskItems] = useState([
    { label: "Task 1", value: "task1" },
    { label: "Task 2", value: "task2" },
    { label: "Task 3", value: "task3" },
  ]);

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.mainHeading}>Assign Contractors</Text>

          {/* Contractor Type Dropdown */}
          <Text style={styles.label}>Contractor Type</Text>
          <DropDownPicker
            open={contractorTypeOpen}
            value={contractorTypeValue}
            items={contractorTypeItems}
            setOpen={setContractorTypeOpen}
            setValue={setContractorTypeValue}
            setItems={setContractorTypeItems}
            placeholder="Select the contractor type"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />

          {/* Contractor Dropdown */}
          <Text style={styles.label}>Contractor</Text>
          <DropDownPicker
            open={contractorOpen}
            value={contractorValue}
            items={contractorItems}
            setOpen={setContractorOpen}
            setValue={setContractorValue}
            setItems={setContractorItems}
            placeholder="Select Contractor"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />

          {/* Assign Task Dropdown */}
          <Text style={styles.label}>Assign Task</Text>
          <DropDownPicker
            open={taskOpen}
            value={taskValue}
            items={taskItems}
            setOpen={setTaskOpen}
            setValue={setTaskValue}
            setItems={setTaskItems}
            placeholder="Select Task"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />

          {/* Finish Button */}
          <TouchableOpacity style={styles.finishButton}>
            <Text style={styles.finishButtonText}>Finish Project Setup</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  AreaContainer: {
    flex: 1,
    padding: 5,
    marginTop: 20,
    width: "100%",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
  dropdown: {
    marginBottom: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 50,
  },
  dropdownContainer: {
    borderColor: "#ccc",
  },
  finishButton: {
    marginTop: 20,
    width: "60%",
    margin: "auto",
    backgroundColor: "#A9A9A9",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  finishButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AssignContractors;
