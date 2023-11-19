import {
  Box,
  Pressable,
  Image,
  VStack,
  useTheme,
  Center,
  ScrollView,
  Text,
  Skeleton,
  Toast,
} from "native-base";
import React, { useEffect, useState, useRef } from "react";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "../routes/auth.routes";

import GrupoSVGSingUp from "../assets/GrupoSVG2.svg";

import { ImageUser } from "../components/Atomic/Atoms/ImageUser";
import { Input } from "../components/Atomic/Atoms/Input";
import { Button } from "../components/Atomic/Atoms/Buttom";

import axios from "axios";
import { api } from "../service/api";
import Utils from "../utils/utils";
import { AppError } from "../utils/AppError";
import { TextInputMask } from "react-native-masked-text";

type FormDataProps = {
  avatar?: FormData;
  name: string;
  email: string;
  tel: string;
  password: string;
  confirmPassword: string;
};

type ImageUploadProps = {
  selected: boolean;
  photo: {
    uri: string;
    name: string;
    type: string;
  };
};

const SingUpSchema = yup.object({
  name: yup.string().required("Informe o nome"),
  tel: yup.string().required("Informe o telefone"),
  email: yup.string().required("Informe o e-mail").email("E-mail invalido"),
  password: yup
    .string()
    .required("Informe a senha")
    .min(8, "A senha deve ter pelo menos 8 digitos"),
  confirmPassword: yup
    .string()
    .required("Informe a senha")
    .oneOf([yup.ref("password"), null], "A confirmação da senha não confere"),
});

export function SingUp() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const classUtils = Utils.getInstance();
  const { colors, sizes } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const iconSize = sizes[4];
  const widthInput = "279px";
  const [userPhoto, setUserPhoto] = useState("");
  const [photoLoading, setPhotoLoading] = useState(false);
  const [nameUser, setNameUser] = useState("");
  const [photoSelectedUser, setPhotoSelectedUser] = useState(false);
  const [userImageSelected, setUserImageSelected] = useState({
    selected: false,
  } as ImageUploadProps);
  const numberRef: any = useRef(null);

  function hasSpaces(str: string) {
    return str.indexOf(" ") !== -1;
  }

  function removeSpaces(str: string) {
    return str.replace(/\s+/g, "");
  }

  async function handleUserPhotoSelect() {
    setPhotoLoading(true);

    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission not granted");
        return;
      }

      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      console.log(photoSelected);

      if (photoSelected.canceled) {
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

        let nameAux = " ";
        const isHasSpace = hasSpaces(nameUser);

        if (isHasSpace) {
          nameAux = removeSpaces(nameUser);
        }

        const fileExtension = photoSelected.assets[0].uri.split(".").pop();

        const photoFile = {
          name: `${nameAux}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        } as any;

        const ImageUpload = {
          selected: true,
          photo: { ...photoFile },
        };

        const userImage = {
          ...ImageUpload.photo,
        } as any;

        setUserImageSelected(userImage);

        setUserPhoto(photoSelected.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPhotoLoading(false);
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
    resolver: yupResolver(SingUpSchema),
  });

  async function handleSingUp({ name, email, password }: FormDataProps) {
    setIsLoading(true);

    try {
      const unNumber = numberRef?.current.getRawValue();
      console.log(unNumber);

      const userData = new FormData();

      userData.append("name", name);
      userData.append("email", email);
      userData.append("password", password);
      userData.append("tel", `+55${unNumber}`);
      userData.append("avatar", userImageSelected as any);

      console.log(userData);

      await api
        .post("/users", userData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response.data);
          classUtils.AlertMessage("Dados cadastrados com sucesso", "green.500");
          navigation.goBack();
        })
        .catch((error) => {
          console.log("error do catch", error);
          const isAppError = error instanceof AppError;
          const title = isAppError
            ? error.message
            : "Não foi possivel criar a conta. Tente novamente mais tarde";
          classUtils.AlertMessage(title, "red.500");
        });
    } catch (error) {
      console.log("Erro do try catch sair: =>", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      reset();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <Box flex={1} safeArea bg={colors.gray[100]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        <Box>
          <Center>
            <Box mt={8}>
              <GrupoSVGSingUp />
            </Box>
            <Box mt={6} w={20} h={20}>
              <ImageUser
                image={userPhoto}
                onImageSelect={handleUserPhotoSelect}
                sendPhoto={photoSelectedUser && nameUser.length > 0}
                photoLoading={photoLoading}
              />
            </Box>
          </Center>
        </Box>

        <VStack mt={4} space={4} alignItems={"center"}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                w={widthInput}
                placeholder="Nome"
                onChangeText={(value) => {
                  setNameUser(value);
                  onChange(value);
                }}
                onFocus={() => {
                  setPhotoSelectedUser(false);
                }}
                onBlur={() => setPhotoSelectedUser(true)}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                w={widthInput}
                placeholder="Email"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="tel"
            render={({ field: { onChange, value } }) => (
              <Box>
                <Box
                  width={widthInput}
                  bg="white"
                  borderRadius="sm"
                  h={"44px"}
                  justifyContent="center"
                  borderWidth={errors.tel || isFocus ? 1 : 0}
                  borderColor={
                    errors.tel
                      ? "red.500"
                      : isFocus
                      ? colors.gray[700]
                      : "white"
                  }
                >
                  <TextInputMask
                    type={"cel-phone"}
                    options={{
                      maskType: "BRL",
                      withDDD: true,
                      dddMask: "(99) ",
                    }}
                    placeholder="Telefone"
                    onChangeText={onChange}
                    value={value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    placeholderTextColor={colors.gray[400]}
                    style={{
                      height: "100%",
                      width: "100%",
                      paddingLeft: 12,
                    }}
                    ref={numberRef}
                  />
                </Box>
                {errors.tel?.message && (
                  <Text color={"red.600"} pt={2} ml={1} fontSize={"xs"}>
                    {errors.tel?.message}
                  </Text>
                )}
              </Box>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                w={widthInput}
                placeholder="Senha"
                onChangeText={onChange}
                value={value}
                password
                showPass={false}
                errorMessage={errors.password?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <Input
                w={widthInput}
                placeholder="Confirmação de senha"
                onChangeText={onChange}
                value={value}
                password
                showPass={false}
                errorMessage={errors.confirmPassword?.message}
              />
            )}
          />

          <Button
            mt={2}
            w={widthInput}
            colorButtom="black"
            colorButtomText="white"
            title="Criar"
            isLoading={isLoading}
            onPress={handleSubmit(handleSingUp)}
            _pressed={{
              bg: colors.gray[700],
            }}
          />
        </VStack>

        <VStack space={2} mb={"60px"} mt={12}>
          <Center>
            <Text color={"gray.600"}>Já tem uma conta?</Text>
          </Center>
          <Center>
            <Button
              w={widthInput}
              colorButtom="gray.200"
              colorButtomText="gray.700"
              title="Ir para login"
              onPress={() => navigation.goBack()}
              isLoading={isLoading}
              _pressed={{
                bg: colors.gray[300],
              }}
            />
          </Center>
        </VStack>
      </ScrollView>
    </Box>
  );
}
