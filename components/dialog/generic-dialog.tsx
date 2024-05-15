import React from "react";
import { Dialog, Portal, Text } from "react-native-paper";

interface IGenericDialogProps {
  visible: boolean;
  hideDialog: () => void;
  icon?: string;
  title?: string;
  subtitle?: string;
  iconColor?: string;
  children?: React.ReactNode;
}
const GenericDialog = ({
  visible,
  hideDialog,
  title = "Something went wrong!",
  subtitle = "Please try again later",
  icon = "alert",
  iconColor = "red",
  children,
}: IGenericDialogProps) => {
  return (
    <Portal>
      <Dialog
        style={{ backgroundColor: "black", borderRadius: 10 }}
        visible={visible}
        onDismiss={hideDialog}
      >
        <Dialog.Icon icon={icon} color={iconColor} />
        <Dialog.Title className="text-xl text-center">{title}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium" className="text-center">
            {subtitle}
          </Text>
          {children}
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

export default GenericDialog;
