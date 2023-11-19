import { Box, Image, Pressable, Skeleton, useTheme } from "native-base";
import React from "react";

import { PencilLineIcon, UserIcon } from "../../../utils/IconsApplication";

type ImageProps = {
  image: string;
  colorBorder?: boolean;
  onImageSelect?: () => void;
  sendPhoto?: boolean;
  photoLoading?: boolean;
};

export function ImageUser({
  image,
  sendPhoto = true,
  colorBorder = false,
  onImageSelect,
  photoLoading = false,
}: ImageProps) {
  const { colors, sizes } = useTheme();
  const iconSize = sizes[4];
  return (
    <Box
      rounded={"full"}
      w={"100%"}
      h={"100%"}
      borderWidth={3}
      borderColor={colorBorder ? "white" : "blue.500"}
      position={"relative"}
      justifyContent={"center"}
      alignItems={"center"}
      bg={colors.gray[200]}
    >
      {photoLoading ? (
        <Skeleton w={"100%"} h={"100%"} rounded={"full"} />
      ) : !image ? (
        <UserIcon size={"60%"} color={colors.gray[400]} />
      ) : (
        <Image
          src={image}
          rounded={"full"}
          alt="Imagem de usuario"
          width={"100%"}
          height={"100%"}
        />
      )}
      {sendPhoto && (
        <Pressable
          position={"absolute"}
          bg={"blue.500"}
          rounded={"full"}
          p={2}
          right={"-10px"}
          bottom={0}
          onPress={onImageSelect}
        >
          <PencilLineIcon size={iconSize} color="white" />
        </Pressable>
      )}
    </Box>
  );
}
