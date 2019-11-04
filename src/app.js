const path = require("path")
const express = require("express")
const hbs = require("hbs")
const forecast = require("./utils/forecast")
const geocode = require("./utils/geocode")
const statsD = require('hot-shots')
// server.js
var dd_options = {
  'response_code':true,
  'tags': ['env:staging']
}

var connect_datadog = require('connect-datadog')(dd_options);

var dogstats = new statsD()

const app = express()

const port = process.env.PORT || 3000

// Define paths for Express configuration
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup Handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Add the datadog-middleware before your router
app.use(connect_datadog);
// Setup static directory
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
  dogstats.increment('node.page.views.index', ['method:GET', 'route:contacts']);
  dogstats.increment('node.page.views', tags = ['views.index'], ['method:GET', 'route:contacts']);
  res.render('index', {
    title: 'Weather',
    name: 'Aryeh'
  })
})

app.get('/about', (req, res) => {
  dogstats.increment('node.page.views.about', ['method:GET', 'route:contacts']);
  dogstats.increment('node.page.views', tags=['views.about'], ['method:GET', 'route:contacts']);
  res.render('about', {
    title: 'About',
    name: 'Aryeh'
  })
})

app.get('/help', (req, res) => {
  dogstats.increment('node.page.views.help', ['method:GET', 'route:contacts']);
  dogstats.increment('node.page.views', tags=['views.help'], ['method:GET', 'route:contacts']);
  res.render('help', {
    title: 'Help',
    message: 'This is the help page',
    name: 'Aryeh'
  })
})

app.get('/weather', (req, res) => {
  dogstats.increment('node.weather.requests', ['method:GET', 'route:contacts']);
  if (!req.query.location) {
    return res.send({error: 'No location has been specified!'})
  }

  geocode(req.query.location, (error, {latitude, longitude, location} = {}) => {
    if (error) {
      dogstats.increment('node.errors', ['method:GET', 'route:contacts']);
      return res.send({error: error})
    }
    forecast(latitude, longitude, (error, data) => {
      if (error) {
        dogstats.increment('node.errors', ['method:GET', 'route:contacts']);
        return res.send({error: error})
      }
      res.send({location, data: data})
    })
  })
})

app.get('/help/*', (req, res) => {
  dogstats.increment('node.page.views.404', ['method:GET', 'route:contacts']);
  dogstats.increment('node.page.views', tags=['views.404'], ['method:GET', 'route:contacts']);
  dogstats.increment('node.errors', ['method:GET', 'route:contacts']);
  res.render('404', {
    title: '404',
    message: 'Could not find help article!',
    name: 'Aryeh'
  })
})

app.get('*', (req, res) => {
  dogstats.increment('node.page.views.404', ['method:GET', 'route:contacts']);
  dogstats.increment('node.page.views', tags=['views.404'], ['method:GET', 'route:contacts']);
  dogstats.increment('node.errors', ['method:GET', 'route:contacts']);
  res.render('404', {
    title: '404',
    message: 'Could not find the requested URL!',
    name: 'Aryeh'
  })
})

app.listen(port, () => {
  console.log("Server has started corretly on port: " + port)
})
