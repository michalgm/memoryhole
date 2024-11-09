const axios = require('axios')
const { wrapper } = require('axios-cookiejar-support')
const apiHost = process.env.PUBLIC_URL
const { CookieJar } = require('tough-cookie')

const cookieJar = new CookieJar()

const axiosInstance = wrapper(
  axios.create({
    jar: cookieJar, // Use the cookie jar
    withCredentials: true, // Send cookies with requests
  })
)

let id = null

const apiRequest = async (url, data, method = 'post') => {
  if (!id && !url.match(/auth$/)) {
    const res = await auth()
    id = res.data.id
  }

  const headers = {
    'Auth-Provider': 'dbAuth',
    Authorization: `Bearer ${id}`,
  }

  return axiosInstance({
    url,
    data,
    method,
    headers,
  })
    .then((response) => {
      if (response.data.errors) {
        throw Error('Error:', response.data.errors.join(' '))
      }
      return response
    })
    .catch((error) => {
      if (error?.response?.data?.errors) {
        console.error(error?.response?.data?.errors)
      } else {
        console.log(error?.response?.data)
      }

      throw Error('Error:', error)
    })
}

const auth = async () => {
  return await apiRequest(`${apiHost}/.redwood/functions/auth`, {
    method: 'login',
    username: process.env.IMPORT_USERNAME,
    password: process.env.IMPORT_PASSWORD,
  })
}

const logout = async () => {
  return await apiRequest(`${apiHost}/.redwood/functions/auth`, {
    method: 'logout',
  })
}

export { apiRequest, logout }
