const path = require("path")
const express = require("express")
const hbs = require("hbs")
const forecast = require("./utils/forecast")
const geocode = require("./utils/geocode")

const app = express()

// Define paths for Express configuration
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup Handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'Aryeh'
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
    name: 'Aryeh'
  })
})

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    message: 'This is the help page',
    name: 'Aryeh'
  })
})

app.get('/weather', (req, res) => {
  if (!req.query.location) {
    return res.send({error: 'No location has been specified!'})
  }

  geocode(req.query.location, (error, {latitude, longitude, location} = {}) => {
    if (error) {
      return res.send({error: error})
    }
    forecast(latitude, longitude, (error, data) => {
      if (error) {
        return res.send({error: error})
      }
      res.send({location,forecast: data})
    })
  })
})

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term!'
    })
  }
  console.log(req.query.search)
  res.send({
    products: []
  })
})

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    message: 'Could not find help article!',
    name: 'Aryeh'
  })
})

app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    message: 'Could not find the requested URL!',
    name: 'Aryeh'
  })
})

app.listen(3000, () => {
  console.log("Server has started corretly on port 3000")
})
