import { Toast } from "native-base";
import { PaymentMethodsDTO } from "../dtos/PaymentMethodsDTO";
import * as RNLocalize from "react-native-localize";
import { Text } from "react-native";

//const toast = useToast();

export default class Utils {
  private static instance: Utils | null;
  private constructor() {}

  static getInstance(): Utils {
    if (Utils.instance == null) {
      Utils.instance = new Utils();
    }

    return Utils.instance;
  }

  AlertMessage(message: string, color: string) {
    return Toast.show({
      title: message,
      placement: "top",
      bgColor: color,
    });
  }

  addPaymentMethods({ boleto, card, cash, deposit, pix }: PaymentMethodsDTO) {
    let payments: string[] = [];

    if (boleto) {
      payments?.push("boleto");
    }

    if (card) {
      payments?.push("card");
    }

    if (cash) {
      payments?.push("cash");
    }

    if (deposit) {
      payments?.push("deposit");
    }

    if (pix) {
      payments?.push("pix");
    }

    return payments;
  }

  formatMoney(amount: number): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }
}
