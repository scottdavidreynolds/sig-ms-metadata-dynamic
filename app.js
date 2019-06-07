require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const querystring = require('querystring');
const crypto = require('crypto');
const rp = require('request-promise');
const ejs = require('ejs');
const axios = require('axios');
const port = process.env.PORT || 3000;
const registrationKey = process.env.registrationKey;
const formUrl = process.env.formUrl;
const apiKey = process.env.apiKey;
let portalId = '';
let packageId = '';
let sender = '';

const urlencodedParser = bodyParser.urlencoded({ extended: true });
const textParser = bodyParser.text({ type: '*/*' });

app.use(express.static(path.join(__dirname, 'public')));

const getPackageInfo = () => {
    axios({
        method: 'GET',
        url: 'https://api.mediashuttle.com/v1/portals/' + portalId + '/packages/' + packageId,
        headers: { 'Authorization': apiKey, 'Content-Type': 'application/json' }
    })
        .then(res => {
            let metadata = res.data.metadata;
            console.log('retrieved metadata:/n', res.data)
        })
        .catch(error => {
            console.log('getPackageInfo error', error)
        })
}

const generateSignedUrl = (requestUrl, requestBody, registrationKey) => {
    const requestTimestamp = new Date().toISOString();

    // Generate canonical query string
    const algorithmParam = 'X-Sig-Algorithm=SIG1-HMAC-SHA256';
    const dateParam = `X-Sig-Date=${requestTimestamp}`;
    const canonicalQueryString = `${querystring.escape(algorithmParam)}&${querystring.escape(dateParam)}`;

    // Generate the string to sign
    const requestBodyHash = crypto.createHash('sha256').update(requestBody).digest('hex');
    const stringToSign = `${requestTimestamp}\n${requestUrl}\n${canonicalQueryString}\n${requestBodyHash}`;

    // Generate the signing key
    let hmac = crypto.createHmac('sha256', registrationKey);
    const signingKey = hmac.update(requestTimestamp).digest();

    // Generate request signature
    hmac = crypto.createHmac('sha256', signingKey);
    const signature = hmac.update(stringToSign).digest('hex');

    // Generate the signed URL
    const signatureParam = `X-Sig-Signature=${signature}`;
    return `${requestUrl}?${algorithmParam}&${dateParam}&${signatureParam}`;
};

app.use('/form', function (req, res) {
    res.sendFile(path.join(__dirname, "./public/form.html"));
})

app.use('/show', urlencodedParser, function (req, res) {
    console.log('showing /show req.query',req.query)
    if (req.query.formUrl) {
        formUrl = req.query.formUrl;
    };

    if (req.query.registrationKey) {
        registrationKey = req.query.registrationKey;
    }

    // Extract Media Shuttle package endpoint url from the redirectUrl request body parameter
    // passed by Media Shuttle. You can invoke a GET request on this url to retrieve all
    // known package details prior displaying the metadata form. The package endpoint url is
    // the same as the redirectUrl without the /metadata suffix.
    const portalPackageUrl = req.body.redirectUrl.replace(/\/metadata$/, '');

    // Generate a signed url for the above using the portal registration key.
    const signedPortalPackageUrl = generateSignedUrl(portalPackageUrl, '', registrationKey);

    // Fetch the package details from Media Shuttle and use them to fill in template
    // values in the web form.
    rp.get(signedPortalPackageUrl)
        .then(portalPackage => {
            const portalPackageJson = JSON.parse(portalPackage);
            portalId = portalPackageJson.packageDetails.portalId;
            packageId = portalPackageJson.packageDetails.packageId;
            sender = portalPackageJson.packageDetails.sender;
            return rp.get(formUrl)
                .then(form => {
                    res.send(ejs.render(form, {
                        packageId: portalPackageJson.packageDetails.packageId,
                        files: portalPackageJson.packageDetails.files,
                        redirectUrl: req.body.redirectUrl,
                        sender: portalPackageJson.packageDetails.sender
                    }));
                });
        })
        .catch(err => {
            res.status(500).send(err.message).end();
        });
});

app.post('/process', textParser, function (req, res) {
    setTimeout(getPackageInfo, 1000)
    const form = querystring.parse(req.body);
    const signedUrl = generateSignedUrl(form.redirectUrl, req.body, registrationKey);
    res.set('Location', signedUrl);
    res.status(307).end();
});

app.listen(port, () => {
    console.log('App listening on ' + port + ' @ ' + (new Date()).toLocaleString());
});
