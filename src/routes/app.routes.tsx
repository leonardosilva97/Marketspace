import { useTheme } from "native-base";
import React from "react";

import { CustomTabBar } from "../components/Atomic/Molecules/CustomTabBar";

import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";

import { Home } from "../screens/Home";
import { MyAds } from "../screens/MyAds";
import { ViewAd } from "../screens/ViewAd";
import { CreateAd } from "../screens/CreateAd";

export type AppRoutes = {
  Home: undefined;
  MyAds: undefined;
  ViewAd: { type?: string; idParams?: string; idEdit?: string };
  CreateAd: {idParams?: string};
};

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes() {
  const { sizes, colors } = useTheme();
  const iconSize = sizes[8];
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Screen name="Home" component={Home} />
      <Screen name="MyAds" component={MyAds} />
      <Screen name="ViewAd" component={ViewAd} />
      <Screen name="CreateAd" component={CreateAd} />
    </Navigator>
  );
}
