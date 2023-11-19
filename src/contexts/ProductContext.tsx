import React, { useState, useEffect } from "react";
import { createContext, ReactNode } from "react";

import { api } from "../service/api";
import { ProductDTO } from "../dtos/ProductDTO";
import Utils from "../utils/utils";
import { useAuth } from "../hooks/useAuth";
import { AppError } from "../utils/AppError";

type ProductImage = {
  path: string;
  id: string;
};

export type PaymentMethod = {
  key: string;
  name: string;
};

export type FetchParamProps = {
  userProducts?: boolean;
  params?: {
    is_new?: boolean;
    accept_trade?: boolean;
    payment_methods?: string[];
    query?: string;
  };
};

export type ProductInterface = {
  id?: string;
  name: string;
  description: string;
  is_new: boolean;
  price: number;
  accept_trade: boolean;
  user_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  product_images: ProductImage[];
  payment_methods: PaymentMethod[];
};

export type ProductArrayResponse = {
  id?: string;
  name: string;
  price: number;
  is_new: boolean;
  accept_trade: boolean;
  product_images: {
    path: string;
    id: string;
  }[];
  payment_methods: {
    key: string;
    name: string;
  }[];
  user: {
    avatar: string;
  };
};

type productProps = {
  name: string;
  type: string;
  uri: string;
};

export type ProductContextDataProps = {
  previewProduct: ProductDTO;
  productExist: boolean
  userProducts: ProductInterface[];
  previewimageProduct: productProps[];
  filteredProducts: ProductArrayResponse[];
  annoucimentActive: string;
  loadingProduct: boolean
  handleLoadingProduct: (isLoading: boolean) => void
  setPreviewProduct: ({}: ProductDTO) => void;
  setPreviewImageProduct: ([]: productProps[]) => void;
  filterProduct: (optionFilter: string) => void;
  onFilterProducts: (products: ProductArrayResponse[]) => void;
  handleGetProduct: () => void;
  productExistsOrNot: (exist: boolean) => void
  getProducts: (params: {
    userProducts: boolean;
    paymentMethods?: string[];
    is_new?: boolean;
    acceptTrade?: boolean;
    search?: string;
  }) => Promise<void>;
};

export const ProductContext = createContext<ProductContextDataProps>(
  {} as ProductContextDataProps
);

type ProductContextProviderProps = {
  children: ReactNode;
};

export function ProductContextProvider({
  children,
}: ProductContextProviderProps) {
  const classUtils = Utils.getInstance();
  const [previewimageProduct, setPreviewImageProduct] = useState<any[]>([]);
  const [userProducts, setUserProducts] = useState<ProductInterface[]>([]);
  const [userProductsaux, setUserProductsaux] = useState<ProductInterface[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<
    ProductArrayResponse[]
  >([]);
  const [annoucimentActive, setAnnoucementActive] = useState("0");
  const [previewProduct, setPreviewProduct] = useState<ProductDTO>(
    {} as ProductDTO
  );
  const [filterAnnouciment, setFilterAnnouciment] = useState<ProductInterface[]>([])
  const [productExist, setProductExist] = useState(true)
  const [loadingProduct, setLoadingProduct] = useState(true)


  function countNumberOfActiveUserProducts(product: ProductInterface[]) {
    if (userProducts) {
      let activeAdvertisements = 0; 
      product.map(
        (product: ProductInterface) =>
          product.is_active && activeAdvertisements++
      );

      console.log("contador", activeAdvertisements);

      setAnnoucementActive(
        (prevStatte) => (prevStatte = activeAdvertisements.toString())
      );
    } else {
      setAnnoucementActive("0");
    }
  }

  async function getProducts(params: {
    userProducts: boolean;
    paymentMethods?: string[];
    is_new?: boolean;
    acceptTrade?: boolean;
    search?: string;
  }) {
    try {
      const {
        userProducts,
        paymentMethods = [],
        is_new = false,
        acceptTrade = false,
        search = "",
      } = params;
      let apiRoute = userProducts ? "/users/products" : "/products";

      if (!userProducts) {
        const paymentMethodsQuery = paymentMethods
          .map((item) => `payment_methods=${item}`)
          .join("&");
        const searchQuery = search.length > 0 ? `&query=${search}` : "";
        apiRoute += `/?is_new=${is_new}&accept_trade=${acceptTrade}${paymentMethodsQuery}${searchQuery}`;
      }

      const { data } = await api.get(apiRoute);
      console.log(userProducts ? "User Products:" : "Filtered Products:", data);

      if (userProducts) {
        setUserProducts(data);
        setUserProductsaux(data);
        countNumberOfActiveUserProducts(data);
      } else {
        setFilteredProducts(data);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      throw error;
    }
  }

  function handleLoadingProduct(isLoading: boolean){
    setLoadingProduct(isLoading)
  }



  async function handleGetProduct() {

    handleLoadingProduct(true)
    try {
      await getProducts({ userProducts: false, paymentMethods: ["pix", 'card'], acceptTrade: true, is_new: false });
    } catch (error) {
      console.log("Erro do try catch pegar produto: =>", error);
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possivel logar na sua conta. Tente novamente mais tarde";
      classUtils.AlertMessage(title, "red.500");
    } finally {
      handleLoadingProduct(false)
    }
  }

  function onFilterProducts(products: ProductArrayResponse[]){
    setFilteredProducts(products)
  }

  function productExistsOrNot(exist: boolean){
    setProductExist(exist)
  }



  function filterProduct(optionFilter: string){    
    let arrayAuxProducts: ProductInterface[] = []
    if(optionFilter === "1"){
      arrayAuxProducts = userProductsaux;
    }
    if(optionFilter === "2"){
      arrayAuxProducts = userProductsaux.filter(products => products.is_active)
    }
    if(optionFilter === "3"){
      arrayAuxProducts = userProductsaux.filter(products => !products.is_active)
    }

    setUserProducts(arrayAuxProducts)
  }




  return (
    <ProductContext.Provider
      value={{ 
        annoucimentActive,
        previewProduct,
        setPreviewProduct,
        previewimageProduct,
        setPreviewImageProduct,
        getProducts,
        filterProduct,
        filteredProducts,
        userProducts,
        onFilterProducts,
        productExistsOrNot, 
        productExist,
        handleGetProduct,
        handleLoadingProduct,
        loadingProduct
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
