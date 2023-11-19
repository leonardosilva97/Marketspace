import React from "react";
import { Select, ISelectProps, CheckIcon, useTheme, Box } from "native-base";

type optionsType = {
  label: string;
  value: number | string;
};
type Props = ISelectProps & {
  title?: String;
  options?: optionsType[] | undefined;
};

export function SelectOptions({ options, ...rest }: Props) {
  const [service, setService] = React.useState("");
  const { colors } = useTheme();
  return (
    <Box bg="white" rounded="lg">
      <Select
        h={"40px"}
        width={"130px"}
        borderWidth={1}
        fontSize="sm"
        color="gray.700"
        fontFamily="body"
        selectedValue={service}
        accessibilityLabel="Selecione"
        placeholder="Selecione"
        _selectedItem={{
          bg: colors.gray[400],
          endIcon: <CheckIcon size="5" />,
        }}
        _light={{
          bg: "white",
        }}
        _dark={{
          bg: "coolGray.800",
        }}
        onValueChange={(itemValue) => setService(itemValue)}
        {...rest}
      >
        {options?.map((option: optionsType) => {
          return (
            <Select.Item
              shadow={2}
              
              label={option.label}
              value={option.value.toString()}
              key={option.value}
            />
          );
        })}
      </Select>
    </Box>
  );
}
