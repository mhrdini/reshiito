import { Camera } from 'expo-camera'
import { useRouter } from 'expo-router'
import { Button } from '@ui/components'

export const TakePhotoButton = () => {
  const router = useRouter()
  const handlePress = () => {
    router.navigate('/camera')
  }

  return <Button onPress={handlePress}>Take Photo</Button>
}
