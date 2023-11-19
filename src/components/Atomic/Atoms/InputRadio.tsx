import { Box, Radio, Stack } from "native-base";
import React from "react";

type Props = {
  value: string;
  onSetValue: (value: string) => void;
};

export function InputRadio({ onSetValue, value }: Props) {
  return (
    <Box>
      <Radio.Group
        name="exampleGroup"
        defaultValue={value}
        accessibilityLabel="pick a size"
        onChange={(value) => onSetValue(value)}
      >
        <Stack
          direction={{
            base: "row",
            md: "row",
          }}
          alignItems={{
            base: "flex-start",
            md: "center",
          }}
          space={6}
          w="100%"
          maxW="300px"
        >
          <Radio value="1" colorScheme={"blue"} size="md" my={1}>
            Produto novo
          </Radio>
          <Radio value="2" colorScheme={"blue"} size="md" my={1}>
            Produto usado
          </Radio>
        </Stack>
      </Radio.Group>
    </Box>
  );
}
