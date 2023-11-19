import { Box, HStack, Image, Text, VStack } from "native-base";
import React from "react";
import { ImageUser } from "../Atoms/ImageUser";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { api } from "../../../service/api";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  image?: string;
  user?: string
  name: string;
  price: string | undefined;
  is_new: boolean;
  is_active?: boolean;
  myAd?: boolean;
} & TouchableOpacityProps;

export function CardForListOfAnnouncements({
  image,
  name,
  price,
  user,
  is_new = false,
  is_active = true,
  myAd = true,
  ...rest
}: Props) {
  return (
    <Box w={"165px"}>
      <TouchableOpacity {...rest}>
        <Box w={"165px"} h={"110px"} position={"relative"} rounded={"lg"}>
          <Image
            src={`${api.defaults.baseURL}/images/${image}`}
            alt="imagem"
            w={"100%"}
            h={"100%"}
            rounded={"md"}
          />
          {is_active === false ? 
          <LinearGradient
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              justifyContent: "flex-end",
              alignItems: "flex-start",
            }}
              colors={["rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0.5)"]}
            >
              <Text color={"white"} ml={2} mb={2} bold fontSize={12}>AÚNCIO DESATIVADO</Text>
          </LinearGradient>
          : null} 
          <HStack
            position={"absolute"}
            w={"100%"}
            h={"30%"}
            justifyContent={"space-between"}
            alignItems={"center"}
            mt={1}
          >
            {myAd ? (
              <Box h={8} w={8} ml={1}>
                <ImageUser
                  colorBorder
                  image={`${api.defaults.baseURL}/images/${user}`}
                  sendPhoto={false}
                />
              </Box>
            ) : (
              <Text></Text>
            )}
            <Box
              h={"22px"}
              w={"60px"}
              justifyContent={"center"}
              alignItems={"center"}
              rounded={"lg"}
              bg={is_new ? "blue.500" : "gray.700"}
              mb={2}
              mr={1}
            >
              <Text color={"white"} fontSize={"sm"} alignSelf={"center"}>
                {is_new ? "Novo" : "Usado"}
              </Text>
            </Box>
          </HStack>
        </Box>
        <VStack>
          <Text color={ is_active ? "gray.700" : "gray.400"} fontSize={"md"}>
            {name}
          </Text>
          <Text 
            color={ is_active ? "gray.700" : "gray.400"} 
            fontWeight={ is_active ? "bold" : "normal"} 
            fontSize={20}
            >
              R$ {price}
          </Text>
        </VStack>
      </TouchableOpacity>
    </Box>
  );
}
