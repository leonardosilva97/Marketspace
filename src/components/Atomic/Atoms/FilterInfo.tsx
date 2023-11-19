import { Box, HStack, Text, VStack, useTheme } from "native-base";
import {TouchableOpacity} from 'react-native'
import React, { Dispatch, SetStateAction, useState } from "react";
import { XIcon } from "../../../utils/IconsApplication";
import { Badge } from "./Badge";
import { Button } from "./Buttom";
import { InputSwitch } from "./InputSwitch";
import { PaymentMethods } from "./PaymentMethods";

type Props = {
  pressedNew: boolean;
  pressedOld: boolean;
  setPressedNew: () => void;
  setPressedOld: () => void;
  boleto: boolean;
  pix: boolean;
  cash: boolean;
  card: boolean;
  deposit: boolean;
  setBoleto: Dispatch<SetStateAction<boolean>>;
  setPix: Dispatch<SetStateAction<boolean>>;
  setCash: Dispatch<SetStateAction<boolean>>;
  setCard: Dispatch<SetStateAction<boolean>>;
  setDeposit: Dispatch<SetStateAction<boolean>>;
  isEnabled: boolean;
  onResetFilter: () => void;
  onApplicationFilter: () => void;
  toggleSwitch: () => void;
  onClose: () => void
};

export function FilterInfo({
  pressedNew,
  pressedOld,
  setPressedNew,
  setPressedOld,
  boleto,
  card,
  deposit,
  cash,
  pix,
  setBoleto,
  setCard,
  setDeposit,
  setCash,
  setPix,
  isEnabled,
  toggleSwitch,
  onApplicationFilter,
  onResetFilter,
  onClose
}: Props) {
  const { colors } = useTheme();
  return (
    <Box w={"90%"}>
      <HStack
        w={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
        h={8}
      >
        <Text fontSize={20} bold>
          Filtrar anúncios
        </Text>
        <TouchableOpacity onPress={onClose}>
          <XIcon color={colors.gray[400]} size={"25px"} />
        </TouchableOpacity>
      </HStack>
      <Box mt={6}>
        <Text bold color={"gray.500"}>
          Condição
        </Text>
        <HStack space={2} mt={2}>
          <Badge type="novo" pressed={pressedNew} onPress={setPressedNew} />
          <Badge type="usado" pressed={pressedOld} onPress={setPressedOld} />
        </HStack>
      </Box>

      <Box mt={4}>
        <InputSwitch isEnabled={isEnabled} toggleSwitch={toggleSwitch} />
      </Box>
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

      <HStack
        mt={16}
        mb={4}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Box w={"47%"}>
          <Button
            colorButtom="gray.200"
            colorButtomText="gray.500"
            title="Resetar filtros"
            onPress={onResetFilter}
            _pressed={{
              backgroundColor: colors.gray[300],
            }}
          />
        </Box>
        <Box w={"47%"}>
          <Button
            colorButtom="black"
            colorButtomText="white"
            title="Aplicar filtros"
            onPress={onApplicationFilter}
            _pressed={{
              backgroundColor: colors.gray[500],
            }}
          />
        </Box>
      </HStack>
    </Box>
  );
}
