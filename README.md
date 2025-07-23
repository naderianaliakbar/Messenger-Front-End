## 💻 Messenger Front-End

A modern single-page application (SPA) built with React.js to provide seamless, real-time chat experiences.

### 🚀 Features

* User authentication and session management
* Real-time messaging interface via Socket.IO
* Conversation list and individual chat views
* Responsive design using modern CSS or UI framework (e.g., Tailwind, Material-UI)
* State management (Context API or Redux)
* API integration with the back-end server
* Loading states, error handling, and form validation

### ⚙️ Tech Stack

| Front-End Layer   | Technology                               |
| ----------------- | ---------------------------------------- |
| Framework         | React.js (functional components + hooks) |
| Routing           | React Router                             |
| State Management  | Context API or Redux                     |
| WebSocket Library | Socket.IO Client                         |
| HTTP Requests     | Axios or fetch API                       |
| Styling           | CSS Modules / Tailwind / Material‑UI     |

### 🧩 Installation & Setup

```bash
git clone https://github.com/naderianaliakbar/Messenger-Front-End.git
cd Messenger-Front-End
npm install
```

Copy `.env.example` to `.env` and configure:

```dotenv
REACT_APP_API_URL=http://localhost:5000
```

### 🏁 Running the App (Development)

```bash
npm start
```

App will be accessible at `http://localhost:3000`.

### 🛠️ Features & UI Components

* **Authentication**

  * Login & signup forms with error handling
* **Home Screen**

  * Sidebar listing all user conversations
* **Chat Window**

  * Shows message history for the selected conversation
  * Real-time updates for new messages, typing indicators
  * Input form for sending messages
* **New Conversation**

  * Modal or separate view to start chats with other users

### 🧪 Testing

Optionally add tests with Jest and React Testing Library:

```bash
npm test
```

### 📘 Project Structure

```
src/
├── components/       # Reusable UI components
├── contexts/         # Auth, Chat state management
├── hooks/            # Custom React hooks
├── pages/            # Route-based components
├── services/         # API and WebSocket logic
├── styles/           # CSS or theme files
└── index.js
```

### 💡 Usage Tips

* Ensure `REACT_APP_API_URL` matches your back-end server URL
* Wrap the app with Auth and Chat Providers for global state
* Use proper cleanup for Socket.IO to prevent memory leaks

### 🤝 Contribution

Contributions are welcome! Fork the repo, create topic branches, and send pull requests. Please follow coding standards, linting, and add tests when possible.

### 📄 License

This project is licensed under the MIT License.
