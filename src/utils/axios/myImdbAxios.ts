import axios from "axios"

const myImdbAxios = axios.create()

myImdbAxios.interceptors.request.use(async (config) => {
  if (!config.headers) return config
  return config
})

export default myImdbAxios
