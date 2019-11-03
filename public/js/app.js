const form = document.querySelector('form')
const search = document.querySelector('input')
const errorMessage = document.querySelector('#error')
const weatherMessage = document.querySelector('#forecast')
const other = document.querySelector('#other_data')

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const location = search.value
  fetch('/weather?location=' + encodeURIComponent(search.value)).then((response) => {
    response.json().then((data) => {
      if (data.error) {
        weatherMessage.textContent = ''
        other.textContent = ''
        return errorMessage.textContent = 'Error: ' + data.error
      }
      errorMessage.textContent = 'Forecast for: ' + data.location + ':\n'
      weatherMessage.textContent = data.data.forecast
      console.log('Other: ', data.data.other)
      other.textContent = data.data.other
    })
  })
})
