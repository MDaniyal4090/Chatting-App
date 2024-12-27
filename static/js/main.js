document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    let currentRoom = 'general';

    // DOM Elements
    const messagesContainer = document.getElementById('messages');
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    const roomButtons = document.querySelectorAll('.room-btn');
    const currentRoomElement = document.getElementById('currentRoom');
    const menuButton = document.getElementById('menuButton');
    const sidebar = document.querySelector('.w-64');

    // Mobile menu toggle
    if (menuButton) {
        menuButton.addEventListener('click', () => {
            sidebar.classList.toggle('sidebar-hidden');
        });
    }

    // Join default room
    socket.emit('join', { room: currentRoom });

    // Load existing messages
    const loadMessages = async (room) => {
        try {
            const response = await fetch(`/get_messages?room=${room}`);
            const messages = await response.json();
            messagesContainer.innerHTML = '';
            messages.forEach(addMessage);
            scrollToBottom();
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    loadMessages(currentRoom);

    // Handle room switching
    roomButtons.forEach(button => {
        button.addEventListener('click', () => {
            const newRoom = button.dataset.room;
            if (newRoom === currentRoom) return;

            // Leave current room
            socket.emit('leave', { room: currentRoom });

            // Update UI
            document.querySelector(`.room-btn[data-room="${currentRoom}"]`).classList.remove('active');
            button.classList.add('active');
            currentRoom = newRoom;
            currentRoomElement.textContent = newRoom.charAt(0).toUpperCase() + newRoom.slice(1);

            // Join new room
            socket.emit('join', { room: currentRoom });
            loadMessages(currentRoom);

            // Hide sidebar on mobile after room selection
            if (window.innerWidth < 768) {
                sidebar.classList.add('sidebar-hidden');
            }
        });
    });

    // Handle message submission
    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = messageInput.value.trim();
        if (message) {
            socket.emit('message', { message, room: currentRoom });
            messageInput.value = '';
        }
    });

    // Add message to UI
    function addMessage(data) {
        const template = document.getElementById('messageTemplate');
        const messageElement = template.content.cloneNode(true);
        const messageDiv = messageElement.querySelector('.message');

        const username = messageElement.querySelector('.font-medium');
        const timestamp = messageElement.querySelector('.timestamp');
        const message = messageElement.querySelector('.message-content');

        username.textContent = data.username;
        timestamp.textContent = formatTimestamp(data.timestamp);
        message.textContent = data.message;

        // Add special styling for current user's messages
        if (data.username === currentUsername) {
            messageDiv.classList.add('current-user');
        }

        messagesContainer.appendChild(messageElement);
        scrollToBottom();
    }

    // Format timestamp
    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // Socket event handlers
    socket.on('message', addMessage);

    socket.on('status', (data) => {
        const statusDiv = document.createElement('div');
        statusDiv.className = 'text-center text-sm text-gray-500 my-2';
        statusDiv.textContent = data.message;
        messagesContainer.appendChild(statusDiv);
        scrollToBottom();
    });

    // Utility functions
    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Handle enter key
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            messageForm.dispatchEvent(new Event('submit'));
        }
    });
});
