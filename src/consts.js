require('dotenv').config()

const packagejson = require('../package.json')

const {
  DB_HOST,
  DB_USER,
  DB_PASS,
  PORT,
  API_KEY,
  LOCATION_API_URL,
  FORECAST_API_URL,
  LOCATION_API_AUTOCOMPLETE,
} = process.env

module.exports = {
  DB_HOST,
  DB_USER,
  DB_PASS,
  PORT,
  API_KEY,
  LOCATION_API_URL,
  FORECAST_API_URL,
  LOCATION_API_AUTOCOMPLETE,
  SERVICE_NAME: `${packagejson.name}:${packagejson.version}`,
}
