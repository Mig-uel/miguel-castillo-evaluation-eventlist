const eventsListElement = document.querySelector('.events-list')

async function postEvent() {}

async function loadEvents() {
  const res = await fetch('http://localhost:3100/events')
  const data = await res.json()

  const eventsList = data.map((ev) => {
    const li = document.createElement('li')
    li.innerText = ev.eventName

    return li
  })

  eventsListElement.append(...eventsList)
}

loadEvents()

const addButtonElement = document.querySelector('.add-event')
const addFormElement = document.querySelector('.add-event-form')

addButtonElement.addEventListener('click', () => {
  addFormElement.style.display = 'block'
})
