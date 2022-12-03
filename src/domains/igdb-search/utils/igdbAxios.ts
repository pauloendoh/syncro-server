import axios from "axios"

const igdbAxios = axios.create()
igdbAxios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL

igdbAxios.interceptors.request.use(async (config) => {
  if (!config.headers) return config
  config.headers["authorization"] = String(process.env.IGDB_BEARER_TOKEN)
  config.headers["client-id"] = "3kulho9acu8tei61dngxk26id82cld"
  return config
})

export default igdbAxios
