import { Box, HStack, Text, VStack, useTheme } from "native-base";
import React from "react";
import {
  BarCodeIcon,
  QrCodeIcon,
  MoneyIcon,
  CreditCardIcon,
  BankIcon,
} from "../../../utils/IconsApplication";

import { PaymentMethodsDTO } from "../../../dtos/PaymentMethodsDTO";

type PaymentProps = {
  payment: string[];
};

export function PaymentMethodInformation({ payment }: PaymentProps) {
  const { colors, sizes } = useTheme();
  const iconSize = sizes[5];
  return (
    <VStack space={2}>
      {payment.map((pay, index) => {
        return (
          <Box key={index}>
            {pay === "boleto" ? (
              <HStack space={2} alignItems={"center"}>
                <BarCodeIcon color={colors.gray[600]} size={iconSize} />
                <Text>Boleto</Text>
              </HStack>
            ) : null}
            {pay === "pix" ? (
              <HStack space={2} alignItems={"center"}>
                <QrCodeIcon color={colors.gray[600]} size={iconSize} />
                <Text>Pix</Text>
              </HStack>
            ) : null}
            {pay === "cash" ? (
              <HStack space={2} alignItems={"center"}>
                <MoneyIcon color={colors.gray[600]} size={iconSize} />
                <Text>Dinheiro</Text>
              </HStack>
            ) : null}
            {pay === "card" ? (
              <HStack space={2} alignItems={"center"}>
                <CreditCardIcon color={colors.gray[600]} size={iconSize} />
                <Text>Cartão de Crédito</Text>
              </HStack>
            ) : null}
            {pay === "deposit" ? (
              <HStack space={2} alignItems={"center"}>
                <BankIcon color={colors.gray[600]} size={iconSize} />
                <Text>Deposito Bancário</Text>
              </HStack>
            ) : null}
          </Box>
        );
      })}
    </VStack>
  );
}
