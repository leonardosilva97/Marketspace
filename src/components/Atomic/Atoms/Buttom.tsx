import { Button as ButtonNativeBase, IButtonProps, Text } from "native-base";

type Props = IButtonProps & {
  title: string;
  colorButtom: string;
  colorButtomText: string;
};

export function Button({
  title,
  colorButtom,
  colorButtomText,
  ...rest
}: Props) {
  return (
    <ButtonNativeBase
      w="full"
      h={"45px"}
      justifyContent={"center"}
      alignItems={"center"}
      bg={colorButtom}
      rounded="sm"
      {...rest}
    >
      <Text color={colorButtomText} fontSize="sm" fontWeight={"bold"}>
        {title}
      </Text>
    </ButtonNativeBase>
  );
}
