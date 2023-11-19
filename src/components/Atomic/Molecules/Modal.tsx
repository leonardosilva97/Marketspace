import React from "react";
import { Box, Image, Modal as NativeBaseModal, Text } from "native-base";
import { Button } from "../Atoms/Buttom";

type Props = {
  open: boolean;
  image: string;
  setOpen: (item: boolean) => void;
  onRemove: () => void;
};

export function Modal({ open, setOpen, image, onRemove }: Props) {
  return (
    <NativeBaseModal
      isOpen={open}
      onClose={() => setOpen(false)}
      safeAreaTop={true}
      closeOnOverlayClick={false}
    >
      <NativeBaseModal.Content width={"100%"} height={"450px"}>
        <NativeBaseModal.CloseButton />
        <NativeBaseModal.Header>
          <Text bold fontSize={"md"}>
            Visualizar foto
          </Text>
        </NativeBaseModal.Header>
        <NativeBaseModal.Body>
          <Box w={"100%"} h={72}>
            <Image w={"100%"} h={"72"} src={image} alt="imagem do produto" />
          </Box>
          <Box mt={4} w={"100%"}>
            <Button
              colorButtom="red.500"
              colorButtomText="white"
              title="Excluir"
              onPress={onRemove}
              _pressed={{
                backgroundColor: "red.400",
              }}
            />
          </Box>
        </NativeBaseModal.Body>
      </NativeBaseModal.Content>
    </NativeBaseModal>
  );
}
