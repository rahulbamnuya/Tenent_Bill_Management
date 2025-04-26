# Tenant Management System

This is a web application that allows users to manage tenants, view tenant details, and manage billing information. The system is built using Express.js for the server-side logic, Firebase Firestore for the database, and EJS as the templating engine for rendering HTML views.

## Features

- **User Authentication**: Users can log in and sign up to access the application.
- **Tenant Management**: Users can add, view, edit, and delete tenants.
- **Billing**: Users can add and view bill history for each tenant.
- **Session Management**: User sessions are maintained using cookies.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** installed (version 14 or later recommended)
- **Firebase** account and Firestore database setup
- **Express.js** and **EJS** dependencies

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/rahulbamnuya/Tenent_Bill_Management.git
cd Tenent_Bill_Management
```
### 2. Build Command

```bash
npm install
```
### 3. Environment Seup

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_DATABASE_URL=your-database-url
```

 

### 4. Run Command 
Start the server using the following command:
```bash
node index.js
```
This will start the application on http://localhost:8000

### How to Use:
1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up Firebase and ensure you link your Firebase credentials correctly.
4. Add your environment variables in `.env` file.
5. Run the app using `node index.js`.

