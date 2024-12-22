const API_URL = "http://127.0.0.1:3000";

// Fetch and render events
async function fetchEvents() {
    const response = await fetch(`${API_URL}/events`);
    const events = await response.json();
    const eventList = document.getElementById('eventList');
    eventList.innerHTML = '';
    events.forEach(event => {
        const li = document.createElement('li');
        li.innerHTML = `${event.name} - ${event.description} - ${event.location} - ${event.date}
            <button onclick="deleteEvent('${event.name}')">Delete</button>
            <button onclick="editEvent('${event.name}')">Edit</button>`;
        eventList.appendChild(li);
    });
    fetchEventHistory();
}

// Fetch and render event history
async function fetchEventHistory() {
    const response = await fetch(`${API_URL}/event-history`);
    const eventHistory = await response.json();
    const eventHistoryList = document.getElementById('eventHistoryList');
    eventHistoryList.innerHTML = '';
    eventHistory.forEach(entry => {
        const li = document.createElement('li');
        li.innerHTML = `${entry.name} - ${entry.description} - ${entry.location} - ${entry.date} - ${entry.action}`;
        eventHistoryList.appendChild(li);
    });
}

// Add event
async function addEvent() {
    const eventName = document.getElementById('eventName').value;
    const eventDescription = document.getElementById('eventDescription').value;
    const eventLocation = document.getElementById('eventLocation').value;
    const eventDate = document.getElementById('eventDate').value;

    if (!eventName || !eventDescription || !eventLocation || !eventDate) {
        alert('Please fill in all fields');
        return;
    }

    const event = { name: eventName, description: eventDescription, location: eventLocation, date: eventDate };
    await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
    });
    fetchEvents();
}

// Delete event
async function deleteEvent(eventName) {
    await fetch(`${API_URL}/events/${eventName}`, { method: 'DELETE' });
    fetchEvents();
}

// Fetch and render attendees
async function fetchAttendees() {
    const response = await fetch(`${API_URL}/attendees`);
    const attendees = await response.json();
    const attendeeList = document.getElementById('attendeeList');
    attendeeList.innerHTML = '';
    attendees.forEach(attendee => {
        const li = document.createElement('li');
        li.innerHTML = `${attendee.name} - ${attendee.email}
            <button onclick="deleteAttendee('${attendee.name}')">Delete</button>`;
        attendeeList.appendChild(li);
    });
}

// Add attendee
async function addAttendee() {
    const attendeeName = document.getElementById('attendeeName').value;
    const attendeeEmail = document.getElementById('attendeeEmail').value;

    if (!attendeeName || !attendeeEmail) {
        alert('Please fill in all fields');
        return;
    }

    const attendee = { name: attendeeName, email: attendeeEmail };
    await fetch(`${API_URL}/attendees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendee)
    });
    fetchAttendees();
}

// Delete attendee
async function deleteAttendee(attendeeName) {
    await fetch(`${API_URL}/attendees/${attendeeName}`, { method: 'DELETE' });
    fetchAttendees();
}

// Fetch and render tasks
async function fetchTasks() {
    const response = await fetch(`${API_URL}/tasks`);
    const tasks = await response.json();
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `${task.task_name} - ${task.status}
            <button onclick="updateTask('${task.task_name}')">Update</button>`;
        taskList.appendChild(li);
    });
}

// Add task (if needed)
async function addTask() {
    const taskEventName = document.getElementById('taskEventName').value;
    const taskName = document.getElementById('taskName').value;

    if (!taskEventName || !taskName) {
        alert('Please fill in all fields');
        return;
    }

    const task = { event: taskEventName, task_name: taskName, status: 'Pending' };
    await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    });
    fetchTasks();
}

// Update task (if needed)
async function updateTask(taskName) {
    const task = { status: 'Completed' };
    await fetch(`${API_URL}/tasks/${taskName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    });
    fetchTasks();
}

// Initial data fetch
document.addEventListener('DOMContentLoaded', () => {
    fetchEvents();
    fetchAttendees();
    fetchTasks();
});
