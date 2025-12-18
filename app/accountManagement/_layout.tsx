import { Stack } from "expo-router";

export default function () {
  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="forgotPassword" />
      <Stack.Screen name="CreateCompany" />
      <Stack.Screen name="ExistingCompany" />
      <Stack.Screen name="CompanyDashboard" />
    </Stack>
  );
}
