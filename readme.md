# Media Shuttle Metadata with Dynamic Form Content
## Scott Reynolds, June 7 2019

**This application requires a subscription to Media Shuttle with Metadata.**

   This code utilizes the Metadata feature of submit portals and the Media Shuttle Management API **/portal/*portalId*/package/*packageId*** method to retrieve the metadata about the submitted files and return a form with that dynamic content. 

   Media Shuttle SaaS must be able to connect to your form from the Internet so it is required to host your application on a platform that can support this. Heroku is a sample application infrastructure that can provide Node.js containers.

1. First configure your Node env with:

   registrationKey=*yourSubmitPortalMetadataRegistrationKey*  
   apiKey=*yourMediaShuttleApiKey*
   formUrl=https://your_application_url/show  

2. Configure your portal Metadata settings:

   Metadata provider URL: https://your_application_url/show  
   Registration key: unique_key to use in your Node env in step #1

3. Configure metadata logic

   This can be used to interact with your internal databases and applications to generate a dynamic form and store the data which is presented with EJS in formUrl public/form.html sample. Customize as necessary.

3. Run the app:

   node app.js
