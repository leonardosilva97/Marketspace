import React from "react";
import {
  MagnifyingGlassMinusIcon,
  ReplayIcon,
  SlidersIcon,
} from "../../../utils/IconsApplication";
import { TouchableOpacity } from "react-native";
import { Box, HStack, Text, useTheme } from "native-base";

type Props = {
  handleFilter: () => void;
  handleSearch: () => void;
  filter: boolean
};

export function IconFilterAndSlider({ handleFilter, handleSearch, filter = false }: Props) {
  const { colors } = useTheme();
  return (
    <HStack
      w={"24"}
      mr={2}
      h={"100%"}
      justifyContent={"space-around"}
      alignItems={"center"}
    >
      <TouchableOpacity onPress={handleSearch}>
        {
          filter ?
          <MagnifyingGlassMinusIcon color={colors.gray[700]} size={"30px"} />
          :
          <ReplayIcon color={colors.gray[700]} size={"30px"} />
        }
        </TouchableOpacity>    
      <Box borderWidth={1} h={"60%"} borderColor={"gray.400:alpha.50"}></Box>
      <TouchableOpacity onPress={handleFilter}>
        <SlidersIcon color={colors.gray[700]} size={"30px"} />
      </TouchableOpacity>
    </HStack>
  );
}
