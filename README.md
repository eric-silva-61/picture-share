## GoHere!

GoHere is a simple location sharing social media site, created to practice fullstack web development

**Tech Stack:** MongoDB, Express.js, React.js, Node.js

**Contributors:** [Eric](https://github.com/eric-silva-61)

### Features

#### Signup/Login
  User information is stored in MongoDB (Atlas).  Passwords are encrypted using bcrypt.js.  Authentication is bearer token based using JSON Webtoken.

#### Add/Edit Place
  User can upload a picture of a place to share, adding title, description and address.  Address is geocoded on the backend using Google geocoding API.
  Google Place API is utilized to display a map of the location from the geocoded location.
  Users can like/unlike other users places

### Setup
1. Create a MongoDB account
2. Create and permission a database with a `places` and `users` collection
3. Create a Google API key with access to Geocoding and Place API

### Getting Started
1. Clone or download repository.
2. Run `npm i` on both `frontend` and `backend` directories.
3. Create `.env` file in the `frontend` root folder.  Use `sample.env` for necessary entries.
4. Create `nodedemon.json` file in the `backend` root folder.  Use `sample.nodedemon.json` for necessary entries.

### Running the App
1. Run `npm start` in the `backend` folder
2. Run `npm start` in the `frontend` folder
 
