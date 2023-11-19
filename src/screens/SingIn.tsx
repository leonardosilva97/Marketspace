import { Box, Center, Text, VStack, useTheme } from "native-base";
import React, { useState, useEffect } from "react";
import GrupoSVG from "../assets/GrupoSVG.svg";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "../routes/auth.routes";

import { Button } from "../components/Atomic/Atoms/Buttom";
import { Input } from "../components/Atomic/Atoms/Input";

import { useAuth } from "../hooks/useAuth";
import { AppError } from "../utils/AppError";
import Utils from "../utils/utils";

type FormDataProps = {
  email: string;
  password: string;
};

const LoginSchema = yup.object({
  email: yup.string().required("Informe o E-mail").email("E-mail invalido"),
  password: yup
    .string()
    .required("Informe a senha")
    .min(8, "A senha deve ter pelo menos 8 digitos"),
});

export function SingIn() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const widthInput = "279px";
  const { singIn } = useAuth();
  const classUtils = Utils.getInstance();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormDataProps>({
    mode: "onBlur",
    resolver: yupResolver(LoginSchema),
  });

  async function handleSingIn({ email, password }: FormDataProps) {
    try {
      setIsLoading(true);
      await singIn(email, password);
    } catch (error) {
      console.log("Erro do try catch logar: =>", error);
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possivel logar na sua conta. Tente novamente mais tarde";
      classUtils.AlertMessage(title, "red.500");
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

  function handleSingUp() {
    navigation.navigate("SingUp");
  }
  return (
    <VStack flex={1} bg={"white"} justifyContent={"space-between"}>
      <Box
        w={"full"}
        h={"576px"}
        bg={colors.gray[100]}
        borderBottomRadius={"20px"}
      >
        <Center mt={"20"}>
          <GrupoSVG />
        </Center>
        <Center mt={"16"}>
          <Text mb={3} color={"gray.600"}>
            Acesse sua conta
          </Text>
          <VStack space={4}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  w={widthInput}
                  placeholder="E-mail"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.email?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  w={widthInput}
                  placeholder="Senha"
                  password
                  showPass={false}
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.password?.message}
                  onSubmitEditing={handleSubmit(handleSingIn)}
                  returnKeyType="send"
                />
              )}
            />
          </VStack>
          <Box mt={"8"}>
            <Button
              w={widthInput}
              colorButtom="blue.500"
              colorButtomText="white"
              title="Entrar"
              isLoading={isLoading}
              onPress={handleSubmit(handleSingIn)}
              _pressed={{
                bg: colors.blue[700],
              }}
            />
          </Box>
        </Center>
      </Box>
      <VStack space={2} mb={"60px"}>
        <Center>
          <Text color={"gray.600"}>Ainda não tem acesso?</Text>
        </Center>
        <Center>
          <Button
            w={widthInput}
            colorButtom="gray.200"
            colorButtomText="gray.700"
            title="Criar uma conta"
            onPress={handleSingUp}
            _pressed={{
              bg: colors.gray[300],
            }}
          />
        </Center>
      </VStack>
    </VStack>
  );
}
