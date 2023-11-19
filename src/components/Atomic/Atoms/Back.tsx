import { Box, HStack, Text, useTheme } from "native-base";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { ArrowLeftIcon } from "../../../utils/IconsApplication";
import React, { ReactNode } from "react";

type Props = {
  left?: boolean;
  onLeftPress?: () => void; // Handler for left icon press
  right?: boolean;
  onRightPress?: () => void; // Handler for right icon press
  children?: ReactNode;
  title?: string;
} & TouchableOpacityProps;

export function Back({
  left = true,
  onLeftPress,
  right = false,
  onRightPress,
  title,
  children,
  ...rest
}: Props) {
  // ... existing code remains the same
  const { colors } = useTheme();
  return (
    <HStack
      mt={4}
      py={3}
      w={"100%"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      {left ? (
        <Box w={"25px"} h={"25px"}>
          <TouchableOpacity onPress={onLeftPress} {...rest}>
            <ArrowLeftIcon color={colors.gray[700]} size={"25px"} />
          </TouchableOpacity>
        </Box>
      ) : (
        <Text></Text>
      )}
      {title ? (
        <Text fontSize={20} bold>
          {title}
        </Text>
      ) : (
        <Text></Text>
      )}
      {right ? (
        <Box w={"25px"} h={"25px"}>
          <TouchableOpacity onPress={onRightPress} {...rest}>
            {children}
          </TouchableOpacity>
        </Box>
      ) : (
        <Text></Text>
      )}
    </HStack>
  );
}
