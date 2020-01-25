const _ = require('lodash')
const fs = require('fs')

var Transformer = {
  transform: (entries) => {
    console.log(`transforming ${entries.length}`)
    return new Promise((resolve, reject) => {
      const countryHash = JSON.parse(fs.readFileSync('./countries.json'))

      entries.forEach((entry) => {
        const locations = Transformer.stringToArray(entry['country-region-location'])
        entry.countries = Transformer.lookupValues(countryHash, locations)

        entry.industries = Transformer.stringToArray(entry.industry)
        // delete entry.industry

        entry.trade_topics = Transformer.stringToArray(entry['trade-topics'])
        // delete entry['trade-topics']
      })
      resolve(entries)
    })
  },

  lookupValues: (lookupHash, values) => {
    return values.map((value) => lookupHash[value.toLowerCase()]).filter(i => i).sort()
  },

  stringToArray: (value) => {
    if (_.isEmpty(value)) {
      return []
    } else {
      return _.split(value, ',').map((item) => {
        return item.replace(/\s+/g, ' ').trim()
      }).sort()
    }
  }
}

module.exports = Transformer
