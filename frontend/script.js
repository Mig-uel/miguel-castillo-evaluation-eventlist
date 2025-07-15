const BASE_URL = 'http://localhost:3000/events'

const eventsListElement = document.querySelector('.events-list-body')
const addEventFormElement = document.querySelector('.add-event-form')
const addEventButtonElement = document.querySelector('.add-event-button')

// Load events from the server and populate the table
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

// Helper function to create a table data element
function createTableDataElement(content, className) {
  const td = document.createElement('td')
  td.classList.add(className)
  td.textContent = content
  return td
}

// Helper function to create a table data element with an input field
function createTableDataElementWithInput(value, type = 'text') {
  const td = document.createElement('td')

  const input = document.createElement('input')
  input.type = type
  input.value = value
  input.required = true
  td.appendChild(input)
  return td
}

// Helper function to create an action button
function createActionButton(svgContent, className) {
  const button = document.createElement('button')
  button.classList.add(className)
  button.innerHTML = svgContent
  // button.addEventListener('click', clickHandler)
  return button
}

// Helper to create editable row for inline editing
function createEditableRow(event, originalTr) {
  const tr = document.createElement('tr')
  tr.classList.add('event-item')

  // Create table data elements for editable fields
  const eventNameTd = createTableDataElementWithInput(event.eventName)
  const startDateTd = createTableDataElementWithInput(event.startDate, 'date')
  const endDateTd = createTableDataElementWithInput(event.endDate, 'date')

  // Create action td element
  const actionButtonsTd = document.createElement('td')
  actionButtonsTd.classList.add('event-actions')

  // Create a save button
  const saveButton = createActionButton(
    `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;width:1em;height:1em;"><path d="M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z" fill="currentColor"/></svg>`,
    'event-save-button'
  )
  saveButton.addEventListener('click', async () => {
    if (!eventNameInput.value || !startDateInput.value || !endDateInput.value)
      return
    const updatedEvent = {
      eventName: eventNameInput.value,
      startDate: startDateInput.value,
      endDate: endDateInput.value,
    }
    const res = await fetch(`${BASE_URL}/${event.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEvent),
    })
    if (res.ok) {
      const data = await res.json()
      tr.replaceWith(createEventRow(data))
    } else {
      alert('Failed to update event')
    }
  })
  saveTd.appendChild(saveButton)

  // Create a cancel button
  const cancelButton = createActionButton(
    `<svg focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" style="vertical-align:middle;width:1em;height:1em;"><path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z" fill="currentColor"/></svg>`,
    'event-cancel-button'
  )
  cancelButton.addEventListener('click', () => {
    tr.replaceWith(originalTr)
  })

  // Append buttons to the action buttons td
  actionButtonsTd.appendChild(saveButton)
  actionButtonsTd.appendChild(cancelButton)

  // Append all elements to the row
  tr.appendChild(eventNameTd)
  tr.appendChild(startDateTd)
  tr.appendChild(endDateTd)
  tr.appendChild(actionButtonsTd)

  return tr
}

function createEventRow(event) {
  // Create a new table row for the event
  const tr = document.createElement('tr')
  tr.classList.add('event-item')

  // Create table data elements for event properties
  const eventNameElement = createTableDataElement(event.eventName, 'event-name')
  const startDateElement = createTableDataElement(
    event.startDate,
    'event-start'
  )
  const endDateElement = createTableDataElement(event.endDate, 'event-end')

  // Create a table data element for the actions buttons
  const actionsElement = document.createElement('td')
  actionsElement.classList.add('event-actions')

  // Create delete buttons
  const editButton = createActionButton(
    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
  <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
</svg>`,
    'event-edit-button'
  )
  // Add event listener for the edit button
  editButton.addEventListener('click', () => {
    const editableRow = createEditableRow(event, tr)
    tr.replaceWith(editableRow)
  })

  // Create delete button
  const deleteButton = createActionButton(
    `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small" style="vertical-align:middle;width:1em;height:1em;"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"></path></svg>`,
    'delete-button'
  )
  // Add event listener for the delete button
  deleteButton.addEventListener('click', async () => {
    await fetch(`${BASE_URL}/${event.id}`, { method: 'DELETE' })
    tr.remove()
  })

  // Append buttons to the actions element
  actionsElement.appendChild(editButton)
  actionsElement.appendChild(deleteButton)

  // Append all elements to the row
  tr.appendChild(eventNameElement)
  tr.appendChild(startDateElement)
  tr.appendChild(endDateElement)
  tr.appendChild(actionsElement)

  return tr
}

function createEmptyRowWithForm() {
  const tr = document.createElement('tr')
  tr.classList.add('event-item')

  const td = document.createElement('td')
  td.colSpan = 4 // spans all columns

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
  cancelButton.innerHTML = `<svg focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" style="vertical-align:middle;width:1em;height:1em;"><path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z" fill="currentColor"/></svg>`
  cancelButton.addEventListener('click', () => {
    tr.remove()
  })

  form.appendChild(eventNameInput)
  form.appendChild(startDateInput)
  form.appendChild(endDateInput)
  form.appendChild(addButton)
  form.appendChild(cancelButton)

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

  td.appendChild(form)
  tr.appendChild(td)
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
