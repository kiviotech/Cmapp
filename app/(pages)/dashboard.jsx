import React, { useEffect } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import useAuthStore from "../../useAuthStore";
import Contractor from "./contractor/Contractor";
import ProjectTeam from "./projectTeam/ProjectTeam";
import colors from "../../constants/colors";

const useRoleComponent = (designation) => {
  switch (designation) {
    case "Contractor":
      return <Contractor />;
    case "Project Manager":
    case "Project Supervisor":
    case "Site Supervisor":
      return <ProjectTeam />;
    default:
      return null;
  }
};

const Dashboard = () => {
  const router = useRouter();
  const { user, designation } = useAuthStore();

  // Redirect to login if token is missing
  useEffect(() => {
    if (!user?.token) {
      router.replace("(auth)/login");
    }
  }, [user?.token, router]);

  return (
    <SafeAreaView style={styles.container}>
      {useRoleComponent(designation)}
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
