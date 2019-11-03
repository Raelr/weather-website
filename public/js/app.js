const form = document.querySelector('form')
const search = document.querySelector('input')
const errorMessage = document.querySelector('#error')
const weatherMessage = document.querySelector('#forecast')

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const location = search.value
  fetch('http://localhost:3000/weather?location=' + encodeURIComponent(search.value)).then((response) => {
    response.json().then((data) => {
      if (data.error) {
        weatherMessage.textContent = ''
        return errorMessage.textContent = 'Error: ' + data.error
      }
      errorMessage.textContent = 'Forecast for: ' + data.location + ':\n'
      weatherMessage.textContent = data.forecast
    })
  })
})
