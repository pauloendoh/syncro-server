import axios from "axios"

const myImdbAxios = axios.create()
myImdbAxios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL

myImdbAxios.interceptors.request.use(async (config) => {
  if (!config.headers) return config
  config.headers["x-rapidapi-host"] = "imdb8.p.rapidapi.com"
  config.headers["x-rapidapi-key"] = String(process.env.RAPIDAPI_KEY)
  return config
})

export default myImdbAxios
