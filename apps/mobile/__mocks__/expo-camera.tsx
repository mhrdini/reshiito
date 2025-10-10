import type { CameraPictureOptions } from 'expo-camera'
import React, { forwardRef, useImperativeHandle } from 'react'
import { View } from 'react-native'

export type CameraRef = {
  takePictureAsync: (options?: CameraPictureOptions) => Promise<{ uri: string }>
}

// Jest mock function
export const mockTakePictureAsync = jest.fn(
  async (_options?: CameraPictureOptions) => ({
    uri: 'mock-uri',
  }),
)

// Props typed as PropsWithChildren so children exists
export const CameraView = forwardRef<CameraRef, React.PropsWithChildren<any>>(
  (props, ref) => {
    useImperativeHandle(ref, () => ({ takePictureAsync: mockTakePictureAsync }))

    return (
      <View {...props} testID='camera'>
        {props.children}
      </View>
    )
  },
)

export const CameraType = { back: 'back', front: 'front' }
export const useCameraPermissions = jest.fn(() => [
  { granted: true },
  jest.fn(),
])
