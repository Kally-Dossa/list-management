# List Management

A simple full-stack list manager with a React front end and a Node.js/Express back end. The app demonstrates a basic client–server architecture where the UI communicates with the API over HTTP (REST). 
The default setup runs the front end on http://localhost:3001 and the back end on http://localhost:5000

## Getting Started
**How to download**
**`git clone`**  https://github.com/Kally-Dossa/list-management.git
**`cd list-management`**

## How to run

**Back end** Runs on http://localhost:5000


- **`cd back-end`**

- **`npm install`**

- **`node server.js`**


**Front end** Runs on http://localhost:3001

Open a new terminal:

- **`cd front-end`**

- **`npm install`**

- **`npm start`**


## API Overview
- `GET /subscribers` – list all subscribers (with pagination)
- `POST /subscribers` – add a new subscriber
- `DELETE /subscribers/:email` – remove (unsubscribe) a subscriber
