import serviceAxios from "./serviceAxios";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {NextRouter} from "next/router";

const useServiceAxios = async <T, K>(config: AxiosRequestConfig<K>, router: NextRouter): Promise<AxiosResponse<T>> => {
  return serviceAxios(config).then((response: AxiosResponse<T>) => {
    return response
  }).catch(error => {
    console.log(error)
    router.push('/')
    throw error
  })
}

export default useServiceAxios