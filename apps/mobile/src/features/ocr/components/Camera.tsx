import { useRef } from 'react'
import { Pressable } from 'react-native'
import { CameraPictureOptions, CameraView } from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'
import { useRouter } from 'expo-router'
import { usePermissions } from '@/features/ocr/hooks'
import { convertToImage } from '@/features/ocr/utils'
import { useImageStore } from '@/store'
import { Button, Image, View } from 'ui/components'
import { cn } from 'ui/utils'

export const Camera = () => {
  const router = useRouter()
  const cameraRef = useRef<CameraView>(null)
  const {
    capturedImage,
    setCapturedImage,
    clearCapturedImage,
    capturedSize,
    isCameraReady,
    setIsCameraReady,
    setImage,
  } = useImageStore()

  const { permissions, requestPermissions } = usePermissions()

  // Required to ensure the camera is ready before taking a picture
  const onCameraReady = async () => {
    setIsCameraReady(true)
  }

  // Request permissions for camera and media library
  if (!permissions) {
    requestPermissions()
  }

  // Button handlers
  const cancel = () => {
    setIsCameraReady(false)
    clearCapturedImage()
    router.back()
  }

  const retake = () => {
    setIsCameraReady(true)
    clearCapturedImage()
  }

  const confirm = async () => {
    setIsCameraReady(false)
    if (capturedImage) {
      await MediaLibrary.saveToLibraryAsync(capturedImage.uri)
      setImage(capturedImage)
      clearCapturedImage()
      router.dismissAll()
    }
  }

  const capture = async () => {
    if (cameraRef.current && isCameraReady) {
      const cameraOptions: CameraPictureOptions = {
        quality: 1,
        base64: true,
        exif: false,
        shutterSound: true,
        isImageMirror: true,
      }
      const result = await cameraRef.current.takePictureAsync(cameraOptions)
      const image = convertToImage(result)
      setCapturedImage(image)
    }
  }

  const renderCamera = () => (
    <>
      <CameraView
        testID='camera'
        style={{ flex: 1, width: '100%' }}
        ref={cameraRef}
        onCameraReady={onCameraReady}
        facing={'back'}
        autofocus='on'
        responsiveOrientationWhenOrientationLocked
      />

      <View className='absolute bottom-12 left-0 flex w-full flex-row items-center gap-4 px-8'>
        <View className='basis-1/3 items-center justify-center'>
          <Button
            onPress={cancel}
            testID='cancel-button'
            className='bg-transparent active:bg-transparent dark:bg-transparent dark:active:bg-transparent'
            textClassName='text-white dark:text-white text-2xl text-center'
          >
            Cancel
          </Button>
        </View>
        <View className='flex basis-1/3 items-center justify-center'>
          <Pressable testID='capture-button' onPress={capture}>
            {({ pressed }) => (
              <View
                className={cn(
                  'h-[80px] w-[80px] items-center justify-center rounded-full border-4 border-white bg-transparent dark:border-white dark:bg-transparent',
                )}
              >
                <View
                  className={cn(
                    'h-[65px] w-[65px] rounded-full bg-white dark:bg-white',
                    pressed ? 'opacity-75' : 'opacity-100',
                  )}
                />
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </>
  )

  const renderPreview = () => (
    <>
      {capturedImage && capturedSize && (
        <Image
          testID='preview-image'
          source={capturedImage!.uri}
          style={{ height: capturedSize?.height, width: capturedSize?.width }}
        />
      )}
      <View className='absolute bottom-12 left-0 flex w-full flex-row items-center justify-between gap-4 px-8'>
        <View className='basis-1/3 items-center justify-center'>
          <Button
            onPress={retake}
            testID='retake-button'
            className='bg-transparent active:bg-transparent dark:bg-transparent dark:active:bg-transparent'
            textClassName='text-white dark:text-white text-2xl text-center'
          >
            Retake
          </Button>
        </View>
        <View className='flex basis-1/3 items-center justify-center'>
          <Button
            onPress={confirm}
            testID='confirm-button'
            className='bg-transparent active:bg-transparent dark:bg-transparent dark:active:bg-transparent'
            textClassName='text-white dark:text-white text-2xl text-center'
          >
            Confirm
          </Button>
        </View>
      </View>
    </>
  )

  return <>{!capturedImage ? renderCamera() : renderPreview()}</>
}
