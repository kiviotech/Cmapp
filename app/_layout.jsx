import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { ToastProvider } from './ToastContext';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  WorkSans_400Regular,
  WorkSans_500Medium,
  WorkSans_600SemiBold,
  WorkSans_700Bold,
} from '@expo-google-fonts/work-sans';

const Layout = () => {
  const [fontsLoaded, error] = useFonts({
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
    "Montserrat": require("../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
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
    if (error) {
      throw error;
    }

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  return (
    <ToastProvider>
      <Stack>
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/SignUp" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/Wait" options={{ headerShown: false }} />
        <Stack.Screen
          name="(pages)/dashboard"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(pages)/taskDetails"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(pages)/uploadProof"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="(pages)/profile" options={{ headerShown: false }} />
        <Stack.Screen
          name="(pages)/settings"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(pages)/notification"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(pages)/notificationDetails"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(pages)/submissionDetails"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </ToastProvider>
  );
};
export default Layout;