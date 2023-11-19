import React, { useEffect, useState } from "react";
import { useTheme, Box, HStack, Text, useDisclose } from "native-base";
import { Header } from "./Header";
import { MyAdCard } from "../Atoms/MyAdCard";

import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "../../../routes/app.routes";
import { XIcon } from "../../../utils/IconsApplication";
import {useProduct} from '../../../hooks/useProduct';
import Utils from "../../../utils/utils";

import { Input } from "../Atoms/Input";
import { IconFilterAndSlider } from "../Atoms/IconFilterAndSlider";
import { BottomSheet } from "../Atoms/BottomSheet";
import { Badge } from "../Atoms/Badge";
import { FilterInfo } from "../Atoms/FilterInfo";
import { CheckBox } from "../Atoms/CheckBox";
import { AppError } from "../../../utils/AppError";
import { ProductArrayResponse } from "../../../contexts/ProductContext";

type Props = {
  annoucimentCountActive: string;
};

export function HomeHeader({ annoucimentCountActive }: Props) {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { isOpen, onOpen, onClose } = useDisclose();
  const [pressedNew, setPressedNew] = useState(false);
  const [pressedOld, setPressedOld] = useState(false);
  const [boleto, setBoleto] = useState(false);
  const [pix, setPix] = useState(false);
  const [dinheiro, setDinheiro] = useState(false);
  const [credito, setCredito] = useState(false);
  const [deposito, setDeposito] = useState(false);
  const { colors } = useTheme();
  const [isEnabled, setIsEnabled] = useState(false);
  const {getProducts, filteredProducts, onFilterProducts, handleLoadingProduct, productExistsOrNot, productExist, handleGetProduct} = useProduct();
  const classUtils = Utils.getInstance();
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
 


  const [filteredProductsAux, setFilteredProductsAux] = useState<ProductArrayResponse[]>([]);
  const [filterSearch, setFilterSearch] = useState("");
 

  const handleFilterSearch = () => {
    handleLoadingProduct(true)
    if (filterSearch.trim() !== "") {
      const newData = [
        ...filteredProducts.filter((item) =>
          item.name.toUpperCase().includes(filterSearch.toUpperCase())
        ),
      ];

      if (newData.length) {
        setFilteredProductsAux(filteredProducts);
        onFilterProducts(newData);
        productExistsOrNot(true)
      } else {
        console.log('caiu no else')
        onFilterProducts([])
        productExistsOrNot(false)
      }
    }

    handleLoadingProduct(false)
  };



  function handleReplay(){
    productExistsOrNot(true)
    handleGetProduct()
  }


  function resetFilters(){
    handleGetProduct()
    setPressedNew(false)
    setPressedOld(false)
    setDeposito(false)
    setPix(false)
    setCredito(false)
    setDinheiro(false)
    setBoleto(false)
    setCredito(false)
    setIsEnabled(false)
    onClose()
  }

  async function handleFilterProduct() {
    if(pressedNew === false && pressedOld === false){
      return classUtils.AlertMessage('Por favor selecione a condição do produto', 'red.500');
    }
    try {
      await getProducts(
          { 
            userProducts: false, 
            paymentMethods: [
              pix ? "pix" : "",
              credito ? 'card' : "",
              dinheiro ? 'cash' : "",
              boleto ? 'boleto' : "",
              deposito ? 'deposito' : ""
            ], 
            acceptTrade: isEnabled, 
            is_new: pressedNew ? pressedNew : pressedOld 
          }
        );
    } catch (error) {
      console.log("Erro do try catch header: =>", error);
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possivel logar na sua conta. Tente novamente mais tarde";
      classUtils.AlertMessage(title, "red.500");
    } finally {
      onClose()
    }
  }
  return (
    <>
      <Box>
        <Header onHandlePress={() => navigation.navigate("CreateAd", {idParams: "clear"})} />
      </Box>

      <Box mt={8}>
        <Text mb={2} color={"gray.700:alpha.50"}>
          Seus produtos anunciados para venda
        </Text>
        <Box>
          <MyAdCard
            activeAds={annoucimentCountActive}
            onPress={() => navigation.navigate("MyAds")}
          />
        </Box>
      </Box>

      <Box mt={8}>
        <Text mb={2} color={"gray.700:alpha.50"}>
          Compre produtos variados
        </Text>
        <Box mb={8}>
            <Input
              placeholder="Buscar anúncio"
              onChangeText={(text) => setFilterSearch(text)}
              onSubmitEditing={handleFilterSearch}
              returnKeyType="send"
              children={
                productExist ?
                <IconFilterAndSlider 
                  handleFilter={onOpen}
                  filter={true}
                  handleSearch={() => handleFilterSearch()}
                />
                :
                <IconFilterAndSlider
                  handleFilter={onOpen}
                  filter={false}
                  handleSearch={() => handleReplay()}
                />
              }
            />
        </Box>
      </Box>

      <BottomSheet isOpen={isOpen} onClose={onClose}>
        <FilterInfo
          onClose={onClose}
          pressedNew={pressedNew}
          pressedOld={pressedOld}
          setPressedNew={() => setPressedNew(!pressedNew)}
          setPressedOld={() => setPressedOld(!pressedOld)}
          isEnabled={isEnabled}
          toggleSwitch={toggleSwitch}
          boleto={boleto}
          pix={pix}
          cash={dinheiro}
          card={credito}
          deposit={deposito}
          setBoleto={setBoleto}
          setPix={setPix}
          setCash={setDinheiro}
          setCard={setCredito}
          setDeposit={setDeposito}
          onResetFilter={() => {
            resetFilters()
          }}
          onApplicationFilter={() => {
            handleFilterProduct()
          }}
        />
      </BottomSheet>
    </>
  );
}
