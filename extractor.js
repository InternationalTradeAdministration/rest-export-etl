const _ = require('lodash')
const request = require('request')

var Extractor = {
  extract: (url, allEntries = [], page = 0) => {
    return new Promise((resolve, reject) => {
      const url = new URL(process.env.SOURCE_URL)
      url.searchParams.set('page', page)

      console.log(`extracting ${url.href}`)

      request.get(url.href, (err, _res, bodyString) => {
        if (err) {
          console.error(`error: ${err}`)
          reject(err)
        }
        const entries = JSON.parse(bodyString)
        allEntries.push(...entries)

        if (_.isEmpty(entries)) {
          console.log('0 entries found')
          return resolve(allEntries)
        } else {
          console.log(`${entries.length} entries found`)
          return resolve(Extractor.extract(url, allEntries, ++page))
        }
      })
    })
  }
}

module.exports = Extractor
