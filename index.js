/* eslint-disable prefer-const */
const express = require('express')

const app = express()

app.use(express.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type')
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'POST')
    return res.status(200).json({})
  }
  return next()
})

app.use('/api', require('./src/api'))

let index = 0

app.listen(3000, () => console.log('server listening on port 3000'))

module.exports = index
