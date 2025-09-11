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

*npm install


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

*frontend/

*│── src/
*│   ├── components/       # Reusable components (Header, Sidebar, VideoPlayer, etc.)


*│   ├── pages/            # Main pages (Home, Channel, SignIn, etc.)

*│   ├── App.jsx           # Routes configuration

*│   ├── videosData.js     # Mock / initial videos

*│   ├── app.css           # Global styles
*│── public/

*│── package.json

*│── README.md


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

http://localhost:5173
