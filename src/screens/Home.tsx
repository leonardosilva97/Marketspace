import { Box, Text, FlatList, Center, HStack, Skeleton } from "native-base";

import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "../routes/app.routes";

import { CardForListOfAnnouncements } from "../components/Atomic/Molecules/CardForListOfAnnouncements";

import DogSpace from "../assets/dogSpace.svg";
import Search from "../assets/Search.svg";

export type mock = {
  image: string;
  name: string;
  value: string;
  define: string;
};

const ProductPreviewDefaultValues = {
  is_new: true,
  accept_trade: true,
  payment_methods: ["boleto", "card", "cash", "deposit", "pix"],
};

import { HomeHeader } from "../components/Atomic/Molecules/HomeHeader";
import { AppError } from "../utils/AppError";
import Utils from "../utils/utils";
import { useProduct } from "../hooks/useProduct";
import { ProductArrayResponse } from "../contexts/ProductContext";
import { ProductDTO } from "../dtos/ProductDTO";



export function Home() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const classUtils = Utils.getInstance();
  const [exist, setExist] = useState(true)

  const { getProducts, filteredProducts, annoucimentActive, productExist, loadingProduct, handleGetProduct } = useProduct();

  function goToViewAd(id: string) {
    navigation.navigate("ViewAd", { type: "ViewAd", idParams: id });
  }

  async function acountAds() {
    await getProducts({ userProducts: true });
  }



  useEffect(() => {
    const focused = navigation.addListener("focus", () => {
      acountAds();
      handleGetProduct()
    });
    return focused;
  }, []);

  useEffect(() => {
      console.log('produtos', filteredProducts)
      setExist(productExist)

      if(!filteredProducts.length){
        setExist(productExist)
      }
    
  }, [filteredProducts]);

  // useEffect(() => {
  //   console.log('bool', productExist)
  // }, [productExist]);

  function headerCustom(message: string, Icon: React.ReactNode){
    return <>
    <HomeHeader
      annoucimentCountActive={
        annoucimentActive ? annoucimentActive : "0"
      }
    />
    {
      loadingProduct ?
      <Box>
        <HStack justifyContent={'space-around'}>
          <Skeleton rounded={'md'} w={"165px"} h={"110px"}/>
          <Skeleton rounded={'md'} w={"165px"} h={"110px"}/>
        </HStack>
        <HStack mt={4} justifyContent={'space-around'}>
          <Skeleton rounded={'md'} w={"165px"} h={"110px"}/>
          <Skeleton rounded={'md'} w={"165px"} h={"110px"}/>
        </HStack>
      </Box>
      :
      <Center>
        <Text >{message}</Text>
        <Box mt={"5%"}>
          {Icon}
        </Box>
      </Center>
    }
  </>
  }

  return (
    <Box safeArea flex={1}>
      <Box mt={8} mx={6}>
        {
          !exist ?
            headerCustom("Opssss! não encontramos este produto", <DogSpace width={'230'} height={"230"}/>)
          :
          filteredProducts.length == 0 ? headerCustom("Que tal pesquisar algo?", <Search width={'230'} height={"230"}/>) :
          <FlatList
            data={filteredProducts}
            ListHeaderComponent={
              <HomeHeader
                annoucimentCountActive={
                  annoucimentActive ? annoucimentActive : "0"
                }
              />
            }
            keyExtractor={(item: ProductArrayResponse) => item.id!}
            renderItem={({ item }) => (

              <CardForListOfAnnouncements
                onPress={() => goToViewAd(item.id!)}
                is_new={item.is_new}
                name={item.name}
                price={item.price.toString()}
                image={item.product_images[0].path}
                user={item.user.avatar}
                
              />
            )}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          />
        }
      </Box>
    </Box>
  );
}
