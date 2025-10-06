import Constants from 'expo-constants'
import versionConfig from '@config/shared/api_version.json'
import { APP_ENV, API_URL as envApiUrl } from '@env'
import ky from 'ky'

// Determine the correct API URL
const getApiUrl = () => {
  let url = (function () {
    switch (APP_ENV) {
      case 'development':
        const host = Constants.expoConfig?.hostUri?.split(':')[0]
        const port = '8000'
        return `http://${host}:${port}`
      default:
        return envApiUrl
    }
  })()

  return url
}

export const API_VERSION = versionConfig.API_VERSION
export const API_URL = getApiUrl()
export const API_PREFIX_URL = API_URL + '/api/' + API_VERSION

export const api = ky.create({ prefixUrl: API_PREFIX_URL })

// export const ocrApi = api.extend(options => ({
//   prefixUrl: `${options.prefixUrl}/ocr`,
// }))
