To get access to your desk on clickUp.com you should take API token from 
Workspace Settings > Apps
Copy Api Token and paste to your dotenv file or to heroku vars

### To run Google Sheets API you should create a Google Cloud Project
https://developers.google.com/workspace/guides/create-project
and follow the steps: 
- Open the Google Cloud Console
- At the top-left, click Menu menu > IAM & Admin > Create a Project.
- In the Project Name field, enter a descriptive name for your project.
- In the Location field, click Browse to display potential locations for your project. Then, click Select
- Click Create. The console navigates to the Dashboard page and your project is created within a few minutes.
### ENABLE GOOGLE WORKSPACE API
To enable an API in your Google Cloud project:

- Open the Google Cloud Console.
- At the top-left, click Menu > APIs & Services > Library.
- In the search field, enter Google Sheets API  and press Enter.
- In the list of search results, click the API to enable.
- Click Enable.

### Configure OAuth consent & register your app

- Open the Google Cloud Console.
- At the top-left, click Menu menu > APIs & Services > OAuth consent screen.
- Select the user type for your app, then click Create.
- Complete the app registration form required fields, then click Save and Continue.
- Click on add or remove scopes and in side menu select all Google Sheets API than click Update. After click SAVE AND CONTINUE.
- Under "Test users," click Add users. Enter your email address and any other authorized test users, then click Save and Continue.
- Review your app registration summary. Click Edit to make changes, or click Back to Dashboard.

### Create access credentials

- Open the Google Cloud Console.
- At the top-left, click Menu menu > APIs & Services > Credentials.
- Click Create Credentials > OAuth client ID.
- Click Application type > Desktop app.
- In the "Name" field, type a name for the credential. This name is only shown in the Cloud Console.
- Click Create. The OAuth client created screen appears, showing your new Client ID and Client secret.
- Click download JSON file for further use in request body

### First run of application

- make POST request to your (url)/api/first-connection with credentials: {your credentials} inside request body
- you will receive a link, then you should go by this link, authorize and later copy all symbols between the "code=" and "&" 
- make POST request to your (url)/api/init-connection with {"code": (code you received before)}
- make GET request to your (url)/api/get-tasks to transfer all tasks to your google sheets