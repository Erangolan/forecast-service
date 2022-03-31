/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const router = require('express').Router()
const fs = require('fs')
const util = require('util')

const readdir = util.promisify(fs.readdir)

const routesdir = `${__dirname}/routes`

readdir(routesdir).then((files) => {
  files.forEach((filename) => {
    router.use(`/${filename.replace(/\.[^.]*$/, '')}`, require(`${routesdir}/${filename}`))
  })
})

module.exports = router
