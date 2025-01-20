import React, { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, Text, View } from "react-native";
import { getAuthenticatedUserWithPopulate } from "../../src/api/repositories/userRepository";
import Contractor from "./contractor/Contractor";
import ProjectTeam from "./projectTeam/ProjectTeam";
import useAuthStore from "../../useAuthStore";
import colors from "../../constants/colors";
import NotFound from "./NotFound";

const useRoleComponent = (designation) => {
  switch (designation) {
    case "Contractor":
      return <Contractor />;
    case "Project Manager":
      return <ProjectTeam />;
    case "Project Supervisor":
      return <ProjectTeam />;
    case "Site Supervisor":
      return <ProjectTeam />;
  }
};

const Dashboard = () => {
  const { user, token, designation, role, projects, tasks, permissions } =
    useAuthStore();

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
