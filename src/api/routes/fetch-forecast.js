const router = require('express').Router()
const yup = require('yup')
const {
  LOCATION_API_URL,
  SERVICE_URI,
} = require('../../consts')
const api = require('../funcs/request')
const withSchema = require('../middleware/with-schema')

const schema = yup.object({
  query: yup.object({
    locationName: yup.string().matches(/^[a-zA-Z\s/g]/g).required(),
  }),
})

router.get('/', withSchema(schema), (async (req, res) => {
  const {
    query: {
      locationName,
    },
  } = req

  try {
    console.log('tring to fetch location key')

    const { body: [data], statusCode } = await api({
      url: LOCATION_API_URL,
      params: {
        q: locationName,
      },
    })

    if (statusCode !== 200) {
      return res.status(statusCode).json({
        message: data.Message,
      })
    }

    const { Key: locationKey } = data
    console.log('fetched key successfully!')

    return res.redirect(`${SERVICE_URI}/daily-forecast?locationKey=${locationKey}`)
  } catch (e) {
    console.log({ stack: e.stack }, 'error with fetch-forecast route', { message: e.toString() })

    return res.status(503).json({
      error: e,
    })
  }
}))

module.exports = router
