import Toast from '@/helpers/toast'
import axios, { AxiosError } from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

const Api = {
  get: async function (path: string, auth?: boolean) {
    try {
      const headers: any = {}
      if (auth) {
        const token = localStorage.getItem('token') ?? ''
        headers.Authorization = `Bearer ${token}`
      }

      const response = await client({
        method: 'GET',
        url: path,
        headers,
      })

      return response.data
    } catch (e) {
      let msg = 'Terjadi kesalahan saat terhubung ke server'

      if (e instanceof AxiosError) {
        msg = e.response?.data?.message ?? 'Terjadi kesalahan saat terhubung ke server'
      }

      Toast.error(msg)
      throw e
    }
  },

  post: async function (path: string, data: object, auth?: boolean) {
    try {
      const headers: any = {
        'Content-Type': 'application/json',
      }
      if (auth) {
        const token = localStorage.getItem('token') ?? ''
        headers.Authroization = `Bearer ${token}`
      }

      const response = await client({
        method: 'POST',
        url: path,
        headers,
        data,
      })

      return response.data
    } catch (e) {
      let msg = 'Terjadi kesalahan saat terhubung ke server'

      if (e instanceof AxiosError) {
        msg = e.response?.data?.message ?? 'Terjadi kesalahan saat terhubung ke server'
      }

      Toast.error(msg)
      throw e
    }
  },

  put: async function (path: string, data: object, auth?: boolean) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authroization': '',
      }
      if (auth) {
        const token = localStorage.getItem('token') ?? ''
        headers.Authroization = `Bearer ${token}`
      }

      const response = await client({
        method: 'PUT',
        url: path,
        headers,
        data,
      })

      return response.data
    } catch (e) {
      let msg = 'Terjadi kesalahan saat terhubung ke server'

      if (e instanceof AxiosError) {
        msg = e.response?.data?.message ?? 'Terjadi kesalahan saat terhubung ke server'
      }

      Toast.error(msg)
      throw e
    }
  },
}

export default Api
