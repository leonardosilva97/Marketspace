import { useContext } from "react";

import { ProductContext } from "../contexts/ProductContext";

export function useProduct() {
  const contextProduct = useContext(ProductContext);

  return contextProduct;
}
