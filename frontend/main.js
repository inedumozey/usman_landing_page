const navigateBtn = document.getElementById('button')
const user_name = document.querySelector('.name')
const active_phone_number = document.querySelector('.phoneNumber')
const alternative_phone_number = document.querySelector('.alternativeNumber')
const state = document.querySelector('.state')
const address = document.querySelector('.deliveryAddress')
const optionError = document.querySelector('.optionError')
const options = Array.from(document.querySelectorAll('.option'));

// add api base url here
const apiBaseURL = "http://localhost:5000"

const clearInputs = () => {
  user_name.value =
    active_phone_number.value =
    state.value =
    address.value =
    alternative_phone_number.value =
    ''
}

navigateBtn.addEventListener('click', async function () {

  let optionChecked = ''
  options.map((option, i) => {
    if (option.checked) {
      optionChecked = options[i].value
      return optionChecked
    }
  })

  const formData = {
    name: user_name.value,
    phoneNumber: active_phone_number.value,
    alternativeNumber: alternative_phone_number.value,
    state: state.value,
    deliveryAddress: address.value,
    plan: optionChecked
  }

  if (!formData.name) {
    user_name.setAttribute("id", "error")
  }

  if (!formData.phoneNumber) {
    active_phone_number.setAttribute("id", "error")
  }
  if (!formData.state) {
    state.setAttribute("id", "error")
  }
  if (!formData.deliveryAddress) {
    address.setAttribute("id", "error")
  }
  if (!formData.plan) {
    optionError.setAttribute("id", "optionErrorShow")
  }

  else {
    user_name.setAttribute("id", "")
    active_phone_number.setAttribute("id", "")
    state.setAttribute("id", "")
    address.setAttribute("id", "")
    optionError.setAttribute("id", "");

    navigateBtn.value = 'Loading...'
    navigateBtn.setAttribute('disabled', true)

    try {
      //call api to submit contact form
      const response = await fetch(`${apiBaseURL}/api/v1/contact-form`, {
        method: "POST",
        mode: 'cors',
        credentials: "omit",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // body data type must match "Content-Type" header
      })

      const res = response.json()
      res
        .then(data => {
          navigateBtn.value = 'ORDER NOW'
          navigateBtn.removeAttribute('disabled');

          if (data.status) {
            window.open('thanks.html', '_blank')
            clearInputs()
          } else {
            alert(JSON.stringify(data.msg))
          }
        })
        .catch(err => {
          alert(JSON.stringify(err));
          navigateBtn.value = 'ORDER NOW'
          navigateBtn.removeAttribute('disabled');
        })
    }
    catch (err) {
      alert(JSON.stringify(err))
    }
  }
})
