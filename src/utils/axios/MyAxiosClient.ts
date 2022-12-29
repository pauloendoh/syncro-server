import axios from "axios"

// GAMBI!!! Wrapper around axios to be able to mock it
// maybe there's a better way, but this will do for now =)
const get = axios.get
const interceptorRequestUse = axios.interceptors.request.use

export class MyAxiosClient {
  constructor(private myAxios = axios.create()) {}

  setRequestInterceptor(...params: Parameters<typeof interceptorRequestUse>) {
    this.myAxios.interceptors.request.use(...params)
  }

  async get<T>(...params: Parameters<typeof get>) {
    return this.myAxios.get<T>(...params)
  }
}
