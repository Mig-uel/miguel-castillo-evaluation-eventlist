const BASE_URL = 'http://localhost:3100/events'
const eventsListElement = document.querySelector('.events-list-body')
const addEventFormElement = document.querySelector('.add-event-form')

async function loadEvents() {
  try {
    const res = await fetch(BASE_URL)
    const data = await res.json()

    if (!data || !Array.isArray(data)) {
      console.error('Invalid data format received:', data)
      return
    }

    const eventsList = data.map((ev) => {
      const tr = document.createElement('tr')
      tr.classList.add('event-item')

      const eventNameElement = document.createElement('td')
      eventNameElement.classList.add('event-name')
      eventNameElement.textContent = ev.eventName

      const startDateElement = document.createElement('td')
      startDateElement.classList.add('event-start')
      startDateElement.textContent = ev.startDate

      const endDateElement = document.createElement('td')
      endDateElement.classList.add('event-end')
      endDateElement.textContent = ev.endDate

      const deleteButtonElement = document.createElement('td')
      deleteButtonElement.classList.add('event-delete')
      const deleteButton = document.createElement('button')
      deleteButton.classList.add('delete-button')
      deleteButton.textContent = 'Delete'
      deleteButton.addEventListener('click', async (e) => {
        e.stopPropagation()
        await fetch(`${BASE_URL}/${ev.id}`, { method: 'DELETE' })
        tr.remove()
      })

      deleteButtonElement.appendChild(deleteButton)
      tr.appendChild(eventNameElement)
      tr.appendChild(startDateElement)
      tr.appendChild(endDateElement)
      tr.appendChild(deleteButtonElement)

      return tr
    })

    eventsListElement.append(...eventsList)
  } catch (error) {
    console.error('Error loading events:', error)
    return
  }
}

function createEventRow(event) {
  const tr = document.createElement('tr')
  tr.classList.add('event-item')

  const eventNameElement = document.createElement('td')
  eventNameElement.classList.add('event-name')
  eventNameElement.textContent = event.eventName

  const startDateElement = document.createElement('td')
  startDateElement.classList.add('event-start')
  startDateElement.textContent = event.startDate

  const endDateElement = document.createElement('td')
  endDateElement.classList.add('event-end')
  endDateElement.textContent = event.endDate

  const deleteButtonElement = document.createElement('td')
  deleteButtonElement.classList.add('event-delete')
  const deleteButton = document.createElement('button')
  deleteButton.classList.add('delete-button')
  deleteButton.textContent = 'Delete'
  deleteButton.addEventListener('click', async () => {
    await fetch(`${BASE_URL}/${event.id}`, { method: 'DELETE' })
    tr.remove()
  })

  deleteButtonElement.appendChild(deleteButton)
  tr.appendChild(eventNameElement)
  tr.appendChild(startDateElement)
  tr.appendChild(endDateElement)
  tr.appendChild(deleteButtonElement)

  return tr
}

loadEvents()

// Add event listener for the form submission to add a new event
addEventFormElement.addEventListener('submit', async (e) => {
  e.preventDefault()
  e.stopPropagation()

  const eventName = addEventFormElement.querySelector('[name="eventName"]')
  const startDate = addEventFormElement.querySelector('[name="startDate"]')
  const endDate = addEventFormElement.querySelector('[name="endDate"]')

  if (!eventName.value || !startDate.value || !endDate.value) return

  const event = {
    eventName: eventName.value,
    startDate: startDate.value,
    endDate: endDate.value,
  }

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  })

  if (res.ok) {
    const data = await res.json()
    eventsListElement.appendChild(createEventRow(data))
    addEventFormElement.reset()
  } else {
    console.error('Error adding event:', res.statusText)
  }
})
