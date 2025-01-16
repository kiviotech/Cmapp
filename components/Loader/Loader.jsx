import React from "react";
import { ActivityIndicator, View, Image } from "react-native";
import icons from "../../constants/icons";

const Loader = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
      }}
    >
      <Image
        source={icons.loginHouse}
        style={{ width: "100%", height: "100vh", opacity: 0.5 }}
      />
      <Image
        source={icons.title}
        style={{
          width: "90%",
          height: 150,
          marginBottom: 20,
          position: "absolute",
        }}
        resizeMode="contain"
      />
    </View>
  );
};

export default Loader;
