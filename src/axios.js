import Axios from 'axios'

const axios = Axios.create({
  baseURL: 'http://localhost/api',
  timeout: 10000
})

export default axios