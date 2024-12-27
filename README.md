# Modern Flask Chat Application

A real-time chat application built with Flask, Socket.IO, and a modern UI using Tailwind CSS.

![Chat App Preview](https://i.imgur.com/your-image-here.png)

## Features

- 🚀 Real-time messaging using Socket.IO
- 🔐 User authentication (Register/Login)
- 💾 JSON-based data storage
- 🎨 Modern UI with purple theme
- 📱 Fully responsive design
- 🏠 Multiple chat rooms
- 👤 User presence indicators
- ⚡ Message history persistence
- 🌈 Beautiful animations and transitions

## Tech Stack

- **Backend**: Flask, Flask-SocketIO
- **Frontend**: HTML5, CSS3, JavaScript
- **CSS Framework**: Tailwind CSS
- **Icons**: Font Awesome
- **Real-time Communication**: Socket.IO
- **Data Storage**: JSON files

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/flask-chat-app.git
   cd flask-chat-app
   ```

2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

1. Start the Flask server:
   ```bash
   python app.py
   ```

2. Open your web browser and navigate to:
   ```
   http://localhost:5000
   ```

## Project Structure

```
flask-chat-app/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── README.md             # Project documentation
├── data/                 # JSON data storage
│   ├── users.json        # User data
│   └── messages.json     # Chat messages
├── static/
│   ├── css/
│   │   └── style.css    # Custom styles
│   └── js/
│       └── main.js      # Frontend JavaScript
└── templates/
    ├── base.html        # Base template
    ├── index.html       # Chat interface
    ├── login.html       # Login page
    └── register.html    # Registration page
```

## Features in Detail

### Authentication
- User registration with username and password
- Secure login system
- Session management

### Chat Functionality
- Real-time message delivery
- Multiple chat rooms (General, Random)
- Message history
- User join/leave notifications
- Typing indicators
- Message timestamps

### User Interface
- Modern, clean design with purple theme
- Responsive layout for all devices
- Smooth animations and transitions
- User-friendly error messages
- Loading states and indicators

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Flask and Flask-SocketIO teams
- Tailwind CSS team
- Font Awesome for the icons
- All contributors and users of this application

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)
Project Link: [https://github.com/yourusername/flask-chat-app](https://github.com/yourusername/flask-chat-app)
