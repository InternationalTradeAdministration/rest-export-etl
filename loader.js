const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')

const Webservices = require('./webservices')

var Loader = {
  load: (filename, entries) => {
    const jsonString = JSON.stringify(entries, null, 2)
    return Loader.loadToFs(filename, jsonString)
      .then(() => Loader.loadToS3Bucket(filename, jsonString))
      .then(() => Webservices.freshen())
  },

  loadToFs: (filename, jsonString) => {
    return new Promise((resolve) => {
      if (fs.existsSync('./output')) {
        console.log(`writing ${filename}`)
        fs.writeFile(`./output/${filename}`, jsonString, (err) => {
          if (err) throw err
          console.log(`Successfully saved ${filename}`)
          resolve()
        })
      } else {
        console.log('skipping loadToFs: output directory is not present')
        resolve()
      }
    })
  },

  loadToS3Bucket: (filename, jsonString) => {
    return new Promise((resolve) => {
      console.log(`loading ${filename} to S3://${process.env.S3_BUCKET}`)
      const params = {
        Body: jsonString,
        Bucket: process.env.S3_BUCKET,
        Key: filename,
        ACL: 'public-read',
        ContentType: 'application/json'
      }
      const s3 = new S3()
      s3.putObject(params, (err) => {
        if (err) throw err
        console.log(`File successfully uploaded: ${filename}`)
        resolve()
      })
    })
  }
}

module.exports = Loader
