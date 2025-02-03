import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { ToastProvider } from "./ToastContext";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
  WorkSans_400Regular,
  WorkSans_500Medium,
  WorkSans_600SemiBold,
  WorkSans_700Bold,
} from "@expo-google-fonts/work-sans";
import { ActivityIndicator, View } from "react-native";
import Loader from "../components/Loader/Loader";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const Layout = ({ user, designation }) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Load fonts
  const [fontsLoaded] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    "Montserrat-Black": require("../assets/fonts/Montserrat/static/Montserrat-Black.ttf"),
    "Montserrat-Regular": require("../assets/fonts/Montserrat/static/Montserrat-Regular.ttf"),
    "Montserrat-Medium": require("../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
    "Montserrat-SemiBold": require("../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    WorkSans_400Regular,
    WorkSans_500Medium,
    WorkSans_600SemiBold,
    WorkSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      setTimeout(() => {
        setInitialLoading(false);
        setIsMounted(true);
      }, 3000);
    }
  }, [fontsLoaded]);

  // useEffect(() => {
  //   if (isMounted && (!user?.token || designation !== "Contractor")) {
  //     router.replace("(auth)/login");
  //   }
  // }, [user, designation, router, isMounted]);

  if (!fontsLoaded || !isMounted || initialLoading) {
    return <Loader />;
  }

  return (
    <ToastProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(auth)/SignUp" />
        <Stack.Screen name="(auth)/Wait" />
        <Stack.Screen name="(auth)/ForgotPassword" />
        <Stack.Screen name="(auth)/ResetPassword" />
        <Stack.Screen name="(auth)/PasswordChangedScreen" />
        {user && user.token && designation === "Contractor" && (
          <ContractorScreens />
        )}
        {user && user.token && designation === "Project Manager" && (
          <ProjectTeamScreens />
        )}
        <Stack.Screen name="index" />
        {/* <Stack.Screen name="notification" options={{ headerShown: false }} />
        <Stack.Screen
          name="NotificationDetails"
          options={{ headerShown: false }}
        /> */}
      </Stack>
    </ToastProvider>
  );
};

const ContractorScreens = () => (
  <>
    <Stack.Screen name="(pages)/taskDetails" />
    <Stack.Screen name="(pages)/uploadProof" />
    <Stack.Screen name="(pages)/contractor/profile" />
    <Stack.Screen name="(pages)/contractor/settings" />
    <Stack.Screen name="(pages)/notification" />
    <Stack.Screen name="(pages)/ChangePassword" />
    <Stack.Screen name="(pages)/notificationDetails" />
    <Stack.Screen name="(pages)/submissionDetails" />
    <Stack.Screen name="(pages)/contractor/ProjectDetails" />
    <Stack.Screen name="(pages)/contractor/PersonalDetailsScreen" />
  </>
);

const ProjectTeamScreens = () => (
  <>
    <Stack.Screen name="(pages)/ChangePassword" />
    <Stack.Screen name="(pages)/Request" />
    <Stack.Screen name="(pages)/AssignContractors" />
    <Stack.Screen name="(pages)/AssignProjectTeam" />
    <Stack.Screen name="(pages)/ProjectForm" />
    <Stack.Screen name="(pages)/TaskRequestDetails" />
    <Stack.Screen name="(pages)/EmailRequestDetails" />
    <Stack.Screen name="(pages)/projectTeam/PersonalDetails" />
    <Stack.Screen name="(pages)/projectTeam/ProfileScreen" />
    <Stack.Screen name="(pages)/projectTeam/Notification" />
    <Stack.Screen name="(pages)/projectTeam/Myactivity" />
    <Stack.Screen name="(pages)/projectTeam/ProjectDetails" />
    <Stack.Screen name="(pages)/projectTeam/ProjectList" />
    <Stack.Screen name="(pages)/InspectionForm" />
  </>
);

export default Layout;
