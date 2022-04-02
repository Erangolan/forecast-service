const router = require('express').Router()
const axios = require('axios')
const yup = require('yup')
let index = require('../../../index')
const {
  API_KEY1,
  API_KEY2,
  API_KEY3,
  LOCATION_API_AUTOCOMPLETE,
} = require('../../consts')
const withSchema = require('../middleware/with-schema')

const schema = yup.object({
  query: yup.object({
    text: yup.string().matches(/^[a-zA-Z\s/g]/g).required(),
  }),
})

router.get('/', withSchema(schema), (async (req, res) => {
  const {
    query: {
      text,
    },
  } = req

  try {
    console.log('tring to fetch autocompleting cities')
    let response

    if (index === 0) {
      response = await axios(`${LOCATION_API_AUTOCOMPLETE}?q=${text}&apikey=${API_KEY1}`)
    } else if (index === 1) {
      response = await axios(`${LOCATION_API_AUTOCOMPLETE}?q=${text}&apikey=${API_KEY2}`)
    } else if (index === 2) {
      response = await axios(`${LOCATION_API_AUTOCOMPLETE}?q=${text}&apikey=${API_KEY3}`)
    }

    const { data = {} } = response

    console.log(data)
    console.log(`api request succeed at ${index + 1} trial`)
    index = 0

    return res.json({
      cities: data,
    })
  } catch (e) {
    if (index > 1) {
      console.log({ stack: e.stack }, 'error with autocomplete route', { message: e.toString() })
      const { response: { status = {}, data: { Message: message = '' } } } = e

      index = 0
      return res.status(status || 500).json({
        error: e,
        message: message || '',
      })
    }

    index += 1
    return res.redirect(`http://localhost:3000/api/autocomplete?text=${text}`)
  }
}))

module.exports = router
