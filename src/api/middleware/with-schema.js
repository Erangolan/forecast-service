
const withSchema = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      query: req.query,
    })
    return next()
  } catch (err) {
    return res.status(500).json({
      type: err.name,
      message: err.message,
    })
  }
}

module.exports = withSchema
