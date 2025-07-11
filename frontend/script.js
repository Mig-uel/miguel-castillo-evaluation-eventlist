const BASE_URL = 'http://localhost:3100/events'
const eventsListElement = document.querySelector('.events-list-body')
const addEventFormElement = document.querySelector('.add-event-form')
const addEventButtonElement = document.querySelector('.add-event-button')

async function loadEvents() {
  try {
    const res = await fetch(BASE_URL)
    const data = await res.json()

    if (!data || !Array.isArray(data)) {
      console.error('Invalid data format received:', data)
      return
    }

    const eventsList = data.map((ev) => createEventRow(ev))

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

  // Create delete button
  const deleteButtonElement = document.createElement('td')
  deleteButtonElement.classList.add('event-delete')
  const deleteButton = document.createElement('button')
  deleteButton.classList.add('delete-button')
  deleteButton.innerHTML = `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small" style="vertical-align:middle;width:1em;height:1em;"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"></path></svg>`
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

function createEmptyRowWithForm() {
  const tr = document.createElement('tr')
  tr.classList.add('event-item')

  const formCell = document.createElement('td')
  formCell.colSpan = 4 // Span across all columns

  const form = document.createElement('form')
  form.classList.add('add-event-form')
  form.innerHTML = `
    <input type="text" name="eventName" placeholder="Event Name" required>
    <input type="date" name="startDate" required>
    <input type="date" name="endDate" required>
    <button type="submit">Add Event</button>
  `

  formCell.appendChild(form)
  tr.appendChild(formCell)

  return tr
}

loadEvents()

// TODO => add edit, delete, and save button function with custom args

// Add event listener for the "Add Event" button to toggle the form visibility
addEventButtonElement.addEventListener('click', () => {
  const emptyRow = createEmptyRowWithForm()
  eventsListElement.appendChild(emptyRow)
})

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
