import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import BottomNavigation from "./BottomNavigation";
import BottomNavigation from "./BottomNavigation ";
import colors from "../../../constants/colors";
import { icons } from "../../../constants";
import fonts from "../../../constants/fonts";
import UploadedFileHIstory from "../../../components/UploadedFileHIstory";
import { getProjects } from "../../../src/api/repositories/projectRepository";
import SelectYourProjectCard from "../../../components/SelectYourProjectCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getTaskByContractorId,
  getTasks,
} from "../../../src/api/repositories/taskRepository";
import useAuthStore from "../../../useAuthStore";
import { fetchContractorsByUserId } from "../../../src/services/contractorService";

const profile = () => {
  const { user, designation } = useAuthStore();

  const [projectsDetail, setProjectsDetail] = useState([]); // to store all user project
  const [tasks, setTasks] = useState([]); // to store tasks per project
  // const [contractorsDetails, setContractorsDetails] = useState([])
  const [uploadedHistory, setUploadedHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const ContractorData = async () => {
      if (user && user.id) {
        try {
          const data = await fetchContractorsByUserId(user.id);

          var filteredData = [];
          if (data.data.length > 0) {
            const contractorId = data.data[0].id; // Assuming one contractor per user
            const projectData = data.data.map(
              (project) => (filteredData = project.attributes.projects.data)
            );
            console.log('data', filteredData);
            setProjectsDetail(filteredData);

            // Fetch tasks for each project ID in selectedProjectId
            const allTasks = [];
            for (const projectId of filteredData) {
              const taskData = await getTaskByContractorId(
                projectId.id,
                contractorId
              );
              const ongoingTasks = taskData.data.data.filter(
                (task) => task.attributes.task_status === "ongoing"
              );
              allTasks.push(...ongoingTasks); // Accumulate tasks for each project
            }
            setTasks(allTasks); // Update tasks state with all fetched tasks

            // Filter tasks with submissions.data > 0
            const tasksWithSubmissions = allTasks.filter(
              (task) => task.attributes.submissions.data.length > 0
            );
            const submissionData = tasksWithSubmissions.map(
              (task) => task.attributes.submissions.data
            );

            setUploadedHistory(tasksWithSubmissions); // Store submission data
          }
        } catch (error) {
          console.error("Error fetching contractor data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    ContractorData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ padding: 10, marginBottom: 30 }}>
        <View>
          <View style={styles.profileImageContiner}>
            <Image style={styles.userImage} source={icons.userProfile}></Image>
          </View>
          <View style={styles.profileDetailSection}>
            <Text style={styles.userName}>
              {user?.username ? user?.username : "Guest"}
            </Text>
            <Text style={[styles.userName, { color: colors.primary }]}>
              {designation ? designation : ""}
            </Text>
          </View>
        </View>

        {uploadedHistory?.map((history, historyIndex) => (
          <View key={historyIndex} style={{ margin: 10 }}>
            <Text style={styles.subTitle}>
              Submissions for{" "}
              {history?.attributes?.standard_task?.data?.attributes?.Name || "N/A"} for{" "}
              {history?.attributes?.project?.data?.attributes?.name || "N/A"}
            </Text>

            {history?.attributes?.submissions?.data?.map((data, dataIndex) => (
              <View key={`${historyIndex}-${dataIndex}`} style={{ marginVertical: 5 }}>
                <Text>
                  {dataIndex+1}. Status: {data?.attributes?.status || "N/A"}
                </Text>
                <Text>
                  Comments: {data?.attributes?.comment || "No comments"}
                </Text>
                <Text>
                  Submitted on: {data?.attributes?.createdAt?.slice(0, 10) || "N/A"}
                </Text>

                {data?.attributes?.proofOfWork?.map((file, fileIndex) => (
                  <TouchableOpacity
                    key={`${historyIndex}-${dataIndex}-${fileIndex}`}
                    style={styles.fileRow}
                    onPress={() => Linking.openURL(file?.url || "#")}
                  >
                    <FontAwesome name="file" size={24} color={colors.primary} />
                    <Text style={styles.fileName}>{file?.fileName || "File"}</Text>
                    <FontAwesome
                      name="download"
                      size={15}
                      color={colors.downloadIconColor}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        ))}
        {/* <UploadedFileHIstory historyData={uploadedHistory} /> */}

        <View style={{ marginTop: 20,  }}>
          <Text
            style={{
              fontSize: 20,
              letterSpacing: 0.8,
              color: colors.blackColor,
              paddingLeft: 10,
            }}
          >
            Your Projects
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.carousel}
          >
            {projectsDetail?.map((project, index) => (
              <View key={index} style={styles.cardWrapper}>
                <SelectYourProjectCard
                  cardValue={{
                    id: project.id,
                    name: project.attributes.name,
                    desc: project.attributes.description,
                    update: project.attributes.project_status,
                    deadline: project.attributes.end_date,
                  }}
                />
              </View>
            ))}
          </ScrollView>
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

    backgroundColor: colors.background,
    paddingBottom: 45,
  },
  profileImageContiner: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  userImage: {
    width: 115,
    height: 115,
    // borderRadius: '100%',
    objectFit: "cover",
  },
  profileDetailSection: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
  },
  userName: {
    color: colors.blackColor,
    // fontFamily: fonts.WorkSans600,
    fontSize: 26,
    letterSpacing: 0.13,
    paddingBottom: 10,
  },
  subTitle: {
    fontSize: 18,
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  fileName: {
    flex: 1,
    fontSize: 14,
    marginLeft: 10,
    // fontFamily: fonts.WorkSans500,
    color: colors.blackColor,
  },
});
