# Scheduler App

The Scheduler App is a simple web application built with React that allows users to schedule and manage their daily tasks and appointments. This This Projectec is created and maintained by Rohit Tiwari. All of My Projects are Listed in my [Portfolio](https://rohitdev.netlify.app)

> the backend is suffering from cors and cookies problem this is working fine in localhost development:

Frontend Live at [LINK](https://devschedule.netlify.app/)
Backend Live at [LINK](https://schedular-backend.onrender.com/)

## Features

- Create, edit, and delete Service and book an appointments with listed consultants.
- Organize Services Appointments by date and time.
- View a list of upcoming and events appointments.
- Higlighly featured apis with backend google login and session maitainance for secured login.
- All the Apis wich returns the List is having Pagination feature.
- This app access your calendar and manages you daily event if you allow and if you book your appointment through this app.
- Intuitive user interface for easy scheduling.
- This project apis are more customizable custom appointment confirmation mail can be confired you need to import from helper directory where you need it.
- This project is also configured with JWT protection and basic auth Protection for routes again you can add it where you need it.

## Getting Started

To get started with the Scheduler App, follow these steps:

### Prerequisites

- Node.js , npm (Node Package Manager) and Mysql server or xampp for mysql database must be installed on your system.

---

### Installation

1. Clone the repository to your local machine:

`git clone https://github.com/rohittiwari-dev/schedular-app.git`

2. Navigate to the frontend directory:

`cd schedular-app`

`cd scheduler-frontend`

3. Rename `.env.example` to `.env`: Add listed variable information :
   `VITE_BASE_URL="" //this is Api base url`

4. Install the project dependencies:
   `npm install`

---

### For Backend

5. Navigate to the Backend directory:
   `cd ../`
   `cd scheduler-backend`

6. Generate google credentials using this video
   [Watch](https://drive.google.com/file/d/1Qc_zhmlaGMsKegh89w_DN7An6u0g5qb5/view?usp=sharing)

7. Rename `.env.example` to `.env`: Add listed variable information :

```
# SERVER PORT
PORT="" # DEFAULT IS 5000
#BASE URL FOR SERVER
BASE_URL="http://localhost:5000"
# ADD Client URL
CLIENT_URL="http://localhost:5173"

#MAILER CREDENTIALS
MAIL_SERVICE="GMAIL"
MAIL_USERNAME="" #Write your Email
MAIL_PASSWORD="hxjpjrgubiktpddb" #Password for third party access generated from account management section

# ROUTES PROTECTION CREADENTIALS YOU CAN USE JWT FOR SESIION TOO
API_USERNAME="Rohit"
API_PASSWORD="Rohit"

#SERVER_TYPE="DEVELOPMENT" # PRODUCTION OR DEVELOPMENT
SERVER_TYPE="PRODUCTION" # PRODUCTION OR DEVELOPMENT
JWT_SECRET_KEY="flOYxgClM4YxmcsCTkLPpFG10EVgv7Vw5LtEkrqWmGI=" # JWT SECRET KEY USE oPEN SSL TO GENERATE

# Database  CONFIG USE DATA BASE CONFIG OF MYSQL
DB_HOST=""
DB_DATABASE=""
DB_USER=""
DB_PASSWORD=""
DB_PORT="" #DEFAULT PORT IS 3306

# Google cloud secrets PLEASE READ THE README TO GENERATE THIS
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

7. Don't forget to add database variables

8. Install the project dependencies:
   `npm install`

### Running the App

Once the installation is complete, you can run the app with the following command:

- to start back end run
  `npm run dev`

The backend will start in development mode and should be accessable in your web browser at [http://localhost:5000](http://localhost:5000).

- to start front end run
  `cd ../` `cd scheduler-frontend` and then `npm run dev`

The backend will start in development mode and should be accessable in your web browser at [http://localhost:5173](http://localhost:5173).

### Usage

- Use the app to create new tasks or appointments by clicking the "Add" button.
- Edit existing tasks/appointments by clicking on them.
- Delete tasks/appointments by clicking the "Delete" button.
- Navigate between different dates using the date picker.

### Deployment

To deploy the Scheduler App to a production server, you can build the optimized production build with the following command:

`npm run build`

_Don't forget update environment vairable if changes due to build eg:localhots frontend url_

The build files will be generated in the `build` directory. You can then deploy these files to your web hosting platform of choice.

## Technologies Used

- React
- JavaScript
- HTML5
- CSS3
- Node js
