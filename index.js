'use strict'

const Extractor = require('./extractor')
const Transformer = require('./transformer')
const Loader = require('./loader')

module.exports = {
  handler: (_event, _context, callback) => {
    Extractor.extract(process.env.SOURCE_URL)
      .then((entries) => Transformer.transform(entries))
      .then((entries) => Loader.load('entries.json', entries))
  }
}
