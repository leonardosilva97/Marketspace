import {
  TextArea as NativeBaseTextArea,
  ITextAreaProps,
  Box,
  Text,
  FormControl,
} from "native-base";

type Props = ITextAreaProps & {
  errorMessage?: string | null;
};

export function InputTextArea({
  errorMessage = null,
  isInvalid,
  ...rest
}: Props) {
  const invalid = !!errorMessage || isInvalid;

  return (
    <Box>
      <FormControl isInvalid={invalid}>
        <Box h={40}>
          <NativeBaseTextArea
            autoCompleteType={isInvalid}
            bg="white"
            h={"100%"}
            px={4}
            borderWidth={0}
            fontSize="md"
            color="gray.700"
            fontFamily="body"
            placeholderTextColor="gray.400"
            isInvalid={invalid}
            _invalid={{
              borderWidth: 1,
              borderColor: "red.500",
            }}
            _focus={{
              bg: "white",
              borderWidth: 1,
              borderColor: "gray.700",
            }}
            {...rest}
          />
        </Box>

        <FormControl.ErrorMessage mx={1}>
          {errorMessage}
        </FormControl.ErrorMessage>
      </FormControl>
    </Box>
  );
}
