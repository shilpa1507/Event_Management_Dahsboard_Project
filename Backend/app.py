from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# In-memory storage for events, attendees, tasks, and event history
events = []
event_history = []
attendees = []
tasks = []

# Event Management APIs
@app.route('/events', methods=['POST'])
def create_event():
    data = request.get_json()
    if not data or 'name' not in data or 'description' not in data or 'location' not in data or 'date' not in data:
        return jsonify({"error": "Invalid event data"}), 400
    events.append(data)
    event_history.append({**data, 'action': 'created'})  # Save to history
    return jsonify(data), 201

@app.route('/events', methods=['GET'])
def get_events():
    return jsonify(events)

@app.route('/events/<string:event_name>', methods=['PUT'])
def update_event(event_name):
    data = request.get_json()
    event = next((event for event in events if event['name'] == event_name), None)
    if not event:
        return jsonify({"error": "Event not found"}), 404
    event.update(data)
    event_history.append({**data, 'action': 'updated'})  # Save to history
    return jsonify(event)

@app.route('/events/<string:event_name>', methods=['DELETE'])
def delete_event(event_name):
    global events
    event = next((event for event in events if event['name'] == event_name), None)
    if event:
        event_history.append({**event, 'action': 'deleted'})  # Save to history
        events = [event for event in events if event['name'] != event_name]
        return '', 204
    return jsonify({"error": "Event not found"}), 404

@app.route('/event-history', methods=['GET'])
def get_event_history():
    return jsonify(event_history)

# Attendee Management APIs
@app.route('/attendees', methods=['POST'])
def add_attendee():
    data = request.get_json()
    if not data or 'name' not in data or 'email' not in data:
        return jsonify({"error": "Invalid attendee data"}), 400
    attendees.append(data)
    return jsonify(data), 201

@app.route('/attendees', methods=['GET'])
def get_attendees():
    return jsonify(attendees)

@app.route('/attendees/<string:attendee_name>', methods=['DELETE'])
def delete_attendee(attendee_name):
    global attendees
    attendees = [attendee for attendee in attendees if attendee['name'] != attendee_name]
    return '', 204

# Task Management APIs
@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    if not data or 'event' not in data or 'task_name' not in data:
        return jsonify({"error": "Invalid task data"}), 400
    tasks.append(data)
    return jsonify(data), 201

@app.route('/tasks/<string:event_name>', methods=['GET'])
def get_tasks(event_name):
    event_tasks = [task for task in tasks if task['event'] == event_name]
    return jsonify(event_tasks)

@app.route('/tasks/<string:event_name>/<string:task_name>', methods=['PUT'])
def update_task_status(event_name, task_name):
    data = request.get_json()
    task = next((task for task in tasks if task['event'] == event_name and task['task_name'] == task_name), None)
    if not task:
        return jsonify({"error": "Task not found"}), 404
    task['status'] = data.get('status', task['status'])
    return jsonify(task)

if __name__ == '__main__':
    app.run(debug=True, port=3000)
