import React, { useState, useRef } from "react";
import { Box, Center, HStack, Image, Skeleton, Text, View } from "native-base";
import { Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  name: string;
  uri: string;
  type: string;
};

type imageProps = {
  image: Props[];
  isInative?: boolean;
};

export function AdCarousel({ image, isInative = false }: imageProps) {
  const width = Dimensions.get("window").width;
  const carouselIndicatorWidth = width / image.length; // Adjust this value to fit your needs
  const [activeSlide, setActiveSlide] = useState(0);

  const renderItem = ({ item }: any) =>
    item ? (
      <View
        style={{
          width: width,
          height: 280,
          borderWidth: 1,
          justifyContent: "center",
        }}
      >
        <Image src={item.uri} alt="" w={"100%"} h={"100%"} />
      </View>
    ) : (
      <Skeleton w={"full"} h={280} />
    );

  const renderCarouselIndicator = () => {
    return (
      <HStack space={1}>
        {image.map((item, index) => (
          <Text
            key={item.name}
            borderWidth={3}
            mt={-2}
            h={"1px"}
            borderRadius={5}
            width={carouselIndicatorWidth}
            borderColor={
              index === activeSlide ? "gray.200" : "gray.200:alpha.20"
            }
          ></Text>
        ))}
      </HStack>
    );
  };

  return (
    <Box>
      <Box position={"relative"} w={width} h={280}>
        {image.length ? (
          <>
            <Carousel
              width={width}
              height={280}
              data={image}
              scrollAnimationDuration={1000}
              onSnapToItem={(index) => setActiveSlide(index)}
              renderItem={renderItem}
            />
            {renderCarouselIndicator()}
          </>
        ) : (
          <Skeleton w={"full"} h={280} />
        )}
      </Box>
      {!isInative && (
        <LinearGradient
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
          }}
          colors={["rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0.5)"]}
        >
          <Text color={"white"}>AÚNCIO DESATIVADO</Text>
        </LinearGradient>
      )}
    </Box>
  );
}
