## YoutubeClone

* A Youtube Clone Capstone Project

* This is the frontend of a YouTube Clone built using React.js.

* It provides features like video playback, channel pages, comments, subscriptions, authentication, and responsive layouts (mobile, tablet, desktop).


## Features

 * Video playback (like YouTube watch page)
 
 * Channels (create, view, and manage)
 
 * Comments (add, edit, delete)
 
 * Authentication (Sign up / Sign in)
 
 * Fully responsive (Mobile, Tablet, Desktop, 4K TVs)
 
 * Dark / Light UI toggle (optional)
 
 * Video uploads with thumbnails

 
 ## Tech Stack
 
* React.js + React Router DOM

* Axios – API requests

* LocalStorage for persistence

* React Icons – icons (YouTube-style)

* Toastify – notifications

* Vanilla CSS  – styling


## Installation

* Clone the repository:

* git clone https://github.com/your-username/youtube-clone-frontend.git

* cd youtube-clone-frontend


## Install dependencies:

* npm install


## Start the development server:

* npm run dev


## Frontend runs on:

* http://localhost:5173

## API Integration

* This frontend connects to your Node.js + Express backend.

* JWT authentication for maintaining the login based authentication throughout the app 

* Bcrypt for storing password

* Update the API base URL if needed in your code (e.g., axios calls):

* axios.defaults.baseURL = "http://localhost:5000/api";

* A Postman collection for the apis are added in the project folder.

 ## Database 

 * Mongodb for maintaining data of the logged in user.

 * Documents are Video , User , Channel ,Comments.

## Project Structure

* frontend/

* │── src/
* │   ├── components/       # Reusable components (Header, Sidebar, VideoPlayer, etc.)


* │   ├── pages/            # Main pages (Home, Channel, SignIn, etc.)

* │   ├── App.jsx           # Routes configuration

* │    ├── videosData.js     # Mock / initial videos

* │    ├── app.css           # Global styles
 
* │── public/

* │── package.json

* │── README.md


## Responsiveness

* Mobile (iPhone, Samsung, Galaxy, etc.) → Sidebar hidden, bottom nav enabled

* Tablet (iPad Mini, iPad Air) → Compact layout, responsive video player

* Laptop / Desktop → Sidebar + video grid

* 4K TVs → Adjusted spacing for large screens


## Available Routes

* / → Home (video feed)

* /watch/:id → Video player page

* /channel/:handle → Channel page

* /signin → Sign In page


## for backend the api documentation file is added in the backend folder for the endpoint required for integration in frontend.

## Github link - https://github.com/Jagriti268Git/YoutubeClone.git


#  YouTube Clone – API Documentation

Base URL:  
```
http://localhost:5000/api
```

---

##  Auth Routes

### **Register User**
`POST /auth/register`  
Registers a new user.

**Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "mypassword"
}
```

**Response:**
```json
{
  "_id": "64f7...",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "JWT_TOKEN"
}
```

---

### **Login User**
`POST /auth/login`  
Logs in an existing user.

**Body (JSON):**
```json
{
  "email": "john@example.com",
  "password": "mypassword"
}
```

**Response:**
```json
{
  "_id": "64f7...",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "JWT_TOKEN"
}
```

---

##  Channel Routes

### **Create Channel**
`POST /channels` *(Protected)*  
Requires `Authorization: Bearer <token>`  

**Body (Form-Data):**
- `name` (string, required)  
- `handle` (string, required, unique)  
- `picture` (file, optional – profile picture)

**Response:**
```json
{
  "_id": "64f8...",
  "name": "My Channel",
  "handle": "mychannel",
  "user": "64f7...",
  "profilePicture": "uploads/16940-profile.png"
}
```

---

### **Get Channel by Handle**
`GET /channels/:handle`

**Example:**  
`GET /channels/mychannel`

**Response:**
```json
{
  "_id": "64f8...",
  "name": "My Channel",
  "handle": "mychannel",
  "profilePicture": "uploads/16940-profile.png"
}
```

---

## Video Routes

### **Upload Video**
`POST /videos` *(Protected)*  
Requires `Authorization: Bearer <token>`  

**Body (Form-Data):**
- `title` (string, required)  
- `description` (string, optional)  
- `audience` (string, default: "notKids")  
- `tags` (comma-separated string)  
- `videoFile` (file, required – video)  
- `thumbnail` (file, optional – image)

**Response:**
```json
{
  "_id": "6501...",
  "title": "My First Video",
  "description": "This is my video",
  "videoUrl": "uploads/videos/16940-myvideo.mp4",
  "thumbnailUrl": "uploads/thumbnails/16940-thumb.png",
  "channel": "64f8..."
}
```

---

### **Get All Videos**
`GET /videos/allVideos`

**Response:**
```json
[
  {
    "_id": "6501...",
    "title": "My First Video",
    "videoUrl": "uploads/videos/16940-myvideo.mp4",
    "thumbnailUrl": "uploads/thumbnails/16940-thumb.png"
  }
]
```

---

### **Get Videos by Channel**
`GET /videos/channel/:channelId`

**Example:**  
`GET /videos/channel/64f8...`

---

### **Update Video**
`PUT /videos/:id` *(Protected)*  

**Body (Form-Data):**
- `title` (string)  
- `description` (string)  
- `audience` (string)  
- `tags` (string)  
- `videoFile` (file, optional)  
- `thumbnail` (file, optional)

---

### **Delete Video**
`DELETE /videos/:id` *(Protected)*  

---

##  Comments Routes

### **Add Comment**
`POST /comments/:videoId` *(Protected)*  

**Body (JSON):**
```json
{
  "text": "This is awesome!"
}
```

---

### **Get Comments for a Video**
`GET /comments/:videoId`

---

### **Update Comment**
`PUT /comments/:id` *(Protected)*  

**Body (JSON):**
```json
{
  "text": "Updated comment"
}
```

---

### **Delete Comment**
`DELETE /comments/:id` *(Protected)*  

http://localhost:5173
