import { Box, useTheme } from "native-base";
import React from "react";
import { PlusIcon } from "../../../utils/IconsApplication";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

type Props = {} & TouchableOpacityProps;

export function AdImageOfProduct({ ...rest }: Props) {
  const { colors } = useTheme();
  return (
    <Box w={"100px"} h={"100px"} bg={"gray.300"} rounded={"md"}>
      <TouchableOpacity
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
        {...rest}
      >
        <PlusIcon color={colors.gray[400]} size={"25px"} />
      </TouchableOpacity>
    </Box>
  );
}
