import React, { useState } from "react";
import { XIcon } from "../../../utils/IconsApplication";
import { Box, Center, HStack, Text, useTheme } from "native-base";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

type Props = {
  type: string;
  pressed: boolean;
} & TouchableOpacityProps;

export function Badge({ type, pressed, ...rest }: Props) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={{
        maxWidth: 90,
        height: 28,
      }}
      {...rest}
    >
      <HStack
        w={"100%"}
        h={"100%"}
        rounded={"full"}
        justifyContent={pressed ? "space-around" : "center"}
        alignItems={"center"}
        bg={pressed ? "blue.500" : "gray.300"}
      >
        <Text></Text>
        <Text
          ml={pressed ? 3 : 0}
          mb={pressed ? 1 : 1}
          color={pressed ? "white" : "gray.500"}
          fontSize={"md"}
          bold
        >
          {type}
        </Text>
        {pressed && (
          <Box
            mr={2}
            h={"100%"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Center rounded={"full"} h={"12px"} w={"12px"} bg={"gray.100"}>
              <XIcon color={colors.blue[500]} size={"10px"} />
            </Center>
          </Box>
        )}
      </HStack>
    </TouchableOpacity>
  );
}
