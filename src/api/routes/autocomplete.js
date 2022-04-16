const router = require('express').Router()
const yup = require('yup')
const { LOCATION_API_AUTOCOMPLETE } = require('../../consts')
const withSchema = require('../middleware/with-schema')
const api = require('../requests/request')

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

    const { body, statusCode } = await api({
      url: LOCATION_API_AUTOCOMPLETE,
      params: {
        q: text,
      },
    })

    if (statusCode !== 200) {
      return res.status(statusCode).json({
        message: body.Message,
      })
    }

    return res.json({ cities: body })
  } catch (e) {
    console.log({ stack: e.stack }, 'error with autocomplete route', { message: e.toString() })

    return res.status(503).json({
      error: e,
    })
  }
}))

module.exports = router
