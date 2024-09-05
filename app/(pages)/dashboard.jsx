import React, { useEffect, useState } from "react";
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
import icons from "../../constants/icons";
import BottomNavigation from "./BottomNavigation ";
import SubtaskCard from "../../components/SubtaskCard";
import SelectYourProjectCard from "../../components/SelectYourProjectCard";
import UpcommingAppointments from "../../components/UpcommingAppointmentsCard/UpcommingAppointments";
import { useNavigation } from "@react-navigation/native"; // Import the hook
import CustomHomePageCard from "../../components/CustomHomePageCard/CustomHomePageCard";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import { getProjects } from "../../src/api/repositories/projectRepository";
import { getTasks } from "../../src/api/repositories/taskRepository";

const dashboard = () => {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const navigation = useNavigation(); // Use the hook to get navigation object
  const [projectsDetail, setProjectsDetail] = useState([]);
  const [tasksDetail, setTasksDetail] = useState([]);


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectData = await getProjects();

        setProjectsDetail(projectData.data.data);

        const taskData = await getTasks();
        setTasksDetail(taskData.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProjects();
  }, []);

  console.log("Projects Detail:", projectsDetail);
  console.log("Tasks Detail:", tasksDetail);

  const completedTasks = tasksDetail.filter(
    (task) => task.attributes.status === "completed"
  );

  const notCompletedTasks = tasksDetail?.filter(
    (task) =>
      task.attributes.status === "not_completed" ||
      task.attributes.status === "rejected"
  );


  const cardDataArray = [
    {
      projectName: "Survey and Marking",
      projectDescription:
        "Ensure survey accuracy by cross-referencing multiple points. Verify site layout against survey plans.",
      deadline: Date.now(),
      taskStatus: "Task Completed",
      taskStatusColor: "#A3D65C",
      cardColor: "#EEF7E0",
      status: "",
    },
    {
      projectName: "Verification & Inspection",
      projectDescription:
        "Regular site walkthroughs to ensure compliance with safety regulations and quality standards.",
      deadline: Date.now(),
      taskStatus: "Rejected",
      taskStatusColor: "#FC5275",
      cardColor: "#FED5DD",
      status: "rejected",
    },
    {
      projectName: "Verification & Inspection",
      projectDescription:
        "Regular site walkthroughs to ensure compliance with safety regulations and quality standards.",
      deadline: Date.now(),
      taskStatus: "Upload your Proof of work",
      taskStatusColor: "blue",
      cardColor: "#FFFFFF",
      status: "uploading",
    },
    {
      projectName: "Verification & Inspection",
      projectDescription:
        "Regular site walkthroughs to ensure compliance with safety regulations and quality standards.",
      deadline: Date.now(),
      taskStatus: "Pending Approval",
      taskStatusColor: "#7B7B7B",
      cardColor: "#FFFFFF",
      rejected: true,
      status: "uploaded",
    },
  ];

  const yourProject = [
    {
      name: "Project 1",
      desc: "Description Over view",
      update: "Ongoing: Phase - I",
      deadline: "Ahead of Schedule",
      cardColor: "#EEF7E0",
      active: true,
    },
    {
      name: "Project 1",
      desc: "Description Over view",
      update: "Ongoing: Phase - I",
      deadline: "Ahead of Schedule",
      cardColor: "#FFFFFF",
      active: true,
    },
  ];

  const subTask = [
    {
      task: "Tesk-1",
      proName: "Project Name",
      deadline: "Done by 22nd August, 2022",
    },
    {
      task: "Tesk-1",
      proName: "Project Name",
      deadline: "Done by 22nd August, 2022",
    },
  ];
  const upcomingAppointemntArr = [
    {
      name: "Inspection",
      proName: "Project Name",
      deadline: "Mon, 10 July 2022",
      time: "9 AM - 10:30 AM",
    },
    {
      name: "Inspection",
      task: "Inspection",
      proName: "Project Name",
      deadline: "Mon, 10 July 2022",
      time: "9 AM - 10:30 AM",
    },
  ];
  const handleSearchPress = () => {
    setSearchVisible(!isSearchVisible);
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Image source={icons.user1} style={styles.profileImage} />
          <View>
            <Text style={styles.userName}>Dan Smith</Text>
            <Text style={styles.greeting}>Project Supervisor</Text>
          </View>
          <View style={styles.iconsContainer}>
            <TouchableOpacity style={styles.icon} onPress={handleSearchPress}>
              <Image source={icons.search} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("(pages)/notification")}
              style={styles.icon}
            >
              <Image source={icons.bell} />
            </TouchableOpacity>
          </View>
        </View>

        {isSearchVisible && (
          <View style={styles.searchBarContainer}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search..."
              placeholderTextColor="#999"
            />
          </View>
        )}


        <Text style={styles.title}>Select Your Project</Text>

        {/* Horizontal ScrollView for the Carousel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.carousel}
        >
          {projectsDetail.map((project, index) => (
            <View key={index} style={styles.cardWrapper}>
              <SelectYourProjectCard
                cardValue={{
                  name: project.attributes.name,
                  desc: project.attributes.description,
                  update: project.attributes.update_status,
                  deadline: project.attributes.deadline,
                }}
              />
            </View>
          ))}
        </ScrollView>

        <Text style={styles.projectitle}>
          {projectsDetail.length > 0
            ? projectsDetail[0].attributes.name
            : "Project"}
        </Text>
        <View
          style={{
            flexDirection: "row",
            paddingLeft: 0,
            paddingBottom: 10,
            marginTop: 10,
            alignItems: "center",
          }}
        >
          <View>
            <Text style={styles.userName}>Recent Milestones</Text>
            <Text style={[styles.greeting, { paddingTop: 5 }]}>
              {completedTasks.length} Tasks Done
            </Text>
          </View>
          <View style={styles.iconsContainer}>
            <TouchableOpacity style={styles.icon}>
              <Image source={icons.filters} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.yourProjectCOntainer}>
          {/* {subTask.map((cardData, index) => (
            <SubtaskCard
              key={index}
              cardValue={cardData}
              cardColor={cardData.cardColor}
            />
          ))} */}
          {completedTasks.map((cardData, index) => {
            return <SubtaskCard key={index} cardValue={cardData} />;
          })}
        </View>

        <View
          style={{
            flexDirection: "row",
            paddingLeft: 10,
            paddingBottom: 40,
            paddingTop: 30,
            alignItems: "center",
          }}
        >
          <View>
            <Text style={styles.userName}>Upcoming Milestones</Text>
            <Text style={[styles.greeting, { paddingTop: 5 }]}>
              {notCompletedTasks.length} Tasks Pending
            </Text>
          </View>
          <View style={styles.iconsContainer}>
            <TouchableOpacity style={styles.icon}>
              <Image source={icons.filters} />
            </TouchableOpacity>
          </View>
        </View>

        {notCompletedTasks.map((cardData, index) => (
          <CustomHomePageCard
            key={index}
            cardValue={cardData}
          />
        ))}

        {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
                    {yourProject.map((cardData, index) => (
                        <View key={index} style={styles.cardWrapper}>
                            <SelectYourProjectCard
                                cardValue={cardData}
                                cardColor={cardData.cardColor}
                            />
                        </View>
                    ))}
                </ScrollView> */}
        <View>
          <Text style={styles.projectitle}>Upcoming Appointments</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={[styles.carousel, { marginTop: -5 }]}
          >
            {upcomingAppointemntArr.map((cardData, index) => (
              <View key={index} style={styles.cardWrapper}>
                <UpcommingAppointments
                  key={index}
                  cardValue={cardData}
                  cardColor={cardData.cardColor}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        <BottomNavigation />
      </SafeAreaView>
    </ScrollView>
  );
};

export default dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.background,
    paddingBottom: 45,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    paddingBottom: 20,
  },
  searchBarContainer: {
    padding: 10,
    marginTop: -10,
    marginBottom: 10,
    backgroundColor: colors.whiteColor,
    borderRadius: 10,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  searchBar: {
    height: 40,
    width: "100%",
    borderColor: colors.borderColor,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: colors.whiteColor,
  },
  projectitle: {
    color: "#000",
    fontFamily: fonts.WorkSans600,
    fontSize: 26,
    marginTop: 20,
  },
  title: {
    color: "#000",
    fontFamily: fonts.WorkSans600,
    fontSize: 26,
    marginTop: 40,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  greeting: {
    fontSize: 12,
    color: "#577CFF",
    fontFamily: fonts.WorkSans400,
  },
  userName: {
    color: "#000B23",
    fontSize: 20,
    fontFamily: fonts.WorkSans600,
  },
  iconsContainer: {
    flexDirection: "row",
    marginLeft: "auto",
  },
  icon: {
    marginLeft: 15,
    borderColor: colors.borderColor,
    borderRadius: "100%",
    borderWidth: 1,
    padding: 10,
  },

  carousel: {
    marginTop: 20,
    borderColor: colors.borderColor,
    borderBottomWidth: 1,
    borderRadius: 5,
    paddingBottom: 20,
  },
  cardWrapper: {
    marginRight: 15, // Adjust the space between the cards
  },
  cardStyle: {
    marginRight: 15,
  },
});
