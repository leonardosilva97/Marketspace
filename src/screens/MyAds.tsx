import {
  Box,
  Center,
  FlatList,
  HStack,
  Skeleton,
  Text,
  useTheme,
} from "native-base";
import React, { useState, useEffect } from "react";
import { Back } from "../components/Atomic/Atoms/Back";
import { PlusIcon } from "../utils/IconsApplication";
import { SelectOptions } from "../components/Atomic/Atoms/SelectOptions";
import { CardForListOfAnnouncements } from "../components/Atomic/Molecules/CardForListOfAnnouncements";
import Utils from "../utils/utils";
import { useProduct } from "../hooks/useProduct";

import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "../routes/app.routes";
import { AppError } from "../utils/AppError";
import { ProductInterface } from "../contexts/ProductContext";

const options = [
  { label: "Todos", value: "1" },
  { label: "Ativos", value: "2" },
  { label: "Inativos", value: "3" },
];

const skeleton = [1,2,3,4,5]

function headerComponent() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { colors } = useTheme();
  const [optionsFilter, setOptionsFilter] = useState("1");
  const { annoucimentActive, filterProduct } = useProduct();

  useEffect(() => {
    filterProduct(optionsFilter);
  }, [optionsFilter])

  return (
    <>
      <Back
        left={false}
        right
        title="Meus Anúncios"
        children={<PlusIcon color={colors.gray[700]} size={"25px"} />}
        onPress={() => navigation.navigate("CreateAd", {idParams: "clear"})}
      />

      <HStack
        mt={3}
        mb={6}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Text fontSize={16} color={"gray.500"}>
          {annoucimentActive === "1"
            ? `${annoucimentActive} anúncio`
            : `${annoucimentActive} anúncios`}
        </Text>
        <SelectOptions
          selectedValue={optionsFilter}
          options={options}
          onValueChange={(itemValue) => setOptionsFilter(itemValue)}
        />
      </HStack>
    </>
  );
}

export function MyAds() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const classUtils = Utils.getInstance();
  const { getProducts, userProducts } = useProduct();
  const [products, setProducts] = useState<ProductInterface[]>([])


  async function handleGetMyProduct() {
    try {
      await getProducts({ userProducts: true });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possivel criar a conta. Tente novamente mais tarde";
      classUtils.AlertMessage(title, "red.500");
    }
  }

  useEffect(() => {
    const focused = navigation.addListener("focus", () => {
      setProducts([])
      handleGetMyProduct();
    });
    return focused;
  }, []);



  useEffect(() => {
    console.log("products my ad", userProducts);
    setProducts(userProducts);
  }, [userProducts]);


  function handleVisualizationMyAds(id: string) {
    navigation.navigate("ViewAd", { type: "MyAd", idParams: id });
  }


  return (
    <Box safeArea flex={1} mx={6}>
      {
        products.length ?
        <FlatList
          data={products}
          ListHeaderComponent={headerComponent}
          keyExtractor={(item: ProductInterface) => item.id!}
          renderItem={({ item }) => (
            <CardForListOfAnnouncements
              myAd={false}
              onPress={() => handleVisualizationMyAds(item.id!)}
              is_new={item.is_new}
              is_active={item.is_active}
              image={item.product_images[0].path}
              name={item.name}
              price={item.price.toString()}
            />
          )}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        />
          :
          <FlatList
          data={skeleton}
          ListHeaderComponent={headerComponent}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <HStack space={4}>
              <Skeleton w={"165px"} h={"110px"}/>
              <Skeleton w={"165px"} h={"110px"}/>
            </HStack>
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
  );
}
