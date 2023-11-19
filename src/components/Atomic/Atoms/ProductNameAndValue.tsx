import { HStack, Text } from "native-base";
import React from "react";
import { Value } from "./Value";

type Props = {
  nameProduct: string;
  value: string;
};

export function ProductNameAndValue({ nameProduct, value }: Props) {
  return (
    <HStack mt={2} justifyContent={"space-between"} alignItems={"center"}>
      <Text bold fontSize={20} letterSpacing={1}>
        {nameProduct}
      </Text>
      <Value value={value} color="blue.500" sizeLG="lg" sizeXS="xs" />
    </HStack>
  );
}
