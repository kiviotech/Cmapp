// import React, { useEffect } from "react";
// import { Stack } from "expo-router";
// import { useFonts } from "expo-font";
// import * as SplashScreen from "expo-splash-screen";
// import { ToastProvider } from "./ToastContext";
// import {
//   Inter_400Regular,
//   Inter_500Medium,
//   Inter_600SemiBold,
//   Inter_700Bold,
// } from "@expo-google-fonts/inter";
// import {
//   WorkSans_400Regular,
//   WorkSans_500Medium,
//   WorkSans_600SemiBold,
//   WorkSans_700Bold,
// } from "@expo-google-fonts/work-sans";

// const Layout = () => {
//   const [fontsLoaded, error] = useFonts({
//     "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
//     "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
//     "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
//     "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
//     "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
//     "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
//     "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
//     "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
//     "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
//     "Montserrat-Black": require("../assets/fonts/Montserrat/static/Montserrat-Black.ttf"),
//     "Montserrat-Regular": require("../assets/fonts/Montserrat/static/Montserrat-Regular.ttf"),
//     Montserrat: require("../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
//     "Montserrat-SemiBold": require("../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
//     Inter_400Regular,
//     Inter_500Medium,
//     Inter_600SemiBold,
//     Inter_700Bold,
//     WorkSans_400Regular,
//     WorkSans_500Medium,
//     WorkSans_600SemiBold,
//     WorkSans_700Bold,
//   });

//   useEffect(() => {
//     if (error) {
//       throw error;
//     }

//     if (fontsLoaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [fontsLoaded, error]);

//   if (!fontsLoaded && !error) return null;

//   return (
//     <ToastProvider>
//       <Stack>
//         <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
//         <Stack.Screen name="(auth)/SignUp" options={{ headerShown: false }} />
//         <Stack.Screen name="(auth)/Wait" options={{ headerShown: false }} />
//         <Stack.Screen
//           name="(pages)/dashboard"
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="(pages)/taskDetails"
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="(pages)/uploadProof"
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="(pages)/contractor/profile"
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="(pages)/projectTeam/ProfileScreen"
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="(pages)/contractor/settings"
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="(pages)/notification"
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="(pages)/notificationDetails"
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="(pages)/submissionDetails"
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="(pages)/contractor/ProjectDetails"
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="(pages)/projectTeam/ProjectDetails"
//           options={{ headerShown: false }}
//         />
//         {/* <Stack.Screen
//           name="(pages)/AddTasks"
//           options={{ headerShown: false }}
//         /> */}
//         <Stack.Screen
//           name="(pages)/AssignContractors"
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="(pages)/projectTeam/ProjectList"
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="(pages)/ProjectForm"
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen name="(pages)/Request" options={{ headerShown: false }} />
//         <Stack.Screen
//           name="(pages)/TaskRequestDetails"
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="(pages)/EmailRequestDetails"
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="(pages)/projectTeam/Myactivity"
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="(pages)/contractor/PersonalDetailsScreen"
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="(pages)/projectTeam/PersonalDetails"
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="(pages)/contractor/ChangePasswordScreen"
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="(pages)/projectTeam/ChangePassword"
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="(pages)/projectTeam/Notification"
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen name="index" options={{ headerShown: false }} />
//       </Stack>
//     </ToastProvider>
//   );
// };
// export default Layout;

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

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const Layout = ({ user, designation }) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

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
      setIsMounted(true);
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (isMounted && (!user?.token || designation !== "Contractor")) {
      router.replace("(auth)/login");
    }
  }, [user, designation, router, isMounted]);

  if (!fontsLoaded || !isMounted) return null;

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
    <Stack.Screen name="(pages)/ProjectForm" />
    <Stack.Screen name="(pages)/TaskRequestDetails" />
    <Stack.Screen name="(pages)/EmailRequestDetails" />
    <Stack.Screen name="(pages)/projectTeam/PersonalDetails" />
    <Stack.Screen name="(pages)/projectTeam/ProfileScreen" />
    <Stack.Screen name="(pages)/projectTeam/Notification" />
    <Stack.Screen name="(pages)/projectTeam/Myactivity" />
    <Stack.Screen name="(pages)/projectTeam/ProjectDetails" />
    <Stack.Screen name="(pages)/projectTeam/ProjectList" />
  </>
);

export default Layout;
