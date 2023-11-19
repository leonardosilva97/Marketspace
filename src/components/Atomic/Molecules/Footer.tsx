import { Box, HStack } from "native-base";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function Footer({ children }: Props) {
  return (
    <HStack
      position={"absolute"}
      bottom={0}
      h={"90px"}
      w={"full"}
      bg={"white"}
      justifyContent={"space-around"}
      alignItems={"center"}
    >
      {children}
    </HStack>
  );
}
