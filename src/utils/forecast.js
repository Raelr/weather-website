const request = require('request')

const forecast = (latitude, longitude, callback) => {
  const url = 'https://api.darksky.net/forecast/92239d98169ec3809940b6361ea97e73/'+latitude+','+longitude+'?units=si'
  request({url, json: true}, (error, {body}) => {
    if (error) {
      callback('Unable to reach weather services!')
    } else if (body.error) {
      callback('Invalid coordinates. Please re-enter latitude and longitude values!')
    } else {
      var forecast = body.daily.data[0].summary + ' With a current temperature of ' + body.currently.temperature + ' degrees.\n'
      + 'There is a ' + body.currently.precipProbability + '% chance of rain.'
      var otherData = 'There is a humidity of: ' + body.daily.data[0].humidity + "%, a visibility of: " + body.daily.data[0].visibility
      + "%, and a cloud cover of: " + body.daily.data[0].cloudCover + "%"
    }
    const output = {
      forecast: forecast,
      other: otherData
    }
    callback(undefined, output)
  })
}

module.exports = forecast
