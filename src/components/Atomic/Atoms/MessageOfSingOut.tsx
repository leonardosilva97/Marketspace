import { Box, HStack, Text, useTheme } from "native-base";
import React from "react";
import { Button } from "./Buttom";

type Props = {
  onFunction: () => void;
  text: string;
  title: string;
};

export function MessageOsSingOut({ onFunction, text, title }: Props) {
  const { colors } = useTheme();
  return (
    <Box w="100%" px={4} justifyContent="center" alignItems={"center"} mb={4}>
      <Text
        fontSize="24"
        color="gray.700"
        _dark={{
          color: "gray.300",
        }}
      >
        {title}
      </Text>
      <HStack mt={6} justifyContent={"center"} w={"full"}>
        <Text fontSize={"16"} color={"gray.700"}>
          {text}
        </Text>
      </HStack>
      <Box mt={16} w={"full"}>
        <Button
          colorButtom="red.500"
          colorButtomText="white"
          title="Sair"
          onPress={onFunction}
          _pressed={{
            backgroundColor: colors.red[300],
          }}
        />
      </Box>
    </Box>
  );
}
