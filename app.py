from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_socketio import SocketIO, emit, join_room, leave_room
import json
import os
from datetime import datetime
import secrets

app = Flask(__name__)
app.config['SECRET_KEY'] = secrets.token_hex(16)
socketio = SocketIO(app)

# Ensure data directory exists
if not os.path.exists('data'):
    os.makedirs('data')

# Initialize JSON files if they don't exist
def init_json_files():
    if not os.path.exists('data/users.json'):
        with open('data/users.json', 'w') as f:
            json.dump({}, f)
    if not os.path.exists('data/messages.json'):
        with open('data/messages.json', 'w') as f:
            json.dump({"messages": []}, f)

init_json_files()

def save_user(username, password):
    with open('data/users.json', 'r+') as f:
        users = json.load(f)
        users[username] = {"password": password}
        f.seek(0)
        json.dump(users, f)
        f.truncate()

def get_user(username):
    with open('data/users.json', 'r') as f:
        users = json.load(f)
        return users.get(username)

def save_message(username, message, room="general"):
    with open('data/messages.json', 'r+') as f:
        data = json.load(f)
        data["messages"].append({
            "username": username,
            "message": message,
            "room": room,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })
        f.seek(0)
        json.dump(data, f)
        f.truncate()

def get_messages(room="general", limit=50):
    with open('data/messages.json', 'r') as f:
        data = json.load(f)
        messages = [msg for msg in data["messages"] if msg["room"] == room]
        return messages[-limit:]

@app.route('/')
def index():
    if 'username' not in session:
        return redirect(url_for('login'))
    return render_template('index.html', username=session['username'])

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        user = get_user(username)
        if user and user['password'] == password:
            session['username'] = username
            return jsonify({"success": True})
        return jsonify({"success": False, "message": "Invalid credentials"})
    
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if get_user(username):
            return jsonify({"success": False, "message": "Username already exists"})
        
        save_user(username, password)
        session['username'] = username
        return jsonify({"success": True})
    
    return render_template('register.html')

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))

@app.route('/get_messages')
def get_chat_messages():
    room = request.args.get('room', 'general')
    messages = get_messages(room)
    return jsonify(messages)

@socketio.on('join')
def on_join(data):
    room = data['room']
    join_room(room)
    emit('status', {'message': f"{session['username']} has joined the room."}, room=room)

@socketio.on('leave')
def on_leave(data):
    room = data['room']
    leave_room(room)
    emit('status', {'message': f"{session['username']} has left the room."}, room=room)

@socketio.on('message')
def handle_message(data):
    message = data['message']
    room = data.get('room', 'general')
    username = session['username']
    
    save_message(username, message, room)
    
    emit('message', {
        'username': username,
        'message': message,
        'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }, room=room)

if __name__ == '__main__':
    socketio.run(app, debug=True)
