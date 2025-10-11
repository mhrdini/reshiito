import { useRouter } from 'expo-router'
import { Button } from 'ui/components'

export const TakePhotoButton = () => {
  const router = useRouter()
  const handlePress = () => {
    router.navigate('/camera')
  }

  return (
    <Button testID='take-photo-button' onPress={handlePress}>
      Take Photo
    </Button>
  )
}
