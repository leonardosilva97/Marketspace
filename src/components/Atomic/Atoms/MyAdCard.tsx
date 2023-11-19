import { Box, HStack, Text, VStack, useTheme } from "native-base";
import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

import { TagIcon, ArrowRightIcon } from "../../../utils/IconsApplication";

type Props = {
  activeAds: string;
} & TouchableOpacityProps;

export function MyAdCard({ activeAds, ...rest }: Props) {
  const { colors, sizes } = useTheme();
  const iconSize = sizes[6];
  return (
    <TouchableOpacity {...rest}>
      <HStack
        justifyContent={"space-around"}
        alignItems={"center"}
        bg={"blue.500:alpha.10"}
        h={"20"}
        rounded={"lg"}
      >
        <HStack alignItems={"center"} space={4}>
          <TagIcon color={colors.blue[500]} size={"30px"} />

          <Box h={"100%"}>
            <Text fontSize="24" fontWeight="bold">
              {activeAds}
            </Text>
            <Text>anúncios ativos</Text>
          </Box>
        </HStack>

        <HStack space={2} alignItems={"center"}>
          <Text color={"blue.500"} fontWeight={"bold"}>
            Meus anúncios
          </Text>
          <ArrowRightIcon color={colors.blue[500]} size={"20px"} />
        </HStack>
      </HStack>
    </TouchableOpacity>
  );
}
