// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   SafeAreaView,
//   ActivityIndicator,
// } from "react-native";
// import { getProjects } from "../../../src/api/repositories/projectRepository";
// import BottomNavigation from "./BottomNavigation";
// import { useNavigation, useRoute } from "@react-navigation/native";

// const ProjectList = () => {
//   const [projectsDetail, setProjectsDetail] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const navigation = useNavigation();

//   useEffect(() => {
//     let isMounted = true;

//     const fetchProjects = async () => {
//       setIsLoading(true);
//       try {
//         const projectData = await getProjects();
//         if (isMounted && projectData?.data?.data) {
//           const uniqueProjects = Array.from(
//             new Map(
//               projectData.data.data.map((item) => [item.id, item])
//             ).values()
//           );
//           setProjectsDetail(uniqueProjects);
//           console.log(projectsDetail);
//         }
//       } catch (error) {
//         console.error("Error fetching projects:", error);
//         if (isMounted) {
//           setProjectsDetail([]);
//         }
//       } finally {
//         if (isMounted) {
//           setIsLoading(false);
//         }
//       }
//     };

//     fetchProjects();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   const renderProject = ({ item }) => (
//     <View
//       style={{
//         flexDirection: "row",
//         backgroundColor: "#ffffff",
//         borderRadius: 12,
//         padding: 16,
//         marginBottom: 12,
//         shadowColor: "#000",
//         shadowOpacity: 0.1,
//         shadowRadius: 10,
//         shadowOffset: { width: 0, height: 4 },
//         elevation: 5, // Added for Android shadow
//         alignItems: "center",
//         width: "90%",
//         alignSelf: "center",
//       }}
//     >
//       <View
//         style={{
//           width: 6,
//           height: "100%",
//           borderRadius: 4,
//           marginRight: 12,
//           backgroundColor: item.color || "#4A90E2",
//         }}
//       />
//       <View style={{ flex: 1 }}>
//         <Text style={{ fontSize: 14, color: "#999" }}>
//           {item.attributes.user.data.attributes.username}
//         </Text>
//         <Text
//           style={{
//             fontSize: 20,
//             fontWeight: "bold",
//             color: item.color || "#4A90E2",
//             marginVertical: 4,
//           }}
//         >
//           {item.attributes.name}
//         </Text>
//         <Text style={{ fontSize: 14, color: "#4CAF50" }}>
//           Started on {new Date(item.attributes.createdAt).toLocaleDateString()}
//         </Text>
//         <Text
//           style={{
//             fontSize: 14,
//             color: "#FC5275",
//             fontWeight: "500",
//             position: "absolute",
//             right: 16,
//             bottom: 16,
//           }}
//         >
//           Due {new Date(item.attributes.deadline).toLocaleDateString()}
//         </Text>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView
//       style={{ flex: 1, backgroundColor: "#f7f8fc", paddingTop: 20 }}
//     >
//       <View style={{ flex: 1, paddingHorizontal: 16 }}>
//         <Text
//           style={{
//             fontSize: 24,
//             fontWeight: "bold",
//             color: "#1e1e1e",
//             marginBottom: 16,
//           }}
//         >
//           Projects
//         </Text>
//         {isLoading ? (
//           <ActivityIndicator size="large" color="#4A90E2" />
//         ) : (
//           <FlatList
//             data={projectsDetail}
//             keyExtractor={(item) => item.id}
//             renderItem={renderProject}
//             contentContainerStyle={{ paddingBottom: 150 }} // Extra bottom padding for navigation
//             showsVerticalScrollIndicator={false}
//           />
//         )}
//         <TouchableOpacity
//           onPress={() => navigation.navigate("(pages)/ProjectForm")}
//           style={{
//             position: "absolute",
//             bottom: 100, // Extra space above BottomNavigation
//             right: 20, // Positioned on the right
//             backgroundColor: "transparent",
//             borderWidth: 1,
//             borderColor: "#4A90E2",
//             borderRadius: 20,
//             paddingHorizontal: 20,
//             paddingVertical: 10,
//             shadowColor: "#000",
//             shadowOpacity: 0.1,
//             shadowRadius: 5,
//             shadowOffset: { width: 0, height: 2 },
//             elevation: 5,
//           }}
//         >
//           <Text style={{ color: "#4A90E2", fontSize: 16, fontWeight: "500" }}>
//             Add New Project
//           </Text>
//         </TouchableOpacity>
//       </View>
//       <BottomNavigation />
//     </SafeAreaView>
//   );
// };

// export default ProjectList;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { getProjects } from "../../../src/api/repositories/projectRepository";
import BottomNavigation from "./BottomNavigation";
import { useNavigation } from "@react-navigation/native";

const ProjectList = () => {
  const [projectsDetail, setProjectsDetail] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const projectData = await getProjects();
        if (isMounted && projectData?.data?.data) {
          const uniqueProjects = Array.from(
            new Map(
              projectData.data.data.map((item) => [item.id, item])
            ).values()
          );
          setProjectsDetail(uniqueProjects);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        if (isMounted) {
          setProjectsDetail([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const renderProject = ({ item }) => (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
        alignItems: "center",
        width: "90%",
        alignSelf: "center",
      }}
    >
      <View
        style={{
          width: 6,
          height: "100%",
          borderRadius: 4,
          marginRight: 12,
          backgroundColor: item.color || "#4A90E2",
        }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, color: "#999" }}>
          {item.attributes.user?.data?.attributes?.username || "Unknown User"}
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: item.color || "#4A90E2",
            marginVertical: 4,
          }}
        >
          {item.attributes.name || "Unnamed Project"}
        </Text>
        <Text style={{ fontSize: 14, color: "#4CAF50" }}>
          Started on {new Date(item.attributes.createdAt).toLocaleDateString()}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#FC5275",
            fontWeight: "500",
            position: "absolute",
            right: 16,
            bottom: 16,
          }}
        >
          Due {new Date(item.attributes.deadline).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#f7f8fc", paddingTop: 20 }}
    >
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#1e1e1e",
            marginBottom: 16,
          }}
        >
          Projects
        </Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#4A90E2" />
        ) : (
          <FlatList
            data={projectsDetail}
            keyExtractor={(item) => item.id}
            renderItem={renderProject}
            contentContainerStyle={{ paddingBottom: 150 }}
            showsVerticalScrollIndicator={false}
          />
        )}
        <TouchableOpacity
          onPress={() => navigation.navigate("(pages)/ProjectForm")} // Adjusted route name
          style={{
            position: "absolute",
            bottom: 100,
            right: 20,
            backgroundColor: "#4A90E2",
            borderRadius: 20,
            paddingHorizontal: 20,
            paddingVertical: 10,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 5,
            shadowOffset: { width: 0, height: 2 },
            elevation: 5,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "500" }}>
            Add New Project
          </Text>
        </TouchableOpacity>
      </View>
      <BottomNavigation />
    </SafeAreaView>
  );
};

export default ProjectList;
