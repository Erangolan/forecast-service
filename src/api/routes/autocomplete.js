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
    text: yup.string().matches(/^[a-zA-Z]+$/g).required(),
  }),
})

router.get('/', withSchema(schema), (async (req, res) => {
  const {
    query: {
      text,
    },
  } = req

  try {
    console.log('fetching autocompleting cities')
    let response

    if (index === 0) {
      response = await axios(`${LOCATION_API_AUTOCOMPLETE}?q=${text}&apikey=${API_KEY1}`)
    } else if (index === 1) {
      response = await axios(`${LOCATION_API_AUTOCOMPLETE}?q=${text}&apikey=${API_KEY2}`)
    } else if (index === 2) {
      response = await axios(`${LOCATION_API_AUTOCOMPLETE}?q=${text}&apikey=${API_KEY3}`)
    }

    if (response === undefined) {
      throw new Error('range error')
    }

    const { data } = response

    console.log(`api request succeed at ${index + 1} trial`)

    return res.json({
      cities: data,
    })
  } catch (e) {
    console.log({ stack: e.stack }, 'error with autocomplete route', { message: e.toString() })

    if (index > 2) {
      index = 0
      return res.status(500).json({
        error: e,
      })
    }

    index += 1
    return res.redirect(`http://localhost:3000/api/autocomplete?text=${text}`)
  }
}))

module.exports = router
