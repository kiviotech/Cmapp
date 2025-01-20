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

const CrossPlatformDatePicker = ({ label, value, onChange, minDate }) => {
  const [showPicker, setShowPicker] = useState(false);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const effectiveMinDate = minDate || today;

  const isValidDate = (date) => date instanceof Date && !isNaN(date.getTime());

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      onChange(selectedDate);
    }else {
      onChange(null); // Handle cleared date case
    }
  };

  const currentDate = new Date();
  const todayString = currentDate.toISOString().split("T")[0]; // To get current date in YYYY-MM-DD format


  const formatDateForWeb = (date) =>
    isValidDate(date) ? date.toISOString().split("T")[0] : "";

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {Platform.OS === "web" ? (
        <input
          type="date"
          value={formatDateForWeb(value)}
          onChange={(e) => onChange(new Date(e.target.value))}
          min={todayString} 
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
              {isValidDate(value)
                ? value.toLocaleDateString()
                : "Select Date"}
            </Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={isValidDate(value) ? value : new Date()} // Default to current date
              mode="date"
              display="calendar"
              onChange={handleDateChange}
              minimumDate={currentDate}
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
    marginBottom: 10,
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
    borderColor: "#000",
    borderWidth: 1,
    backgroundColor: "#ffffff",
    color: "#333",
    width: "100%",
  },
});

export default CrossPlatformDatePicker;