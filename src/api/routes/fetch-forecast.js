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
} = require('../../consts')

const withSchema = require('../middleware/with-schema')

const schema = yup.object({
  query: yup.object({
    locationName: yup.string().matches(/^[a-zA-Z]+$/g).required(),
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

    if (response === undefined) {
      throw new Error('apis rate limit')
    }

    const { data } = response

    if (!data.length) {
      throw new Error('range error')
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

    console.log('daily forecast: ', daily)

    return res.json({
      data: daily,
    })
  } catch (e) {
    console.log({ stack: e.stack }, 'error with fetch-forecast route', { message: e.toString() })

    if (index > 2) {
      index = 0
      return res.status(500).json({
        error: e,
      })
    }

    console.log(`trial number ${index + 1} failed`)

    index += 1
    return res.redirect(`http://localhost:3000/api/fetch-forecast?locationName=${locationName}`)
  }
}))

module.exports = router
