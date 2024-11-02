import React, { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, Text, View } from "react-native";
import { getAuthenticatedUserWithPopulate } from "../../src/api/repositories/userRepository";
import Contractor from "./contractor/Contractor";
import ProjectTeam from "./projectTeam/ProjectTeam";
import useAuthStore from "../../useAuthStore";
import colors from "../../constants/colors";

const useRoleComponent = (designation) => {
  switch (designation) {
    case "Contractor":
      return <Contractor />;
    case "Project Manager":
      return <ProjectTeam />;
    default:
      return <Contractor />;
  }
};

const Dashboard = () => {
  const { user, designation, role, projects, tasks, permissions } =
    useAuthStore();
  console.log(user, designation, role, projects, tasks, permissions);

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
