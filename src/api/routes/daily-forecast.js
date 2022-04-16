const router = require('express').Router()
const yup = require('yup')
const { FORECAST_API_URL } = require('../../consts')
const api = require('../requests/request')
const withSchema = require('../middleware/with-schema')
const { handler } = require('../controllers/forecast.controller')

const schema = yup.object({
  query: yup.object({
    locationKey: yup.string().required(),
  }),
})

router.get('/', withSchema(schema), (async (req, res) => {
  const {
    query: {
      locationKey,
    },
  } = req

  try {
    console.log('tring to fetch daily forecast')

    const { body, statusCode } = await api({
      url: `${FORECAST_API_URL}/${locationKey}`,
      params: {
        details: 'true',
      },
    })

    if (statusCode !== 200) {
      return res.status(statusCode).json({
        message: body.Message,
      })
    }

    const { DailyForecasts } = body
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
    console.log({ stack: e.stack }, 'error with daily-forecast route', { message: e.toString() })

    return res.status(503).json({
      error: e,
    })
  }
}))

module.exports = router
