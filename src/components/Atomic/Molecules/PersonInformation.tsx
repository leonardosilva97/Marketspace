import { Box, HStack, Text, VStack } from "native-base";
import React from "react";
import { ImageUser } from "../Atoms/ImageUser";

type Props = {
  name: string;
  text?: boolean;
  image: string;
  height: string;
  width: string;
  bold?: boolean;
};

export function PersonInformation({
  name,
  text = true,
  image,
  height,
  width,
  bold = true,
}: Props) {
  return (
    <HStack space={2} alignItems={"center"}>
      <Box h={height} w={width}>
        <ImageUser image={image} sendPhoto={false} />
      </Box>
      <VStack space={0.5}>
        {text ? <Text color={"gray.700"}>Boas Víndas,</Text> : null}
        {bold ? (
          <Text color={"gray.700"} fontWeight={"bold"} fontSize={"md"}>
            {name}!
          </Text>
        ) : (
          <Text color={"gray.700"} fontSize={"md"}>
            {name}
          </Text>
        )}
      </VStack>
    </HStack>
  );
}
