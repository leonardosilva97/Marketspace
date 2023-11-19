import {
  Box,
  HStack,
  Radio,
  ScrollView,
  Stack,
  Text,
  VStack,
  useTheme,
} from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "../routes/app.routes";

import { Back } from "../components/Atomic/Atoms/Back";
import { PlusIcon } from "../utils/IconsApplication";
import { AdImageOfProduct } from "../components/Atomic/Atoms/AdImageOfProduct";
import { ImageOfProduct } from "../components/Atomic/Atoms/ImageOfProduct";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Input } from "../components/Atomic/Atoms/Input";
import { InputTextArea } from "../components/Atomic/Atoms/InputTextArea";
import { InputRadio } from "../components/Atomic/Atoms/InputRadio";
import { InputSwitch } from "../components/Atomic/Atoms/InputSwitch";
import { PaymentMethods } from "../components/Atomic/Atoms/PaymentMethods";
import { Footer } from "../components/Atomic/Molecules/Footer";
import { Button } from "../components/Atomic/Atoms/Buttom";

import { useProduct } from "../hooks/useProduct";
import Utils from "../utils/utils";

import { ProductDTO } from "../dtos/ProductDTO";
import { Modal } from "../components/Atomic/Molecules/Modal";
import { TextInputMask } from "react-native-masked-text";
import { PaymentMethodsDTO } from "../dtos/PaymentMethodsDTO";
import { api } from "../service/api";
import { AppError } from "../utils/AppError";

type FormDataProps = {
  name: string;
  description: string;
  price: string;
};

type ImageUploadProps = {
  uri: string;
  name: string;
  type: string;
};

type RouteParamsProps = {
  idParams: string;
};

type PaymentsProps = {
  key: string
  name: string
}

const productAdSchema = yup.object({
  name: yup
    .string()
    .required("Informe o título do anúncio que você irá postar"),
  description: yup.string().required("Informe a descrição do produto"),
  price: yup.string().required("Informe o valor do produto"),
});

export function CreateAd() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const classUtils = Utils.getInstance();
  const { previewProduct, setPreviewProduct, setPreviewImageProduct } =
    useProduct();
  const { colors } = useTheme();
  const priceRef = useRef(null);

  const [photoLoading, setPhotoLoading] = useState(false);
  const [radio, setRadio] = useState("2");
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [boleto, setBoleto] = useState(false);
  const [product, setProduct] = useState<ProductDTO>({} as ProductDTO)
  const [pix, setPix] = useState(false);
  const [cash, setCash] = useState(false);
  const [card, setCard] = useState(false);
  const [deposit, setDeposit] = useState(false);
  const [photoVisualization, setPhotoVisualization] =
    useState<ImageUploadProps>({} as ImageUploadProps);
  const [photoProduct, setPhotoProduct] = useState<ImageUploadProps[]>([]);
  const [open, setOpen] = useState(false);
  const route = useRoute();
  const {} = useProduct();
  let { idParams } = route.params as RouteParamsProps;

  useEffect(() => {
    if (idParams != "clear" && idParams != "") {
      let aux = getProductForID(idParams);
      console.log("object route", aux);
    }

    if(idParams == "clear"){
      reset()
      setPhotoProduct([])
      setCard(false);
      setBoleto(false);
      setCash(false);
      setDeposit(false);
      setPix(false);
      setRadio('2');
    }

  }, [route.params]);


  function verifyPaymentsMethods(payments: PaymentsProps[]){
    payments.map(pay => {
      if(pay.key == "deposit"){
        setDeposit(true)
      }
      if(pay.key == "boleto"){
        setBoleto(true)
      }
      if(pay.key == "card"){
        setCard(true)
      }
      if(pay.key == "pix"){
        setPix(true)
      }
      if(pay.key == "cash"){
        setCash(true)
      }
      
    })
  }

  function populatingValues(response: any){
    transformImageProduct(response.data.product_images, response.data.name);
    setProduct(response.data);

    setValue("name", response.data.name)
    setValue("description", response.data.description)
    const formattedPrice = response.data.price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    setValue("price", formattedPrice);
    setRadio(response.data.is_new ? "1" : "2");
    if(response.data.accept_trade){
      toggleSwitch()
    }
  }

  async function getProductForID(idParam: string) {
    try {
      await api
        .get(`/products/${idParam}`)
        .then((response) => {
          console.log("response product for id", response?.data);
          populatingValues(response)

          let payments = response.data.payment_methods;

          verifyPaymentsMethods(payments)

        })
        .catch((error) => {
          const isAppError = error instanceof AppError;
          const title = isAppError
            ? error.message
            : "Não foi possivel buscar seu produto. Tente novamente mais tarde!";
          classUtils.AlertMessage(title, "red.500");
        });
    } catch (error) {
      console.log("erro do try catch criar", error);
    }
  }

  function transformImageProduct(images: any[], name: string) {
    let imagesAux: any[] = images.map((item, index) => {
      return {
        name: name,
        type: "image/jpg",
        uri: `${api.defaults.baseURL}/images/${item.path}`,
      };
    });


    setPhotoProduct(imagesAux);
    console.log('imagens formnatadas', imagesAux);


  }

  async function handleProductPhotoSelect() {
    setPhotoLoading(true);

    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      console.log(photoSelected);

      if (photoSelected.canceled != false) {
        return;
      }

      if (photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri
        );

        if (photoInfo.exists && (photoInfo.size / 1024 / 1024 > 5)!) {
          return classUtils.AlertMessage(
            "Essa Imagem é muito grande. Escolha uma imagem de até 5MB",
            "red.500"
          );
        }

        const fileExtension = photoSelected.assets[0].uri.split(".").pop();

        const photoFile = {
          name: `${photoSelected.assets[0].fileName}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        } as any;
        console.log("photo selecionada", photoFile);

        if (photoProduct.length <= 2) {
          setPhotoProduct((images) => {
            return [...images, photoFile];
          });
        } else {
          return classUtils.AlertMessage(
            "o número maximo de fotos é 3",
            "red.500"
          );
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPhotoLoading(false);
    }
  }

  // useEffect(() => {
  //   console.log("user foto selecionada", photoProductAPI);
  //   console.log("user foto selecionada string", photoProduct);
  // }, [photoProductAPI]);

  function goBack() {
    navigation.navigate("Home");
  }

  function handlePublicheAd() {
    if(idParams){
      return navigation.navigate("ViewAd", { type: "Publiche", idEdit: idParams });
    }
      return navigation.navigate("ViewAd", { type: "Publiche"});
  }

  function handleSelectStateOfProduct(value: string) {
    setRadio(value);
  }

  function visualizationPhoto(photo: ImageUploadProps) {
    setOpen(true);
    setPhotoVisualization(photo);
  }

  function exit() {
    setOpen(false);
    setPhotoVisualization({} as ImageUploadProps);
  }

  function removePhoto(photo: ImageUploadProps) {
    const photoAux = photoProduct.filter((item) => item !== photo);

    if (photoAux) {
      exit();
      setPhotoProduct(photoAux);
    }
  }

  async function handlePublichedAd(data: FormDataProps) {
    try {
      let json: ProductDTO = JSON.parse(JSON.stringify(data));
      let paymentsArray: string[] = [];
      paymentsArray = classUtils.addPaymentMethods({
        boleto,
        card,
        cash,
        deposit,
        pix,
      });
      console.log('metodos de pagamento', paymentsArray);

      if (paymentsArray.length === 0) {
        return classUtils.AlertMessage(
          "Adicione algum método de pagamento",
          "red.500"
        );
      }

      if (photoProduct.length === 0) {
        return classUtils.AlertMessage(
          "Adicione pelo menos uma imagem no seu anúncio",
          "red.500"
        );
      }

      const unPrice = priceRef?.current.getRawValue();

      json.is_new = radio === "2" ? false : true;
      json.accept_trade = isEnabled;
      json.payment_methods = paymentsArray;
      json.price = unPrice.toString();
      json.is_active = true;

      console.log("json", json);
      console.log("array de photos", photoProduct);
      setPreviewProduct(json);
      setPreviewImageProduct(photoProduct);
      //handlePublicheAd();
    } catch (error) {
      console.log('erro do try catch criar 2',error);
    } finally {
    }
  }

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormDataProps>({
    mode: "onBlur",
    resolver: yupResolver(productAdSchema),
  });
  return (
    <Box safeArea flex={1} position={"relative"}>
      <ScrollView
        mx={6}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 112 }}
      >
        <Back title={idParams !== "clear"  ? "Editar anúncio" : "Criar anúncio"} onPress={goBack} />

        <Box>
          <Text bold fontSize={"lg"} color={"gray.600"}>
            Imagens
          </Text>
          <Text fontSize={"md"} color={"gray.500"}>
            Escolha até 3 imagens para mostrar o quanto o seu produto é
            incrivel!
          </Text>
        </Box>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack mt={3} space={2}>
            <AdImageOfProduct onPress={handleProductPhotoSelect} />
            {photoProduct.length
              ? photoProduct.map((photo, index) => {
                  return (
                    <ImageOfProduct
                      onVisualization={() => visualizationPhoto(photo)}
                      key={index}
                      image={photo.uri}
                    />
                  );
                })
              : null}
          </HStack>
        </ScrollView>

        <Box mt={6}>
          <Text bold fontSize={"lg"} color={"gray.600"}>
            Sobre o produto
          </Text>

          <VStack mt={4} space={4}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  w={"full"}
                  placeholder="Título do anúncio"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.name?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <InputTextArea
                  w={"full"}
                  placeholder="Descrição do produto"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.description?.message}
                />
              )}
            />
          </VStack>

          <Box mt={2}>
            <InputRadio
              value={radio}
              onSetValue={(value) => handleSelectStateOfProduct(value)}
            />
          </Box>

          <Box mt={4}>
            <InputSwitch isEnabled={isEnabled} toggleSwitch={toggleSwitch} />
          </Box>

          <Text mt={6} bold fontSize={"lg"} color={"gray.600"}>
            Venda
          </Text>

          <Controller
            control={control}
            name="price"
            render={({ field: { onChange, value } }) => (
              <Box mt={4}>
                <Box
                  width={"full"}
                  bg="white"
                  borderRadius="sm"
                  h={"45px"}
                  justifyContent="center"
                >
                  <TextInputMask
                    type={"money"}
                    options={{
                      precision: 2,
                      separator: ",",
                      delimiter: ".",
                      unit: "R$ ",
                      suffixUnit: "",
                    }}
                    placeholder="R$ Valor do produto"
                    onChangeText={onChange}
                    value={value}
                    placeholderTextColor={colors.gray[400]}
                    style={{
                      height: "100%",
                      width: "100%",
                      paddingLeft: 12,
                      fontSize: 18,
                    }}
                    ref={priceRef}
                  />
                </Box>
                {errors.price?.message && (
                  <Text color={"red.600"} pt={2} ml={1} fontSize={"xs"}>
                    {errors.price?.message}
                  </Text>
                )}
              </Box>
            )}
          />

          <Box mt={4}>
            <PaymentMethods
              boleto={boleto}
              card={card}
              deposit={deposit}
              cash={cash}
              pix={pix}
              setBoleto={setBoleto}
              setCard={setCard}
              setDeposit={setDeposit}
              setCash={setCash}
              setPix={setPix}
            />
          </Box>
        </Box>
      </ScrollView>
      <Footer>
        <Box w={"169px"}>
          <Button
            colorButtom="gray.300"
            title="Cancelar"
            colorButtomText="gray.500"
            onPress={() => goBack()}
            _pressed={{
              background: colors.gray[400],
            }}
          />
        </Box>
        <Box w={"169px"}>
          <Button
            colorButtom="black"
            title="Avançar"
            colorButtomText="white"
            onPress={handleSubmit(handlePublichedAd)}
            _pressed={{
              background: colors.gray[600],
            }}
          />
        </Box>
      </Footer>
      <Modal
        image={photoVisualization.uri}
        open={open}
        setOpen={exit}
        onRemove={() => removePhoto(photoVisualization)}
      />
    </Box>
  );
}
