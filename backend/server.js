const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')
require("dotenv").config()
const app = express()

app.use(express.json())
app.use(cors({ origin: "*" }))

/** routes */
const rootURL = "/api/v1";
app.post(`${rootURL}/contact-form`, async (req, res) => {
  try {
    const { name, phoneNumber, alternativeNumber, state, deliveryAddress, plan } = req.body;

    if (!name || !phoneNumber || !state || !deliveryAddress || !phoneNumber) {
      return res.status(400).json({ msg: "Please fill all required fields!", status: false })
    }

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.PASSWORD,
      },
    })

    let message = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: "NEW ORDER",
      html: `<div>
        <div><span style="font-weight: bold">Customer Name</span>: ${name}</div>
        <br />

        <div><span style="font-weight: bold">Phone Number</span>: ${phoneNumber}</div>
        <br />

        ${alternativeNumber ? `<div><span style="font-weight: bold">Alternative Number</span>: ${alternativeNumber}</div>
        <br />` : ''}

        <div><span style="font-weight: bold">State</span>: ${state}</div>
        <br />

        <div><span style="font-weight: bold">Delivery Address</span>: ${deliveryAddress}</div>
        <br />

        <div><span style="font-weight: bold">Plan</span>: ${plan}</div>
      </div>`
    }

    transporter
      .sendMail(message)
      .then((response) => {
        return res.status(201).json({ msg: 'Order submitted successfully', status: true })
      })
      .catch((error) => {
        return res.status(400).json({ msg: error, status: false })
      })
  }
  catch (err) {
    return res.status(500).json({ msg: err.message, status: false })
  }
})


const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
