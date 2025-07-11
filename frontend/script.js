const BASE_URL = 'http://localhost:3000/events'
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

  // Create a form to wrap the inputs and add event
  const form = document.createElement('form')
  form.classList.add('add-event-form')
  form.style.display = 'flex'
  form.style.gap = '8px'

  // Event Name input
  const eventNameInput = document.createElement('input')
  eventNameInput.type = 'text'
  eventNameInput.name = 'eventName'
  eventNameInput.placeholder = 'Event Name'
  eventNameInput.required = true

  // Start Date input
  const startDateInput = document.createElement('input')
  startDateInput.type = 'date'
  startDateInput.name = 'startDate'
  startDateInput.required = true

  // End Date input
  const endDateInput = document.createElement('input')
  endDateInput.type = 'date'
  endDateInput.name = 'endDate'
  endDateInput.required = true

  // Add Event button
  const addButton = document.createElement('button')
  addButton.classList.add('add-button')
  addButton.type = 'submit'
  addButton.innerHTML = `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;width:1em;height:1em;"><path d="M12 5v14m7-7H5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`

  // Cancel button
  const cancelButton = document.createElement('button')
  cancelButton.classList.add('cancel-button')
  cancelButton.type = 'button'
  cancelButton.innerHTML = `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small" style="vertical-align:middle;width:1em;height:1em;"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"></path></svg>`
  cancelButton.addEventListener('click', () => {
    tr.remove()
  })

  // Add inputs and addButton to form
  form.appendChild(eventNameInput)
  form.appendChild(startDateInput)
  form.appendChild(endDateInput)
  form.appendChild(addButton)

  // Prevent default form submission and handle event creation
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!eventNameInput.value || !startDateInput.value || !endDateInput.value)
      return

    const event = {
      eventName: eventNameInput.value,
      startDate: startDateInput.value,
      endDate: endDateInput.value,
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
      tr.remove()
    } else {
      console.error('Error adding event:', res.statusText)
    }
  })

  // Create cells for each form input and button
  const eventNameCell = document.createElement('td')
  eventNameCell.appendChild(eventNameInput)

  const startDateCell = document.createElement('td')
  startDateCell.appendChild(startDateInput)

  const endDateCell = document.createElement('td')
  endDateCell.appendChild(endDateInput)

  const actionsCell = document.createElement('td')
  actionsCell.appendChild(addButton)
  actionsCell.appendChild(cancelButton)

  // Append cells to form row
  tr.appendChild(eventNameCell)
  tr.appendChild(startDateCell)
  tr.appendChild(endDateCell)
  tr.appendChild(actionsCell)

  return tr
}

loadEvents()

// TODO => add edit, delete, and save button function with custom args
// TODO => DRY up the code for creating event rows and empty rows with forms
// TODO => improve event listener handling to avoid memory leaks

// Add event listener for the "Add Event" button to toggle the form visibility
addEventButtonElement.addEventListener('click', () => {
  const emptyRow = createEmptyRowWithForm()
  eventsListElement.appendChild(emptyRow)
})
