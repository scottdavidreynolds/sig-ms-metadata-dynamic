# Media Shuttle Metadata with Dynamic Form Content
# Scott Reynolds, June 7 2019

This application requires a subscription to Media Shuttle with Metadata.

It utilizes the Metadata feature of submit portals and the Media Shuttle Management API /portal/*portalId*/package/*packageId* method to retrieve the metadata about the submitted files and return a form with that dynamic content. 

Media Shuttle SaaS must be able to connect to your form from the Internet so it is required to host your application on a platform that can support this. Heroku is a sample application infrastructure that can provide Node.js containers.

1. First configure your env with:

registrationKey=*your submit portal metadata registration key*
formUrl=*yourPortalUrl*/show
apiKey=*your Media Shuttle API Key*

2. Configure metadata logic

This can be used to interact with your internal databases and applications to generate a dynamic form which is represented with our EJS and formUrl sample. Customize as necessary.

3. Run the app. >node app.js