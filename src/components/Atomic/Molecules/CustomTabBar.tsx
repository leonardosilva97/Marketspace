import React from "react";
import { useTheme, View, Text, Pressable, Box, useDisclose } from "native-base";
import { AppNavigatorRoutesProps } from "../../../routes/app.routes";

import {
  HouseIcon,
  TagIcon,
  SignOutIcon,
} from "../../../utils/IconsApplication";
import { TouchableOpacity } from "react-native";
import { BottomSheet } from "../Atoms/BottomSheet";
import { MessageOsSingOut } from "../Atoms/MessageOfSingOut";
import { useAuth } from "../../../hooks/useAuth";

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: {
  state: any;
  descriptors: any;
  navigation: AppNavigatorRoutesProps;
}) {
  const excludedRouteNames = ["Logout", "ViewAd", "CreateAd"]; // Definir quais rotas dever ser ecluidas do bottom tabs navigator
  const { sizes, colors } = useTheme();
  const iconSize = sizes[7];
  const { isOpen, onOpen, onClose } = useDisclose();
  const { singOut } = useAuth();

  const isViewHideRoute =
    state.routes[state.index]?.name !== "Home" &&
    state.routes[state.index]?.name !== "MyAds"; // caso a rota ativa seja diferente destas o bottom tabs é ocultado

  if (isViewHideRoute) {
    return null;
  }

  return (
    <Box
      safeArea
      flexDirection={"row"}
      borderBottomWidth={1}
      borderBottomColor={colors.gray[300]}
      alignItems={"center"}
      h={"72px"}
    >
      {state.routes.map((route: any, index: number) => {
        if (excludedRouteNames.includes(route.name)) {
          return null; // Exclude the route from rendering in the tab bar
        }

        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        let iconName;
        if (route.name === "Home") {
          iconName = "home";
        } else if (route.name === "MyAds") {
          iconName = "ads";
        }

        return (
          <Pressable
            key={route.name}
            onPress={() => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
            style={{
              height: "100%",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {iconName === "home" && (
              <Box
                h={"120%"}
                w={"100%"}
                mb={4}
                pb={2}
                justifyContent={"center"}
                alignItems={"center"}
                borderBottomColor={isFocused ? colors.gray[300] : "transparent"}
                borderBottomWidth={4}
              >
                <HouseIcon
                  color={isFocused ? colors.gray[400] : colors.gray[700]}
                  size={iconSize}
                />
              </Box>
            )}
            {iconName === "ads" && (
              <Box
                h={"120%"}
                w={"100%"}
                mb={4}
                pb={2}
                justifyContent={"center"}
                alignItems={"center"}
                borderBottomColor={isFocused ? colors.gray[300] : "transparent"}
                borderBottomWidth={4}
              >
                <TagIcon
                  color={isFocused ? colors.gray[400] : colors.gray[700]}
                  size={iconSize}
                />
              </Box>
            )}
          </Pressable>
        );
      })}

      {/* Logout Tab */}
      <TouchableOpacity
        onPress={onOpen}
        style={{
          height: "100%",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          h={"120%"}
          pb={2}
          mb={4}
          w={"100%"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <SignOutIcon color={colors.red[500]} size={iconSize} />
        </Box>
      </TouchableOpacity>
      <BottomSheet isOpen={isOpen} onClose={onClose}>
        <MessageOsSingOut
          text="Deseja realmente sair do MarketSpace?"
          title="SAIR"
          onFunction={singOut}
        />
      </BottomSheet>
    </Box>
  );
}
