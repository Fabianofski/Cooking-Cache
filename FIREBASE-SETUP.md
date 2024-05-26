# Firebase Setup

This project uses Firebase for authentication, database, and storage. To get started, you need to create a Firebase project and set up the following services:

- Authentication
- Realtime Database
- Storage
- Hosting & Functions (optional)

## Prerequisites

Install the Firebase CLI:

```sh
    npm install -g firebase-tools
```

## Firebase Project Creation

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click on "Add Project"
3. Enter your project name and click "Continue"
4. Click "Create Project"

## Create the Firebase services

### Authentication

1. Go to "Authentication" > "Sign-in method"
2. Enable the "Email/Password" provider
3. Enable the "Google" provider

### Realtime Database

1. Go to "Realtime Database" > "Create Database"
2. Select "Start in secure mode" and click "Next"
3. Select a location and click "Done"

#### Set up the database rules

1. Go to "Realtime Database" > "Rules"
2. Replace the default rules with the following:
   ```json
   {
   	"rules": {
   		"collections": {
   			".indexOn": ["ownerId", "participants", "inviteCode"],
   			"participants": {
   				".indexOn": ["uid"]
   			}
   		},
   		".read": false,
   		".write": false
   	}
   }
   ```

### Storage

1. Go to "Storage" > "Get Started"
2. Click "Start in Production Mode" and click "Next"
3. Select a location and click "Done"

## Add an application to your Firebase project

1. Go to "Project Overview" > "Project Settings"
2. Click on "Web App" > "Register App"
3. Enter your app nickname and click "Register App"

You can also register an iOS or Android app here.

## Adding Firebase Config to your project

You will find the secrets here:

a) App Configuration

1. Go to "Project Overview" > "Project Settings"
2. Click on your created "Web App"

- STORAGE_URL (storageBucket)
- DATABASE_URL (databaseURL)
- PROJECT_ID (projectId)

b) Service Account

1. Go to "Project Overview" > "Service Accounts"
2. Click on "Generate New Private Key"

- CLIENT_EMAIL (client_email)
- PRIVATE_KEY (private_key)

Add these Firebase secrets to your `.env` file:

```yaml
# [...]
PROJECT_ID='PROJECT_ID'
STORAGE_URL='STORAGE_URL'
DATABASE_URL='DATABASE_URL'

CLIENT_EMAIL='CLIENT_EMAIL'
PRIVATE_KEY='PRIVATE_KEY'
```

Go to firebase.client.ts and replace the firebaseConfig with the
config of your Firebase project from a).

```ts
const firebaseConfig = {
	apiKey = 'YOUR_API_KEY',
	authDomain = 'YOUR_AUTH_DOMAIN',
	databaseURL = 'YOUR_DATABASE_URL',
	projectId = 'YOUR_PROJECT_ID',
	storageBucket = 'YOUR_STORAGE_BUCKET',
	messagingSenderId = 'YOUR_MESSAGING_SENDER_ID',
	appId = 'YOUR_APP_ID',
	measurementId = 'YOUR_MEASUREMENT_ID'
};
```

## Hosting & Functions (optional)

You need to upgrade your Firebase plan to Blaze to use Firebase Functions.

### Firebase Console

1. Go to "Hosting" > "Get Started"
2. Click "Get Started" and follow the instructions
3. Go to "Functions" > "Get Started"
4. Click "Get Started" and follow the instructions

### Firebase CLI

1. Initialize Firebase in your project
   ```sh
   firebase init
   ```
2. Select "Hosting: Configure files for Firebase Hosting and (optionally) set
   up GitHub Action deploys"
3. Follow the instructions to set up the services
4. Deploy your project
   ```sh
   firebase deploy
   ```
