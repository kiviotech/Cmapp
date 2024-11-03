// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   SafeAreaView,
//   ScrollView,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { fetchSubmissions } from "../../src/services/submissionService";

// const RequestsScreen = () => {
//   const [activeTab, setActiveTab] = useState("Pending");
//   const [requests, setRequests] = useState([]);
//   const navigation = useNavigation();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetchSubmissions();
//         console.log("Fetched data:", response);

//         if (response && Array.isArray(response.data)) {
//           setRequests(response.data);
//         } else {
//           console.warn(
//             "Fetched data does not contain an array in `data`:",
//             response
//           );
//           setRequests([]);
//         }
//       } catch (error) {
//         console.error("Error fetching submissions:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   const filteredRequests = Array.isArray(requests)
//     ? requests.filter(
//         (request) =>
//           activeTab === "All" ||
//           request.attributes.status === activeTab.toLowerCase()
//       )
//     : [];

//   const renderRequestItem = ({ item }) => (
//     <View style={styles.requestContainer}>
//       <Text style={styles.requestTitle}>
//         {item.attributes.task?.data?.attributes?.title || "No Title"}
//       </Text>
//       <View style={styles.requestRow}>
//         <Text style={styles.requestDescription}>{item.attributes.comment}</Text>
//         <Text
//           style={[
//             styles.requestStatus,
//             styles[
//               `status${
//                 item.attributes.status.charAt(0).toUpperCase() +
//                 item.attributes.status.slice(1)
//               }`
//             ],
//           ]}
//         >
//           {item.attributes.status}
//         </Text>
//       </View>
//       <TouchableOpacity
//         onPress={() =>
//           navigation.navigate("(pages)/RequestDetails", { requestData: item })
//         }
//       >
//         <Text style={styles.viewButton}>View</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.AreaContainer}>
//       <ScrollView>
//         <View style={styles.container}>
//           <Text style={styles.header}>Requests</Text>
//           <View style={styles.tabsContainer}>
//             {["Approved", "Pending", "Declined"].map((tab) => (
//               <TouchableOpacity
//                 key={tab}
//                 style={[styles.tab, activeTab === tab && styles.activeTab]}
//                 onPress={() => setActiveTab(tab)}
//               >
//                 <Text
//                   style={[
//                     styles.tabText,
//                     activeTab === tab && styles.activeTabText,
//                   ]}
//                 >
//                   {tab}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//           <FlatList
//             data={filteredRequests}
//             keyExtractor={(item) => item.id.toString()}
//             renderItem={renderRequestItem}
//             contentContainerStyle={styles.listContent}
//           />
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
//     padding: 16,
//     backgroundColor: "#FFF",
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 16,
//   },
//   tabsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginBottom: 16,
//   },
//   tab: {
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: "#577CFF",
//   },
//   activeTab: {
//     backgroundColor: "#577CFF",
//     borderColor: "#577CFF",
//   },
//   tabText: {
//     color: "#577CFF",
//     fontWeight: "bold",
//   },
//   activeTabText: {
//     color: "#FFFFFF",
//   },
//   listContent: {
//     paddingBottom: 16,
//   },
//   requestContainer: {
//     padding: 16,
//     backgroundColor: "#F8F8F8",
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   requestTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 4,
//   },
//   requestRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   requestDescription: {
//     fontSize: 14,
//     color: "#666",
//   },
//   requestStatus: {
//     fontSize: 14,
//     fontWeight: "bold",
//     marginTop: 30,
//     marginLeft: -50,
//   },
//   statusPending: {
//     color: "#ED8936",
//   },
//   statusApproved: {
//     color: "#38A169",
//   },
//   statusDeclined: {
//     color: "#E53E3E",
//   },
//   viewButton: {
//     color: "#3182CE",
//     fontSize: 14,
//     fontWeight: "bold",
//     marginTop: 8,
//   },
// });

// export default RequestsScreen;

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { fetchSubmissions } from "../../src/services/submissionService";

const RequestsScreen = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [requests, setRequests] = useState([]);
  const navigation = useNavigation();

  // Refetch data every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const response = await fetchSubmissions();
          console.log("Fetched data:", response);

          if (response && Array.isArray(response.data)) {
            setRequests(response.data);
          } else {
            console.warn(
              "Fetched data does not contain an array in `data`:",
              response
            );
            setRequests([]);
          }
        } catch (error) {
          console.error("Error fetching submissions:", error);
        }
      };
      fetchData();
    }, [])
  );

  const filteredRequests = Array.isArray(requests)
    ? requests.filter(
        (request) =>
          activeTab === "All" ||
          request.attributes.status === activeTab.toLowerCase()
      )
    : [];

  const renderRequestItem = ({ item }) => (
    <View style={styles.requestContainer}>
      <Text style={styles.requestTitle}>
        {item.attributes.task?.data?.attributes?.title || "No Title"}
      </Text>
      <View style={styles.requestRow}>
        <Text style={styles.requestDescription}>{item.attributes.comment}</Text>
        <Text
          style={[
            styles.requestStatus,
            styles[
              `status${
                item.attributes.status.charAt(0).toUpperCase() +
                item.attributes.status.slice(1)
              }`
            ],
          ]}
        >
          {item.attributes.status}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("(pages)/RequestDetails", { requestData: item })
        }
      >
        <Text style={styles.viewButton}>View</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.header}>Requests</Text>
          <View style={styles.tabsContainer}>
            {["Approved", "Pending", "Declined"].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <FlatList
            data={filteredRequests}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderRequestItem}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styling remains the same as before
const styles = StyleSheet.create({
  AreaContainer: {
    flex: 1,
    padding: 5,
    marginTop: 20,
    width: "100%",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#577CFF",
  },
  activeTab: {
    backgroundColor: "#577CFF",
    borderColor: "#577CFF",
  },
  tabText: {
    color: "#577CFF",
    fontWeight: "bold",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  listContent: {
    paddingBottom: 16,
  },
  requestContainer: {
    padding: 16,
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    marginBottom: 16,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  requestRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  requestDescription: {
    fontSize: 14,
    color: "#666",
  },
  requestStatus: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 30,
    marginLeft: -50,
  },
  statusPending: {
    color: "#ED8936",
  },
  statusApproved: {
    color: "#38A169",
  },
  statusDeclined: {
    color: "#E53E3E",
  },
  viewButton: {
    color: "#3182CE",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
  },
});

export default RequestsScreen;
