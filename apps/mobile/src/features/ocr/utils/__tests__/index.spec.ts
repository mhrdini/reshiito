import { MOCK_CAMERA_CAPTURED, MOCK_PICKED_ASSET } from '@/constants'
import { convertToImage } from '@/features/ocr/utils'

describe('convertToImage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('converts a CameraCapturedPicture correctly', () => {
    const converted = convertToImage(MOCK_CAMERA_CAPTURED)

    expect(converted).toEqual({
      uri: MOCK_CAMERA_CAPTURED.uri,
      height: MOCK_CAMERA_CAPTURED.height,
      width: MOCK_CAMERA_CAPTURED.width,
      base64: MOCK_CAMERA_CAPTURED.base64,
    })
  })

  it('converts an ImagePickerAsset correctly', () => {
    const converted = convertToImage(MOCK_PICKED_ASSET)

    expect(converted).toEqual({
      uri: MOCK_PICKED_ASSET.uri,
      height: MOCK_PICKED_ASSET.height,
      width: MOCK_PICKED_ASSET.width,
      base64: MOCK_PICKED_ASSET.base64,
    })
  })
})
