const axios = require('axios')
const { API_KEYS } = require('../../consts')

const retry = async (method, url, params, retryNum = 0) => {
  try {
    const {
      data: body,
      status: statusCode,
    } = await axios({
      method,
      url,
      params: {
        ...params,
        apikey: API_KEYS[retryNum],
      },
    })

    return {
      body,
      statusCode,
    }
  } catch ({ response }) {
    return retryNum > 1 ? {
      body: response.data,
      statusCode: response.status,
    } : retry(method, url, params, retryNum + 1)
  }
}

module.exports = async (options) => {
  const {
    url,
    params,
    method = 'get',
  } = options

  try {
    const {
      body,
      statusCode,
    } = await retry(method, url, params)

    return {
      body,
      statusCode,
    }
  } catch (error) {
    return error
  }
}
