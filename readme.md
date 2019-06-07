# Media Shuttle Ingest Metadata and Write to CSV
# Scott Reynolds, Feb 6 2019

This application requires a subscription to Media Shuttle with Metadata.
It utilizes the Metadata feature of submit portals and the Media Shuttle
Management API /portal/*portalId*/package/*packageId* method to retrieve
the metadata and write to a specific directory and filename in csv format
for later ingest.

1. First create a .env file in the root directory of your application and
populate with:

registrationKey=*your submit portal metadata registration key*
formUrl=*yourPortalUrl*/show
apiKey=*your Media Shuttle API Key*

2. Configure the following variables in the app.js to values you would like
to use for your environment. 

const storagePath = '/tmp';
*Files will be written sender/packageId/*

const filename = 'fileinfo.csv'
*This is the file name written to the directory*

const fields = ['sender','packageName','programTitle', 'episodeTitle','genre','synopsis','originator','distributor'];
*These are the name values from your form which are converted to JSON and then to CSV*

3. Run the app. >node app.js