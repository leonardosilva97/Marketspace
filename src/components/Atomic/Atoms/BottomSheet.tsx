import { Actionsheet, Box } from "native-base";
import React from "react";

type Props = {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
};

export function BottomSheet({ isOpen, onClose, children }: Props) {
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>{children}</Actionsheet.Content>
    </Actionsheet>
  );
}
