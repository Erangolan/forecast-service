require('dotenv').config()

const packagejson = require('../package.json')

const {
  PORT,
  API_KEY1,
  API_KEY2,
  API_KEY3,
  LOCATION_API_URL,
  FORECAST_API_URL,
  LOCATION_API_AUTOCOMPLETE,
} = process.env

module.exports = {
  PORT,
  API_KEY1,
  API_KEY2,
  API_KEY3,
  LOCATION_API_URL,
  FORECAST_API_URL,
  LOCATION_API_AUTOCOMPLETE,
  SERVICE_NAME: `${packagejson.name}:${packagejson.version}`,
}
