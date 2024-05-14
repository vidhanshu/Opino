import React, { useState } from 'react'
import { View } from 'react-native'
import { HelperText, TextInput } from 'react-native-paper'

export const PasswordField = ({ value: password, setValue: setPassword, errors }: { value: string, setValue: (val: string) => void, errors: Record<string, string> }) => {
    const [show, setShow] = useState(false);

    return (
        <View>
            <TextInput
                mode="outlined"
                label="Password"
                value={password}
                secureTextEntry={show}
                onChangeText={(text) => setPassword(text)}
                placeholder="Enter password"
                right={<TextInput.Icon onPress={() => setShow(prev=>!prev)} icon="eye" />}
            />
            <HelperText type="error" visible={!!errors.password}>
                {errors.password}
            </HelperText>
        </View>
    )
}
