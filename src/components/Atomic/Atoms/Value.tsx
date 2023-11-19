import { Text } from "native-base";
import React from "react";

type Props = {
  value: string;
  color: string;
  sizeXS: string;
  sizeLG: string;
};

export function Value({ value, color, sizeLG, sizeXS }: Props) {
  return (
    <Text bold fontSize={sizeLG} color={color}>
      <Text bold fontSize={sizeXS}>
        R${" "}
      </Text>
      {value}
    </Text>
  );
}
