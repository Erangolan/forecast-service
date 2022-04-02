const router = require('express').Router()
const axios = require('axios')
const yup = require('yup')
let index = require('../../../index')
const {
  API_KEY1,
  API_KEY2,
  API_KEY3,
  LOCATION_API_URL,
  FORECAST_API_URL,
  SERVICE_URI,
} = require('../../consts')

const withSchema = require('../middleware/with-schema')

const schema = yup.object({
  query: yup.object({
    locationName: yup.string().matches(/^[a-zA-Z\s/g]/g).required(),
  }),
})

const { handler } = require('../controllers/forecast.controller')

router.get('/', withSchema(schema), (async (req, res) => {
  const {
    query: {
      locationName,
    },
  } = req

  try {
    console.log('tring to fetch location key, in fetch-forecast')
    let response

    if (index === 0) {
      response = await axios(`${LOCATION_API_URL}/search?apikey=${API_KEY1}&q=${locationName}`)
    } else if (index === 1) {
      response = await axios(`${LOCATION_API_URL}/search?apikey=${API_KEY2}&q=${locationName}`)
    } else if (index === 2) {
      response = await axios(`${LOCATION_API_URL}/search?apikey=${API_KEY3}&q=${locationName}`)
    }

    const { data = {} } = response

    if (data === {}) {
      throw new Error('apis rate limit')
    }

    console.log('fetched key successfully')

    const {
      Key: locationKey,
    } = data[0]

    if (index === 0) {
      response = await axios(`${FORECAST_API_URL}/${locationKey}?apikey=${API_KEY1}&details=true`)
    } else if (index === 1) {
      response = await axios(`${FORECAST_API_URL}/${locationKey}?apikey=${API_KEY2}&details=true`)
    } else if (index === 2) {
      response = await axios(`${FORECAST_API_URL}/${locationKey}?apikey=${API_KEY3}&details=true`)
    }

    const { data: { DailyForecasts } } = response

    console.log('fetched forecast successfully')

    const daily = DailyForecasts.map((item) => {
      const {
        Date,
        Temperature,
        Day,
        Night,
        HoursOfSun,
      } = item

      const id = Date.slice(0, 10)
      const { Minimum: minF, Maximum: maxF } = Temperature
      const { Icon: dayIcon, ShortPhrase: ShortPhraseDay } = Day
      const { Icon: nightIcon, ShortPhrase: ShortPhraseNight } = Night

      const minC = handler(minF)
      const maxC = handler(maxF)

      return {
        id,
        minF,
        maxF,
        minC,
        maxC,
        dayIcon,
        nightIcon,
        ShortPhraseDay,
        ShortPhraseNight,
        HoursOfSun,
      }
    })

    console.log(`daily forecast: , ${daily}, index = ${index}`)
    index = 0

    return res.json({
      data: daily,
    })
  } catch (e) {
    console.log(`trial number ${index + 1} failed`)
    if (index > 1) {
      console.log({ stack: e.stack }, 'error with autocomplete route', { message: e.toString() })
      const { response: { status = 500, data: { Message: message = '' } } } = e

      index = 0
      return res.status(status).json({
        error: e,
        message: message || '',
      })
    }

    index += 1
    return res.redirect(`${SERVICE_URI}/fetch-forecast?locationName=${locationName}`)
  }
}))

module.exports = router
