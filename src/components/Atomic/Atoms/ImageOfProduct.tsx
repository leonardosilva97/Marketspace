import { Box, Image, Skeleton, Pressable } from "native-base";
import React from "react";

type Props = {
  image: string;
  onVisualization: () => void;
};

export function ImageOfProduct({ image, onVisualization }: Props) {
  return (
    <Pressable w={"100px"} h={"100px"} rounded={"md"} onPress={onVisualization}>
      {image ? (
        <Image
          src={image}
          w={"100%"}
          h={"100%"}
          rounded={"md"}
          alt="image of ad"
        />
      ) : (
        <Skeleton w={"100%"} h={"100%"} rounded={"md"} />
      )}
    </Pressable>
  );
}
