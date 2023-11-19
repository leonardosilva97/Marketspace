import React, { useState } from "react";
import {
  Input as NativeBaseInput,
  IInputProps,
  Box,
  Text,
  FormControl,
  Icon,
  useTheme,
  Pressable,
} from "native-base";

type Props = IInputProps & {
  errorMessage?: string | null;
  password?: boolean;
  showPass?: boolean;
  children?: React.ReactNode;
};

import { EyeClosedIcon, EyeIcon } from "../../../utils/IconsApplication";

export function Input({
  errorMessage = null,
  isInvalid,
  password = false,
  showPass = true,
  children,
  ...rest
}: Props) {
  const [show, setShow] = useState(showPass);
  const invalid = !!errorMessage || isInvalid;
  const { sizes, colors } = useTheme();
  const iconSize = sizes[6];

  return (
    <Box>
      <FormControl isInvalid={invalid}>
        <NativeBaseInput
          bg="white"
          h={"45px"}
          px={4}
          borderWidth={0}
          fontSize="md"
          color="gray.700"
          fontFamily="body"
          placeholderTextColor={colors.gray[400]}
          type={show ? "text" : "password"}
          InputRightElement={
            password ? (
              <Pressable onPress={() => setShow(!show)}>
                <Box mr={2}>
                  {show ? (
                    <EyeIcon color={colors.gray[500]} size={iconSize} />
                  ) : (
                    <EyeClosedIcon color={colors.gray[500]} size={iconSize} />
                  )}
                </Box>
              </Pressable>
            ) : (
              children && children
            )
          }
          isInvalid={invalid}
          _invalid={{
            borderWidth: 1,
            borderColor: "red.500",
          }}
          _focus={{
            bg: "white",
            borderWidth: 1,
            borderColor: colors.gray[700],
          }}
          {...rest}
        />

        <FormControl.ErrorMessage mx={1}>
          {errorMessage}
        </FormControl.ErrorMessage>
      </FormControl>
    </Box>
  );
}
