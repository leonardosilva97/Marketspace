import { Box, Switch, Text, useTheme } from "native-base";
import React from "react";

type Props = {
  isEnabled: boolean;
  toggleSwitch: () => void;
};

export function InputSwitch({ isEnabled, toggleSwitch }: Props) {
  const { colors } = useTheme();
  return (
    <Box>
      <Text bold color={"gray.500"}>
        Aceita troca?
      </Text>
      <Box
        ml={1}
        mt={2}
        w={"24"}
        justifyContent={"center"}
        alignItems={"flex-start"}
      >
        <Box
          w={"45px"}
          justifyContent={"center"}
          alignItems={"center"}
          h={"25px"}
          rounded={"2xl"}
          backgroundColor={isEnabled ? "blue.500" : "gray.300"}
        >
          <Switch
            trackColor={{ false: colors.gray[300], true: colors.blue[500] }}
            thumbColor={colors.white}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </Box>
      </Box>
    </Box>
  );
}
