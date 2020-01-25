const _ = require('lodash')
const request = require('request')

var Webservices = {
  freshen: () => {
    return new Promise((resolve, reject) => {
      const url = new URL(process.env.WEBSERVICES_FRESHEN_URL)
      url.searchParams.set('api_key', process.env.WEBSERVICES_API_KEY)
      request(url.href, (_err, _res, bodyString) => {
        const body = JSON.parse(bodyString)
        if (_.isNil(body.success)) {
          reject(body)
        } else {
          console.log(body.success)
          resolve(body)
        }
      })
    })
  }
}

module.exports = Webservices
