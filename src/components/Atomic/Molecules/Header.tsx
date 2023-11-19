import { Box, HStack, useTheme } from "native-base";
import React, { useEffect, useState } from "react";
import { Button } from "../Atoms/Buttom";

import { useAuth } from "../../../hooks/useAuth";
import { api } from "../../../service/api";

import { PersonInformation } from "./PersonInformation";
import { PlusIcon } from "../../../utils/IconsApplication";

type Props = {
  onHandlePress: () => void;
};

export function Header({ onHandlePress }: Props) {
  const { colors } = useTheme();
  const { user, userAvatar } = useAuth();
  const [nameUser, setNameUser] = useState("");

  function hasSpaces(str: string) {
    return str.indexOf(" ") !== -1;
  }

  useEffect(() => {
    const nameSpace = hasSpaces(user.name);

    if (nameSpace) {
      setNameUser(user.name.split(" ")[0]);
    } else {
      setNameUser(user.name);
    }
  }, []);

  return (
    <HStack h={16} justifyContent={"space-between"} alignItems={"center"}>
      <PersonInformation
        height="12"
        width="12"
        image={userAvatar}
        name={nameUser}
      />
      <Box w={40}>
        <Button
          startIcon={<PlusIcon color="white" size={"15px"} />}
          colorButtom="black"
          title="Criar anúncio"
          colorButtomText="white"
          onPress={onHandlePress}
          _pressed={{
            background: colors.gray[600],
          }}
        />
      </Box>
    </HStack>
  );
}
