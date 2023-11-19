import { Box, Text, VStack, useTheme } from "native-base";
import React, { Dispatch, SetStateAction, useState } from "react";
import { CheckBox } from "./CheckBox";

type Props = {
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
};

export function PaymentMethods({
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
}: Props) {
  const { colors } = useTheme();
  return (
    <Box>
      <Box>
        <Text bold color={"gray.500"}>
          Meios de pagamento aceitos
        </Text>
      </Box>
      <VStack mt={2} space={2}>
        <CheckBox
          text="Boleto"
          value={boleto}
          onValueChange={setBoleto}
          color={boleto ? colors.blue[500] : colors.gray[400]}
        />

        <CheckBox
          text="Pix"
          value={pix}
          onValueChange={setPix}
          color={pix ? colors.blue[500] : colors.gray[400]}
        />
        <CheckBox
          text="Dinheiro"
          value={cash}
          onValueChange={setCash}
          color={cash ? colors.blue[500] : colors.gray[400]}
        />
        <CheckBox
          text="Cartão"
          value={card}
          onValueChange={setCard}
          color={card ? colors.blue[500] : colors.gray[400]}
        />
        <CheckBox
          text="Deposito"
          value={deposit}
          onValueChange={setDeposit}
          color={deposit ? colors.blue[500] : colors.gray[400]}
        />
      </VStack>
    </Box>
  );
}
