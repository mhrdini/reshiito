import { default as Constants } from 'expo-constants'
import { api as apiConfig } from '@config/shared'
import { APP_ENV, API_URL as envApiUrl } from '@env'
import ky from 'ky'

// Determine the correct API URL
const getApiUrl = () => {
  const url = (function () {
    switch (APP_ENV) {
      case 'development': {
        const host = Constants.expoConfig?.hostUri?.split(':')[0]
        const port = '8000'
        return `http://${host}:${port}`
      }
      default:
        return envApiUrl
    }
  })()

  return url
}

export const API_VERSION = apiConfig.API_VERSION
export const API_URL = getApiUrl()
export const API_PREFIX_URL = API_URL + '/api/' + API_VERSION

export const api = ky.create({
  prefixUrl: API_PREFIX_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: apiConfig.TIMEOUT,
})

// export const ocrApi = api.extend(options => ({
//   prefixUrl: `${options.prefixUrl}/ocr`,
// }))
