const router = require('express').Router()
const axios = require('axios')
const {
  API_KEY,
  LOCATION_API_AUTOCOMPLETE,
} = require('../../consts')

router.get('/', async (req, res) => {
  const {
    query: {
      text,
    },
  } = req

  try {
    if (!text) {
      throw new Error('invalid query')
    }

    console.log('fetching autocompleting cities')

    const {
      data,
    } = await axios(`${LOCATION_API_AUTOCOMPLETE}?q=${text}&apikey=${API_KEY}`)

    console.log('first api request succeed')

    return res.json({
      cities: data,
    })
  } catch (e) {
    console.log({ stack: e.stack }, 'error with autocomplete route', { message: e.toString() })

    return res.status(500).json({
      error: e,
    })
  }
})

module.exports = router
