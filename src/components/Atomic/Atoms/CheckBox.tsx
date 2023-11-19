import Checkbox, { CheckboxProps } from "expo-checkbox";
import { HStack, Text } from "native-base";
import React from "react";

type Props = {
  text: string;
} & CheckboxProps;

export function CheckBox({ text, ...rest }: Props) {
  return (
    <HStack>
      <Checkbox
        style={{
          padding: 1,
          alignItems: "center",
          justifyContent: "center",
          height: 28,
          width: 28,
        }}
        {...rest}
      />
      <Text ml={2} fontSize={"md"} bold color={"gray.500"}>
        {text}
      </Text>
    </HStack>
  );
}
