import { useContext } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { useTheme } from "native-base";

import { useAuth } from "../hooks/useAuth";

import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";
import { Loading } from "../components/Atomic/Atoms/Loading";

export function Routes() {
  const { colors } = useTheme();
  const { user, isLoadingUserStorageData } = useAuth();
  const theme = DefaultTheme;
  theme.colors.background = colors.gray[200];

  console.log("usuario Loagado", user);

  if (isLoadingUserStorageData) {
    return <Loading />;
  }

  return (
    <NavigationContainer theme={theme}>
      {user.id ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}
