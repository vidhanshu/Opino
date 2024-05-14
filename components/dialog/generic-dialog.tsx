import React from 'react'
import { View } from 'react-native'
import { Button, Dialog, Portal, Text } from 'react-native-paper'

interface IGenericDialogProps { visible: boolean, hideDialog: () => void, icon?: string, title?: string, subtitle?: string, iconColor?: string }
const GenericDialog = ({ visible, hideDialog, title = "Something went wrong!", subtitle = "Please try again later", icon = "alert", iconColor = "red" }: IGenericDialogProps) => {
    return (
        <Portal>
            <Dialog style={{ backgroundColor: "black", borderRadius: 10 }} visible={visible} onDismiss={hideDialog}>
                <Dialog.Icon icon={icon} color="red" />
                <Dialog.Title className='text-xl text-center'>{title}</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyMedium" className='text-center'>{subtitle}</Text>
                    <View className='mt-4'>
                        <Button onPress={hideDialog} mode='text' rippleColor="white">Ok</Button>
                    </View>
                </Dialog.Content>
            </Dialog>
        </Portal>
    )
}

export default GenericDialog