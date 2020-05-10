'use strict';
const PORT = 3001;

const http = require('http');

http.get(
    {
        hostname: 'localhost',
        port: PORT,
        path: '/',
    },
    (res) => {
        const {
            statusCode,
            headers: { 'content-type': contentType },
        } = res;
        console.log('Status code: ', statusCode);
        let rawData = '';
        res.on('data', (chunk) => (rawData += chunk));
        res.on('end', () => {
            if (contentType && contentType.startsWith('text')) {
                console.log('Body: \n', rawData);
            }
        });
    }
).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
});
