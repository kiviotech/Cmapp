// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   ScrollView,
// } from "react-native";
// import DropDownPicker from "react-native-dropdown-picker";
// import { fetchSubContractors } from "../../src/services/subContractorService";
// import { fetchUsers } from "../../src/services/userService";
// import useProjectStore from "../../projectStore";
// import { useNavigation, useRoute } from "@react-navigation/native";

// const AssignContractors = () => {
//   const [contractorTypeOpen, setContractorTypeOpen] = useState(false);
//   const [contractorTypeValue, setContractorTypeValue] = useState(null);
//   const [contractorTypeItems, setContractorTypeItems] = useState([]);

//   const [contractorOpen, setContractorOpen] = useState(false);
//   const [contractorValue, setContractorValue] = useState(null);
//   const [contractorItems, setContractorItems] = useState([]);

//   const [taskOpen, setTaskOpen] = useState(false);
//   const [taskValue, setTaskValue] = useState(null);
//   const [taskItems, setTaskItems] = useState([
//     { label: "Task 1", value: "task1" },
//     { label: "Task 2", value: "task2" },
//     { label: "Task 3", value: "task3" },
//   ]);

//   const route = useRoute();

//   const projectData =
//     route.params?.projectData || useProjectStore((state) => state.projectData);

//   useEffect(() => {
//     if (projectData) {
//       console.log("Project Data:", projectData);
//     }
//   }, [projectData]);

//   // Fetch contractor types on mount
//   useEffect(() => {
//     const loadContractorTypes = async () => {
//       try {
//         const response = await fetchSubContractors();
//         const contractors = response.data ? response.data : response;

//         console.log("Contractor Data:", contractors); // Log the contractor data to check the structure

//         if (!Array.isArray(contractors)) {
//           console.error("Unexpected format: contractors is not an array");
//           return;
//         }

//         const types = [
//           ...new Set(
//             contractors.map((contractor) => contractor.attributes.name)
//           ),
//         ].map((type, index) => ({
//           label: type,
//           value: type.toLowerCase(),
//           key: `type-${index}`,
//         }));

//         setContractorTypeItems(types);
//       } catch (error) {
//         console.error("Error fetching contractor types:", error);
//       }
//     };

//     loadContractorTypes();
//   }, []);

//   // Fetch users with "Contractor" designation and display in contractor dropdown
//   useEffect(() => {
//     const loadContractors = async () => {
//       try {
//         const users = await fetchUsers();

//         const contractors = users.filter(
//           (user) => user.designation?.Name === "Contractor"
//         );

//         setContractorItems(
//           contractors.map((user) => ({
//             label: user.username,
//             value: user.id,
//             key: user.id.toString(),
//           }))
//         );
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     loadContractors();
//   }, []);

//   return (
//     <SafeAreaView style={styles.AreaContainer}>
//       <ScrollView>
//         <View style={styles.container}>
//           <Text style={styles.mainHeading}>Assign Contractors</Text>

//           {/* Contractor Type Dropdown */}
//           <Text style={styles.label}>Contractor Type</Text>
//           <DropDownPicker
//             open={contractorTypeOpen}
//             value={contractorTypeValue}
//             items={contractorTypeItems}
//             setOpen={setContractorTypeOpen}
//             setValue={setContractorTypeValue}
//             setItems={setContractorTypeItems}
//             placeholder="Select the contractor type"
//             style={styles.dropdown}
//             dropDownContainerStyle={styles.dropdownContainer}
//             zIndex={3000}
//             zIndexInverse={1000}
//           />

//           {/* Contractor Dropdown */}
//           <Text style={styles.label}>Contractor</Text>
//           <DropDownPicker
//             open={contractorOpen}
//             value={contractorValue}
//             items={contractorItems}
//             setOpen={setContractorOpen}
//             setValue={setContractorValue}
//             setItems={setContractorItems}
//             placeholder="Select Contractor"
//             style={styles.dropdown}
//             dropDownContainerStyle={styles.dropdownContainer}
//             disabled={!contractorTypeValue}
//             zIndex={2000}
//             zIndexInverse={2000}
//           />

//           {/* Assign Task Dropdown */}
//           <Text style={styles.label}>Assign Task</Text>
//           <DropDownPicker
//             open={taskOpen}
//             value={taskValue}
//             items={taskItems}
//             setOpen={setTaskOpen}
//             setValue={setTaskValue}
//             setItems={setTaskItems}
//             placeholder="Select Task"
//             style={styles.dropdown}
//             dropDownContainerStyle={styles.dropdownContainer}
//             zIndex={1000}
//             zIndexInverse={3000}
//           />

//           {/* Finish Button */}
//           <TouchableOpacity style={styles.finishButton}>
//             <Text style={styles.finishButtonText}>Finish Project Setup</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   AreaContainer: {
//     flex: 1,
//     padding: 5,
//     marginTop: 20,
//     width: "100%",
//   },
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   mainHeading: {
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "left",
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 10,
//     fontWeight: "bold",
//   },
//   dropdown: {
//     marginBottom: 15,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     height: 50,
//   },
//   dropdownContainer: {
//     borderColor: "#ccc",
//   },
//   finishButton: {
//     marginTop: 20,
//     width: "60%",
//     margin: "auto",
//     backgroundColor: "#A9A9A9",
//     padding: 15,
//     borderRadius: 15,
//     alignItems: "center",
//   },
//   finishButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// export default AssignContractors;

// ---------------------------------------------

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   ScrollView,
// } from "react-native";
// import DropDownPicker from "react-native-dropdown-picker";
// import { fetchSubContractors } from "../../src/services/subContractorService";
// import { fetchUsers } from "../../src/services/userService";
// // import { fetchProjectById } from "../api/repositories/projectRepository"; // Import fetchProjectById
// import { fetchProjectById } from "../../src/services/projectService";
// import useProjectStore from "../../projectStore";
// import { useRoute } from "@react-navigation/native";

// const AssignContractors = () => {
//   const [contractorTypeOpen, setContractorTypeOpen] = useState(false);
//   const [contractorTypeValue, setContractorTypeValue] = useState(null);
//   const [contractorTypeItems, setContractorTypeItems] = useState([]);

//   const [contractorOpen, setContractorOpen] = useState(false);
//   const [contractorValue, setContractorValue] = useState(null);
//   const [contractorItems, setContractorItems] = useState([]);

//   const [taskOpen, setTaskOpen] = useState(false);
//   const [taskValue, setTaskValue] = useState(null);
//   const [taskItems, setTaskItems] = useState([
//     { label: "Task 1", value: "task1" },
//     { label: "Task 2", value: "task2" },
//     { label: "Task 3", value: "task3" },
//   ]);

//   const route = useRoute();
//   const projectData =
//     route.params?.projectData || useProjectStore((state) => state.projectData);

//   // Fetch project details by ID and log them
//   useEffect(() => {
//     const loadProjectDetails = async () => {
//       if (projectData?.id) {
//         try {
//           const projectDetails = await fetchProjectById(projectData.id);
//           console.log("Original Project Details:", projectDetails);
//         } catch (error) {
//           console.error("Error fetching project details:", error);
//         }
//       }
//     };

//     loadProjectDetails();
//   }, [projectData]);

//   // Fetch contractor types on mount
//   useEffect(() => {
//     const loadContractorTypes = async () => {
//       try {
//         const response = await fetchSubContractors();
//         const contractors = response.data ? response.data : response;

//         if (!Array.isArray(contractors)) {
//           console.error("Unexpected format: contractors is not an array");
//           return;
//         }

//         const types = [
//           ...new Set(
//             contractors.map((contractor) => contractor.attributes.name)
//           ),
//         ].map((type, index) => ({
//           label: type,
//           value: type.toLowerCase(),
//           key: `type-${index}`,
//         }));

//         setContractorTypeItems(types);
//       } catch (error) {
//         console.error("Error fetching contractor types:", error);
//       }
//     };

//     loadContractorTypes();
//   }, []);

//   // Fetch users with "Contractor" designation and display in contractor dropdown
//   useEffect(() => {
//     const loadContractors = async () => {
//       try {
//         const users = await fetchUsers();

//         const contractors = users.filter(
//           (user) => user.designation?.Name === "Contractor"
//         );

//         setContractorItems(
//           contractors.map((user) => ({
//             label: user.username,
//             value: user.id,
//             key: user.id.toString(),
//           }))
//         );
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     loadContractors();
//   }, []);

//   return (
//     <SafeAreaView style={styles.AreaContainer}>
//       <ScrollView>
//         <View style={styles.container}>
//           <Text style={styles.mainHeading}>Assign Contractors</Text>

//           {/* Contractor Type Dropdown */}
//           <Text style={styles.label}>Contractor Type</Text>
//           <DropDownPicker
//             open={contractorTypeOpen}
//             value={contractorTypeValue}
//             items={contractorTypeItems}
//             setOpen={setContractorTypeOpen}
//             setValue={setContractorTypeValue}
//             setItems={setContractorTypeItems}
//             placeholder="Select the contractor type"
//             style={styles.dropdown}
//             dropDownContainerStyle={styles.dropdownContainer}
//             zIndex={3000}
//             zIndexInverse={1000}
//           />

//           {/* Contractor Dropdown */}
//           <Text style={styles.label}>Contractor</Text>
//           <DropDownPicker
//             open={contractorOpen}
//             value={contractorValue}
//             items={contractorItems}
//             setOpen={setContractorOpen}
//             setValue={setContractorValue}
//             setItems={setContractorItems}
//             placeholder="Select Contractor"
//             style={styles.dropdown}
//             dropDownContainerStyle={styles.dropdownContainer}
//             disabled={!contractorTypeValue}
//             zIndex={2000}
//             zIndexInverse={2000}
//           />

//           {/* Assign Task Dropdown */}
//           <Text style={styles.label}>Assign Task</Text>
//           <DropDownPicker
//             open={taskOpen}
//             value={taskValue}
//             items={taskItems}
//             setOpen={setTaskOpen}
//             setValue={setTaskValue}
//             setItems={setTaskItems}
//             placeholder="Select Task"
//             style={styles.dropdown}
//             dropDownContainerStyle={styles.dropdownContainer}
//             zIndex={1000}
//             zIndexInverse={3000}
//           />

//           {/* Finish Button */}
//           <TouchableOpacity style={styles.finishButton}>
//             <Text style={styles.finishButtonText}>Finish Project Setup</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   AreaContainer: {
//     flex: 1,
//     padding: 5,
//     marginTop: 20,
//     width: "100%",
//   },
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   mainHeading: {
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "left",
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 10,
//     fontWeight: "bold",
//   },
//   dropdown: {
//     marginBottom: 15,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     height: 50,
//   },
//   dropdownContainer: {
//     borderColor: "#ccc",
//   },
//   finishButton: {
//     marginTop: 20,
//     width: "60%",
//     margin: "auto",
//     backgroundColor: "#A9A9A9",
//     padding: 15,
//     borderRadius: 15,
//     alignItems: "center",
//   },
//   finishButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// export default AssignContractors;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { fetchSubContractors } from "../../src/services/subContractorService";
import { fetchUsers } from "../../src/services/userService";
// import { fetchProjectById } from "../api/repositories/projectRepository";
import { fetchProjectById } from "../../src/services/projectService";
import useProjectStore from "../../projectStore";
import { useRoute } from "@react-navigation/native";

const AssignContractors = () => {
  const [projectName, setProjectName] = useState(""); // State for project name
  const [contractorTypeOpen, setContractorTypeOpen] = useState(false);
  const [contractorTypeValue, setContractorTypeValue] = useState(null);
  const [contractorTypeItems, setContractorTypeItems] = useState([]);

  const [contractorOpen, setContractorOpen] = useState(false);
  const [contractorValue, setContractorValue] = useState(null);
  const [contractorItems, setContractorItems] = useState([]);

  const [taskOpen, setTaskOpen] = useState(false);
  const [taskValue, setTaskValue] = useState(null);
  const [taskItems, setTaskItems] = useState([]); // Empty initial state for dynamic tasks

  const route = useRoute();
  const projectData =
    route.params?.projectData || useProjectStore((state) => state.projectData);

  // Fetch project details by ID and update the project name and tasks
  useEffect(() => {
    const loadProjectDetails = async () => {
      if (projectData?.id) {
        try {
          const response = await fetchProjectById(projectData.id);
          const projectDetails = response.data;

          // Set project name
          setProjectName(projectDetails.attributes.name);

          // Set tasks dynamically
          const tasks = projectDetails.attributes.tasks?.data || [];
          setTaskItems(
            tasks.map((task) => ({
              label: task.attributes.name,
              value: task.id,
              key: task.id.toString(),
            }))
          );
        } catch (error) {
          console.error("Error fetching project details:", error);
        }
      }
    };

    loadProjectDetails();
  }, [projectData]);

  // Fetch contractor types on mount
  useEffect(() => {
    const loadContractorTypes = async () => {
      try {
        const response = await fetchSubContractors();
        const contractors = response.data ? response.data : response;

        if (!Array.isArray(contractors)) {
          console.error("Unexpected format: contractors is not an array");
          return;
        }

        const types = [
          ...new Set(
            contractors.map((contractor) => contractor.attributes.name)
          ),
        ].map((type, index) => ({
          label: type,
          value: type.toLowerCase(),
          key: `type-${index}`,
        }));

        setContractorTypeItems(types);
      } catch (error) {
        console.error("Error fetching contractor types:", error);
      }
    };

    loadContractorTypes();
  }, []);

  // Fetch users with "Contractor" designation and display in contractor dropdown
  useEffect(() => {
    const loadContractors = async () => {
      try {
        const users = await fetchUsers();

        const contractors = users.filter(
          (user) => user.designation?.Name === "Contractor"
        );

        setContractorItems(
          contractors.map((user) => ({
            label: user.username,
            value: user.id,
            key: user.id.toString(),
          }))
        );
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    loadContractors();
  }, []);

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.mainHeading}>Assign Contractors</Text>

          {/* Display Project Name */}
          <Text style={styles.projectName}>Project Name: {projectName}</Text>

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
            zIndex={3000}
            zIndexInverse={1000}
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
            disabled={!contractorTypeValue}
            zIndex={2000}
            zIndexInverse={2000}
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
            zIndex={1000}
            zIndexInverse={3000}
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
  projectName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
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
