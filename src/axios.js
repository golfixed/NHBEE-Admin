import Axios from 'axios'

const axios = Axios.create({
  baseURL: 'http://10.35.30.140/api',
  timeout: 10000
})

export default axios