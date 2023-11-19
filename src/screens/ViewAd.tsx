import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Center,
  HStack,
  ScrollView,
  Skeleton,
  Text,
  VStack,
  View,
  useTheme,
} from "native-base";
import { AdCarousel } from "../components/Atomic/Atoms/AdCarousel";
import { Back } from "../components/Atomic/Atoms/Back";
import { useNavigation, useRoute } from "@react-navigation/native";
import { PersonInformation } from "../components/Atomic/Molecules/PersonInformation";
import { ProductNameAndValue } from "../components/Atomic/Atoms/ProductNameAndValue";
import { PaymentMethodInformation } from "../components/Atomic/Atoms/PaymentMethodInformation";
import { Value } from "../components/Atomic/Atoms/Value";
import { Button } from "../components/Atomic/Atoms/Buttom";
import Utils from "../utils/utils";

import { useProduct } from "../hooks/useProduct";
import { useAuth } from "../hooks/useAuth";
import { api } from "../service/api";

import IconZap from "../assets/IconZap.svg";
import {
  ArrowLeftIcon,
  PencilLineIcon,
  PowerIcon,
  TrashSimpleIcon,
} from "../utils/IconsApplication";
import { AppNavigatorRoutesProps } from "../routes/app.routes";
import { Footer } from "../components/Atomic/Molecules/Footer";
import { Preview } from "../components/Atomic/Atoms/Preview";
import { AppError } from "../utils/AppError";
import { ProductDTO } from "../dtos/ProductDTO";
import { PaymentMethod } from "../contexts/ProductContext";

type RouteParamsProps = {
  type: string;
  idParams: string;
  idEdit: string;
};

export function ViewAd() {
  const { colors, sizes } = useTheme();
  const { previewProduct, previewimageProduct } = useProduct();
  const [product, setProduct] = useState<ProductDTO>({} as ProductDTO);
  const [productImages, setProductImages] = useState<any[]>([]);
  const [imageUserProduct, setImageUserProduct] = useState("");
  const [productIsActive, setProductIsActive] = useState(false);
  const { user, userAvatar } = useAuth();
  const classUtils = Utils.getInstance();
  const route = useRoute();
  const iconSize = sizes[5];
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRemove, setIsLoadingRemove] = useState(false);
  const [isLoadingInactive, setIsLoadingInactive] = useState(false);
  const [productViewForId, setProductViewForId] = useState<ProductDTO>(
    {} as ProductDTO
  );
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  let { type, idParams, idEdit } = route.params as RouteParamsProps;

  useEffect(() => {
    if (type && type.length > 0) {
      console.log("type route", type);
    }

    if (type === "Publiche") {
      setProduct(previewProduct);
      setProductImages(previewimageProduct);
      setProductIsActive(previewProduct.is_active!);
    }

    if (idParams != "" || idParams != undefined) {
      handleViewProductForID(idParams);
    }


  }, [route.params]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      setProduct({} as ProductDTO);
      setProductImages([]);
      setProductIsActive(false);

    });

    return unsubscribe;
  }, [navigation]);

  function goBack() {
    navigation.navigate(type === "ViewAd" ? "Home" : "MyAds");
  }

  function handleEditAd(id: string) {
    navigation.navigate("CreateAd", {idParams: id});
  }

  async function handleEditPublicheProductForId(id?: string) {
    console.log('produto',product)
    console.log('id', id)
    let json = product;

    json.price = parseInt(product.price);
    console.log(json.price)
    console.log(typeof json.price)
    try {
      setIsLoading(true);

      await api
        .put(`/products/${id}`, json)
        .then(async (response) => {
          console.log("res post produto", response.data);

          await handlePublichePhotoProduct(response.data.id);
        })
        .catch((error) => {
          console.log("erro do try do produto", error);
          const isAppError = error instanceof AppError;
          const title = isAppError
            ? error.message
            : "Não foi possivel editar este produto. Tente novamente mais tarde!";
          classUtils.AlertMessage(title, "red.500");
          setIsLoading(false);
        });
    } catch (error) {
      console.log("erro do try catch", error);
      setIsLoading(false);
    }
  }

  async function handlePublicheProduct() {
    console.log('esse daqui')
    try {
      setIsLoading(true);

      await api
        .post("/products", product)
        .then(async (response) => {
          console.log("res post produto", response?.data);

          await handlePublichePhotoProduct(response.data.id);
        })
        .catch((error) => {
          console.log("erro do try do produto", error);
          const isAppError = error instanceof AppError;
          const title = isAppError
            ? error.message
            : "Não foi possivel criar um produto. Tente novamente mais tarde!";
          classUtils.AlertMessage(title, "red.500");
          setIsLoading(false);
        });
    } catch (error) {
      console.log("erro do try catch", error);
      setIsLoading(false);
    }
  }

  async function handlePublichePhotoProduct(id: string) {
    try {
      setIsLoading(true);

      const formDataPhotoPubliche = new FormData();

      previewimageProduct.forEach((item) => {
        const imageFile = {
          ...item,
          name: user.name + "." + item.name,
        } as any;

        formDataPhotoPubliche.append("images", imageFile);
      });
      formDataPhotoPubliche.append("product_id", id);

      console.log(
        "imagens a serem mandadas para o back",
        formDataPhotoPubliche
      );

      await api
        .post(`/products/images`, formDataPhotoPubliche, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("res post imagem", response.data);

          if (response.data) {
            classUtils.AlertMessage(
              "Seu anúncio foi enviado com sucesso!!!",
              "green.500"
            );
            return navigation.navigate("Home");
          }
        })
        .catch(async (error) => {
          console.log("erro do try da foto", error);
          const isAppError = error instanceof AppError;
          const title = isAppError
            ? error.message
            : "Não foi possivel enviar a imagem do produto. Tente novamente mais tarde!";
          classUtils.AlertMessage(title, "red.500");
          await handleRemoveProduct(id);
        });
    } catch (error) {
      console.log("erro do try catch", error);
    } finally {
      setIsLoading(false);
    }
  }

  function transforImageUser(image: string) {
    setImageUserProduct(`${api.defaults.baseURL}/images/${image}`);
  }

  function transformImageProduct(images: any[], name: string) {
    let imagesAux: any[] = images.map((item, index) => {
      return {
        name: name,
        type: "image/jpg",
        uri: `${api.defaults.baseURL}/images/${item.path}`,
      };
    });

    return imagesAux;
  }

  function getPaymentMethodKeys(payment_methods: PaymentMethod[]) {
    return payment_methods.map((method) => method.key);
  }

  function boBackVerify(id?: string){
    // if(id){
    //   return navigation.navigate("CreateAd", {idParams: id})
    // }
      return navigation.navigate("CreateAd", {idParams: ""})
  }

  async function handleViewProductForID(idParam: string) {
    try {
      await api
        .get(`/products/${idParam}`)
        .then((response) => {
          console.log("response", response?.data);
          let json = JSON.parse(JSON.stringify(response.data));
          let imagesAux = transformImageProduct(
            response.data.product_images,
            response.data.name
          );
          setProductIsActive(response.data.is_active);

          transforImageUser(response.data.user.avatar);
          let paymentMethods = getPaymentMethodKeys(
            response.data.payment_methods
          );
          json.payment_methods = paymentMethods;

          if (imagesAux.length) {
            console.log("imagens", imagesAux);
            setProduct(json);
            setProductImages(imagesAux);
          }
        })
    } catch (error) {
      console.log("erro do try catch", error);
    }
  }

  async function handleRemoveProduct(id: string) {
    setIsLoadingRemove(true);
    try {
      await api
        .delete(`/products/${id}`)
        .then((response) => {
          classUtils.AlertMessage(
            "Anúncio excluido com sucesso !!!",
            "green.500"
          );

          navigation.navigate("MyAds");
        })
        .catch((error) => {
          const isAppError = error instanceof AppError;
          const title = isAppError
            ? error.message
            : "Não foi possivel criar um produto. Tente novamente mais tarde!";
          classUtils.AlertMessage(title, "red.500");
        });
    } catch (error) {
      console.log("erro do try catch", error);
    } finally {
      setIsLoadingRemove(false);
    }
  }

  async function inactivateProduct(id: string) {
    setIsLoadingInactive(true);
    try {
      await api
        .patch(`/products/${id}`, { is_active: !productIsActive })
        .then((response) => {
          classUtils.AlertMessage(
            `Anúncio ${
              product.is_active === true ? "Desativado" : "Reativado"
            } com sucesso !!!`,
            "green.500"
          );
          handleViewProductForID(id);
        })
        .catch((error) => {
          const isAppError = error instanceof AppError;
          const title = isAppError
            ? error.message
            : "Não foi possivel criar um produto. Tente novamente mais tarde!";
          classUtils.AlertMessage(title, "red.500");
        });
    } catch (error) {
      console.log("erro do try catch", error);
    } finally {
      setIsLoadingInactive(false);
    }
  }

  return (
    <Box safeArea position={"relative"}>
      {type === "Publiche" ? <Preview /> : null}
      <ScrollView
        mt={type === "Publiche" ? "26%" : 0}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: type === "ViewAd" || type === "Publiche" ? 124 : 32,
        }}
      >
        {type === "Publiche" ? null : (
          <Box mx={4}>
            <Back
              onLeftPress={goBack}
              onRightPress={() => handleEditAd(idParams)}
              right={type === "MyAd" && true}
              children={
                (type === "MyAd" && product.is_active) && (
                  <PencilLineIcon color={colors.gray[700]} size={"25px"} />
                )
              }
            />
          </Box>
        )}
        {productImages.length ? (
          <AdCarousel image={productImages} isInative={productIsActive} />
        ) : (
          <Skeleton w={"full"} h={280} />
        )}
        <Box mt={4} mx={6}>
          {
            productImages.length ?
          <Box>
            <PersonInformation
              name={
                type === "Publiche"
                  ? user.name
                  : productViewForId && idParams
                  ? productViewForId.name
                  : ""
              }
              image={type === "Publiche" ? userAvatar : imageUserProduct}
              text={false}
              height="8"
              width="8"
              bold={false}
            />
          </Box>
          :
          <Skeleton w={"8"} h={8} rounded={'full'} mt={2} mb={2} />
          }
              {
                productImages.length ?
                <VStack mt={6}>
                  <Center bg={"gray.300"} rounded={"full"} w={"50px"} p={1}>
                    <Text fontSize={"2xs"} bold>
                      {product.is_new === true ? "NOVO" : "USADO"}
                    </Text>
                  </Center>

                  <ProductNameAndValue
                    nameProduct={product.name}
                    value={
                      product ? classUtils.formatMoney(parseInt(product.price)) : "0"
                    }
                  />
                  <VStack>
                    <Text numberOfLines={5} color={"gray.700"} mt={2}>
                      {product.description}
                    </Text>

                    <Text my={6} bold color={"gray.600"}>
                      Aceita troca? {""}
                      <Text fontWeight={"normal"}>
                        {product.accept_trade === true ? "Sim" : "Não"}
                      </Text>
                    </Text>
                    <Text mb={3} bold color={"gray.600"}>
                      Meios de pagamento
                    </Text>
                  </VStack>
                </VStack>
              :
                <Skeleton w={"full"} h={12} />
              }
          {(product && product.payment_methods)! ? (
            <PaymentMethodInformation payment={product.payment_methods} />
          ) : (
            <Skeleton w={"full"} h={40} />
          )}
          {
            productImages.length
            ?
          (type === "MyAd" ? (
            <Box mt={6}>
              <Button
                startIcon={<PowerIcon color="white" size={"15px"} />}
                colorButtom={product.is_active ? "black" : "blue.500"}
                title={
                  product.is_active ? "Desativar anúncio" : "Reativar anúncio"
                }
                colorButtomText="white"
                isLoading={isLoadingInactive}
                onPress={() => inactivateProduct(product.id!)}
                _pressed={{
                  background: product.is_active
                    ? colors.gray[600]
                    : colors.blue[500],
                }}
              />
              <Button
                mt={4}
                startIcon={<TrashSimpleIcon color="black" size={"15px"} />}
                colorButtom="gray.300"
                isLoading={isLoadingRemove}
                title="Excluir anúncio"
                colorButtomText="gray.700"
                onPress={() => handleRemoveProduct(product.id!)}
                _pressed={{
                  background: colors.gray[200],
                }}
              />
            </Box>
          ) : null )
            : 
            <Skeleton w={"full"} h={40} />}
        </Box>
      </ScrollView>
      {type === "ViewAd" ? (
        <Footer>
          {product.price ?
          <>
          <Value value={
            classUtils.formatMoney(parseInt(product.price)) 
            } sizeLG="2xl" sizeXS="md" color="blue.700" />
          <Box w={"169px"}>
            <Button
              startIcon={<IconZap />}
              colorButtom="blue.500"
              title="Entre em contato"
              colorButtomText="white"
              onPress={() => {}}
              _pressed={{
                background: colors.gray[600],
              }}
            />
          </Box>
          </>
          
        :
        <HStack justifyContent={'space-around'} w={'full'} >

          <Skeleton w={150} />
          <Skeleton w={150} />
        </HStack>
        }
        </Footer>
      ) : type === "Publiche" ? (
        <Footer>
          <Box w={"169px"}>
            <Button
              startIcon={
                <ArrowLeftIcon color={colors.gray[700]} size={"25px"} />
              }
              colorButtom="gray.300"
              title="Voltar e editar"
              colorButtomText="gray.500"
              onPress={() => boBackVerify()}
              _pressed={{
                background: colors.gray[400],
              }}
            />
          </Box>
          <Box w={"169px"}>
            <Button
              colorButtom="blue.500"
              title={idEdit != "" ? "Editar" : "Publicar"}
              colorButtomText="white"
              isLoading={isLoading}
              onPress={() => idEdit ? handleEditPublicheProductForId(idEdit) : handlePublicheProduct()}
              _pressed={{
                background: colors.gray[600],
              }}
            />
          </Box>
        </Footer>
      ) : null}
    </Box>
  );
}
