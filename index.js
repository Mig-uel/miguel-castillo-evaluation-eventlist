import express from 'express'
import cors from 'cors'

const app = express()
const BASE_URL = 'http://localhost:3000/events'

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app
  .route('/events')
  .get(async (req, res) => {
    const response = await fetch(BASE_URL)
    const data = await response.json()

    return res.status(200).json(data)
  })
  .post(async (req, res) => {
    const eventData = req.body

    if (!eventData)
      return res.status(400).json({
        message: 'All fields must be filled out...',
      })

    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    })

    if (!response.ok) {
      return res.status(400).json({
        message: 'Oops, something went wrong. Please try again...',
      })
    }

    const data = await response.json()

    return res.status(201).json(data)
  })

app
  .route('/events/:id')
  .delete(async (req, res) => {
    const { id } = req.params

    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok)
      return res.status(400).json({
        message: 'Oops, something went wrong. Please try again...',
      })

    return res.status(200).json({
      message: 'Deleted',
    })
  })
  .patch(async (req, res) => {
    const { id } = req.params
    const eventData = req.body

    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    })

    if (!response.ok)
      return res
        .status(400)
        .json({ message: 'Oops, something went wrong. Please try again...' })

    const data = await response.json()

    return res.status(200).json(data)
  })
  .put(async (req, res) => {
    const { id } = req.params
    const eventData = req.body

    if (
      !eventData ||
      !eventData.eventName ||
      !eventData.startDate ||
      !eventData.endDate
    )
      return res.status(400).json({
        message: 'All fields must be filled in...',
      })

    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    })

    if (!response.ok)
      return res
        .status(400)
        .json({ message: 'Oops, something went wrong. Please try again...' })

    const data = await response.json()

    return res.status(200).json(data)
  })

app.listen(3100, () => {
  console.log('SERVER RUNNING')
})
