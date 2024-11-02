// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Platform,
//   StyleSheet,
// } from "react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";

// const CrossPlatformDatePicker = ({ label, value, onChange }) => {
//   const [showPicker, setShowPicker] = useState(false);

//   const handleDateChange = (event, selectedDate) => {
//     setShowPicker(false);
//     if (selectedDate) {
//       onChange(selectedDate);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>{label}</Text>
//       {Platform.OS === "web" ? (
//         <input
//           type="date"
//           value={value ? value.toISOString().split("T")[0] : ""}
//           onChange={(e) => onChange(new Date(e.target.value))}
//           style={styles.webDatePicker}
//         />
//       ) : (
//         <>
//           <TouchableOpacity
//             onPress={() => setShowPicker(true)}
//             style={styles.dateButton}
//           >
//             <Text style={styles.dateText}>
//               {value ? value.toLocaleDateString() : "Select Date"}
//             </Text>
//           </TouchableOpacity>
//           {showPicker && (
//             <DateTimePicker
//               value={value || new Date()}
//               mode="date"
//               display="default"
//               onChange={handleDateChange}
//               minimumDate={new Date(2000, 0, 1)}
//               maximumDate={new Date(2100, 11, 31)}
//             />
//           )}
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     color: "#333",
//     marginBottom: 8,
//   },
//   dateButton: {
//     padding: 12,
//     backgroundColor: "#f0f0f0",
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 4,
//   },
//   dateText: {
//     fontSize: 16,
//     color: "#333",
//   },
//   webDatePicker: {
//     padding: 12,
//     fontSize: 16,
//     borderRadius: 4,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     width: "100%",
//   },
// });

// export default CrossPlatformDatePicker;

// CrossPlatformDatePicker.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";

const CrossPlatformDatePicker = ({ label, value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {Platform.OS === "web" ? (
        <input
          type="date"
          value={value ? value.toISOString().split("T")[0] : ""}
          onChange={(e) => onChange(new Date(e.target.value))}
          style={styles.webDatePicker}
        />
      ) : (
        <>
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={styles.dateButton}
          >
            <MaterialIcons name="calendar-today" size={24} color="#1E88E5" />
            <Text style={styles.dateText}>
              {value ? value.toLocaleDateString() : "Select Date"}
            </Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={value || new Date()}
              mode="date"
              display="calendar" // Calendar display for Android/iOS
              onChange={handleDateChange}
              minimumDate={new Date(2000, 0, 1)}
              maximumDate={new Date(2100, 11, 31)}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
    marginBottom: 10,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#ffffff",
    borderColor: "#1E88E5",
    borderWidth: 1,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  dateText: {
    fontSize: 16,
    color: "#1E88E5",
    marginLeft: 10,
    fontWeight: "500",
  },
  webDatePicker: {
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    borderColor: "#1E88E5",
    borderWidth: 1,
    backgroundColor: "#ffffff",
    color: "#333",
    width: "100%",
    outline: "none",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
});

export default CrossPlatformDatePicker;
