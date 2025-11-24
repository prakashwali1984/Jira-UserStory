----------------------------------------------------------------------
Steps for install project in VS code

1)Open VS Code and import the project
2)Open Terminal (Menus --View -New Terminal)
3)Run the command in terminal for installing dependencies
npm install 
4)Check for the .env file in the root folder
add the groq key
5) Open the application
npm run dev
5)
PORT --backend port -8090
Cors :5173
Backend accepts request only from
CORS_ORIGIN=http://localhost:5173
-------------------------------------------------------------------------
Prompt for adding jira link to user story to test UI

I am extending the existing UI to add few more fields to integrate with JIRA


[MANDATORY] Only create UI skeleton and no changes to the API and etc
[CRITICAL] Add these fields


1. Text box where I can have user story as input
2. Button adjacent to the textbox for fetching user story details from JIRA
3. The text box and button should be above Story Title


I am just showing UI demo, so no other changes needed !!


AFter that run in terminal : npm run dev 
=============================================================================


I am extending the existing UI to add few more fields to integrate with JIRA


[MANDATORY] i want to link the my jira account and it will list all my linked jira ticketd
[CRITICAL] Add these fields


1. Add jira integration and link
2. Add connect to Jira and pop up will show and user can enter there jira account details
3. On click on connect button user should get notification connected successfully




I am just showing UI demo, so no other changes needed !!
