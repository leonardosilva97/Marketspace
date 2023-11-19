import { Text, View, StatusBar } from "react-native";
import { NativeBaseProvider } from "native-base";
import { THEME } from "./src/theme/theme";
import {
  useFonts,
  Karla_400Regular,
  Karla_700Bold,
} from "@expo-google-fonts/karla";
import { Loading } from "./src/components/Atomic/Atoms/Loading";

import { Routes } from "./src/routes";
import { AuthContextProvider } from "./src/contexts/AuthContext";
import { ProductContextProvider } from "./src/contexts/ProductContext";

export default function App() {
  const [fontsLoad] = useFonts({ Karla_400Regular, Karla_700Bold });
  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={"transparent"}
        translucent
      />
      <AuthContextProvider>
        <ProductContextProvider>
          {fontsLoad ? <Routes /> : <Loading />}
        </ProductContextProvider>
      </AuthContextProvider>
    </NativeBaseProvider>
  );
}
