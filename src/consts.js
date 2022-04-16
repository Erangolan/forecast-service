require('dotenv').config()

const packagejson = require('../package.json')

const {
  PORT,
  LOCATION_API_URL,
  FORECAST_API_URL,
  LOCATION_API_AUTOCOMPLETE,
  SERVICE_URI,
  KEYS,
} = process.env

const API_KEYS = KEYS.split(',')

module.exports = {
  PORT,
  LOCATION_API_URL,
  FORECAST_API_URL,
  LOCATION_API_AUTOCOMPLETE,
  SERVICE_URI,
  API_KEYS,
  SERVICE_NAME: `${packagejson.name}:${packagejson.version}`,
}
