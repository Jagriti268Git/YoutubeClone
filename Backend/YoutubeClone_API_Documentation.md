
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
