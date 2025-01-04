import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useRouter } from "expo-router";
import { NativeWindStyleSheet } from "nativewind";
import CustomButton from "../../components/CustomButton";
import LoginField from "../../components/LoginField";
import FileUpload from "../../components/FileUploading/FileUpload";
import { signup } from "../../src/utils/auth";
import colors from "../../constants/colors";
import { useToast } from "../ToastContext";
import Toast from "../Toast";
import { getProjects } from "../../src/api/repositories/projectRepository";
import { fetchSubContractors } from "../../src/services/subContractorService";
import { getToken } from "../../src/utils/storage";


NativeWindStyleSheet.setOutput({
  default: "native",
});

const SignUp = () => {
  const [selectedProject, setSelectedProject] = useState("");
  const [projectsDetail, setProjectsDetail] = useState([]);
  const [subContractors, setSubContractors] = useState([]);
  const [selectedSubContractor, setSelectedSubContractor] = useState("");
  const [uploadedFileIds, setUploadedFileIds] = useState([]);
  const [isDropdownFocused, setIsDropdownFocused] = useState(false);
  const { toast, showToast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    socialSecurity: "",
    subContractor:""

  });
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleChangeText = (field, value) => {
    setForm({ ...form, [field]: value });

    // Trigger validation for that specific field when the text changes
    const newErrors = validate();
    setErrors(newErrors);
  };

  const handleFileUploadSuccess = async (fileIds) => {
    setUploadedFileIds(fileIds);
    console.log("Uploaded file IDs:", fileIds);
  
    const token = await getToken(); // Assume you have a method to get the auth token
    console.log("the token consoled",token)
  
    try {
      const response = await uploadFile(fileIds, token); // Pass the token here
      console.log("File uploaded successfully:", response);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  
  const validate = () => {
    const newErrors = {};
    if (!form.name) {
      newErrors.name = "Full name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(form.name)) { // Only letters and spaces
      newErrors.name = "Full name should only contain letters and spaces";
    }
  
    // Validate email with a stricter regular expression
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/^[a-zA-Z][a-zA-Z0-9._%+-]*@gmail\.[a-zA-Z]{2,}$/.test(form.email)) {
      // This regex is stricter and handles more valid email formats
      newErrors.email = "Enter a valid email address";
    }
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters long";
    if (!form.socialSecurity)
      newErrors.socialSecurity = "Social Security Number is required";
    else if (form.socialSecurity.length < 6)
      newErrors.socialSecurity = "Enter a valid 6-digit Social Security Number";
    if (!selectedSubContractor)
      newErrors.subContractor = "Subcontractor selection is required";
    if (!uploadedFileIds.length)
      newErrors.contractorLicense = "File is required";
    return newErrors;
  };

  const submit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const { name, email, password, socialSecurity } = form;
      console.log("Data being sent to signup:", {
        name,
        email,
        password,
        socialSecurity,
        uploadedFileIds,
        selectedProject,
        selectedSubContractor,
      });

      const res = await signup(
        name,
        email,
        password,
        socialSecurity,
        uploadedFileIds,
        selectedProject,
        selectedSubContractor
      );

      if (res) {
        showToast("Request for new account sent", "success");
        router.replace("/Wait");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      Alert.alert("Error", error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectData = await getProjects();
        setProjectsDetail(projectData.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const loadSubContractors = async () => {
      try {
        const response = await fetchSubContractors();
        const contractors = response.data.map((contractor) => ({
          label: contractor.attributes.name,
          value: contractor.id,
        }));
        setSubContractors(contractors);
      } catch (error) {
        console.error("Error fetching subcontractors:", error);
      }
    };
    loadSubContractors();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={{ fontSize: 24 }}>Sign Up</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.labelText}>Full name</Text>
            <LoginField
              placeholder="Your full name"
              value={form.name}
              handleChangeText={(e) => handleChangeText("name", e)}
              style={{ marginBottom: 16 }}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            <Text style={[styles.labelText, { marginTop: 32 }]}>E-mail</Text>
            <LoginField
              placeholder="Your email or phone"
              value={form.email}
              handleChangeText={(e) => handleChangeText("email", e)}
              keyboardType="email-address"
              style={{ marginBottom: 16 }}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <View style={styles.passwordContainer}>
              <Text style={styles.labelText}>Password</Text>
              <LoginField
                placeholder="Password"
                value={form.password}
                handleChangeText={(e) => handleChangeText("password", e)}
                secureTextEntry={true}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            <View style={styles.passwordContainer}>
              <Text style={styles.labelText}>Social Security Number</Text>
              <LoginField
                placeholder="Social Security"
                value={form.socialSecurity}
                handleChangeText={(e) => handleChangeText("socialSecurity", e)}
                secureTextEntry={true}
              />
              {errors.socialSecurity && (
                <Text style={styles.errorText}>{errors.socialSecurity}</Text>
              )}
            </View>
          </View>

          <View style={styles.subContractorContainer}>
            <Text style={styles.labelText}>Subcontractor</Text>
            <Dropdown
              data={subContractors}
              labelField="label"
              valueField="value"
              placeholder={!isDropdownFocused ? "Select subcontractor" : ""}
              search
              searchPlaceholder="Search your subcontractor"
              value={selectedSubContractor}
              onFocus={() => setIsDropdownFocused(true)}
              onBlur={() => setIsDropdownFocused(false)}
              onChange={(item) => {
                setSelectedSubContractor(item.value);
                setIsDropdownFocused(false);
              }}
              style={styles.dropdown}
              containerStyle={styles.dropdownContainerStyle}
              searchStyle={styles.searchBox}
            />
            {errors.subContractor && (
              <Text style={styles.errorText}>{errors.subContractor}</Text>
            )}
          </View>

          {/* <View style={styles.projectSelectionContainer}>
            <Text style={styles.labelText}>Project Selection</Text>
            <Dropdown
              data={projectsDetail.map((project) => ({
                label: project.attributes.name,
                value: project.id,
              }))}
              labelField="label"
              valueField="value"
              placeholder={!isDropdownFocused ? "Select project" : "..."}
              search
              searchPlaceholder="Search your project"
              value={selectedProject}
              onFocus={() => setIsDropdownFocused(true)}
              onBlur={() => setIsDropdownFocused(false)}
              onChange={(item) => {
                setSelectedProject(item.value);
                setIsDropdownFocused(false);
              }}
              style={styles.dropdown}
              containerStyle={styles.dropdownContainerStyle}
              searchStyle={styles.searchBox}
            />
            {errors.project && (
              <Text style={styles.errorText}>{errors.project}</Text>
            )}
          </View> */}

          <View>
            <FileUpload
              uploadedFiles={uploadedFileIds}
              setUploadedFiles={setUploadedFileIds}
              onFileUploadSuccess={handleFileUploadSuccess}
            />
            {errors.contractorLicense && (
              <Text style={styles.errorText}>{errors.contractorLicense}</Text>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              buttonStyle={{
                backgroundColor: "#577CFF",
                fontSize: 13,
                width: 140,
                letterSpacing: 1,
              }}
              textStyle={{ color: "#FFFFFF" }}
              text="SIGNUP"
              handlePress={submit}
            />
          </View>

          <View style={styles.SignUpContainer}>
            <Text style={{ fontSize: 12, color: "#9C9C9C" }}>
              Already have an account?{" "}
              <Text
                style={{ color: "#577CFF" }}
                onPress={() => router.replace("/login")}
              >
                Login
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  inputContainer: {
    marginVertical: 20,
  },
  passwordContainer: {
    marginTop: 20,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  labelText: {
    marginBottom: 5,
    color: colors.loginSignUpLabelColor,
    fontSize: 14,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  dropdownContainerStyle: {
    maxHeight: 200,
    overflow: "scroll",
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#B3B3B3",
  },
  searchBox: {
    height: 40,
    borderColor: "#B3B3B3",
    borderWidth: 1,
    borderRadius: 8,
  },
  errorText: {
    color: "red",
    marginTop: 5,
    fontSize: 12,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  SignUpContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 20,
  },
  projectSelectionContainer: {
    marginTop: 32,
  },
});
