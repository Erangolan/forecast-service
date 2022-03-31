/* eslint-disable no-mixed-operators */
const axios = require('axios')

const {
  API_KEY,
  LOCATION_API_URL,
  FORECAST_API_URL,
} = require('../../consts')
const { handler } = require('../controllers/forecast.controller')

module.exports = (async (req, res) => {
  const {
    query: {
      locationName,
    },
  } = req

  try {
    const {
      data,
    } = await axios(`${LOCATION_API_URL}/search?apikey=${API_KEY}&q=${locationName}`)

    if (!data.length) {
      throw new Error('range error')
    }

    console.log('fetched key successfully')

    const {
      Key: locationKey,
    } = data[0]

    const {
      data: {
        DailyForecasts,
      },
    } = await axios(`${FORECAST_API_URL}/${locationKey}?apikey=${API_KEY}&details=true`)

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

    return res.status(500).json({
      error: e,
    })
  }
})
