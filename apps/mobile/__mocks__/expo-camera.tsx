import type { CameraPictureOptions } from 'expo-camera'
import React, { forwardRef, useImperativeHandle } from 'react'
import { View } from 'react-native'
import { MOCK_CAMERA_CAPTURED } from '@/constants'

export type CameraRef = {
  takePictureAsync: (options?: CameraPictureOptions) => Promise<{ uri: string }>
}

// Jest mock function
export const mockTakePictureAsync = jest.fn()
mockTakePictureAsync.mockResolvedValue(MOCK_CAMERA_CAPTURED)

// Props typed as PropsWithChildren so children exists
export const CameraView = forwardRef<CameraRef, React.PropsWithChildren>(
  (props, ref) => {
    useImperativeHandle(ref, () => ({ takePictureAsync: mockTakePictureAsync }))

    return (
      <View {...props} data-testID='camera'>
        {props.children}
      </View>
    )
  },
)

export const CameraType = { back: 'back', front: 'front' }

export const useCameraPermissions = jest.fn(() => [
  { granted: true }, // permission object
  jest.fn(), // request function
])
