import React from "react";
import { Spinner, Center, Image } from "native-base";

import Logo from "../../../assets/logo-svg.svg";

export function Loading() {
  return (
    <Center flex={"1"}>
      <Logo />
    </Center>
  );
}
