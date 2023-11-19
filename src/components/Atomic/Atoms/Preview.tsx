import { Box, Center, Text } from "native-base";
import React from "react";

export function Preview() {
  return (
    <Center
      safeArea
      flex={1}
      w={"full"}
      position={"absolute"}
      top={0}
      h={"32"}
      bg={"blue.500"}
    >
      <Text fontSize={20} bold color={"white"}>
        Pré visualização de anúncio
      </Text>
      <Text fontSize={"md"} color={"white"}>
        É assim que seu produto vai aparecer!
      </Text>
    </Center>
  );
}
