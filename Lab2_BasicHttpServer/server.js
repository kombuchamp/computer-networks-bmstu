'use strict';
const PORT = 3001;
const ENDL = '\r\n';

const net = require('net'); // TCP sockets node.js api
const fs = require('fs');
const path = require('path');

// Create TCP socket, listen for connections
net.createServer((socket) => {
    socket
        .on('data', (buffer) => {
            let req;
            try {
                req = parseRequest(buffer);
                if (
                    req.method !== 'GET' || // Accept only get requests
                    !req.headers.Host || // Just check if its there as requested in lab description
                    !req.path.startsWith('/') ||
                    req.protocol !== 'HTTP/1.1'
                ) {
                    throw new Error(`Parsed request is not supported: ${req.request}`);
                }
            } catch (e) {
                console.error('Something went wrong', e);
                socket.end(`HTTP/1.1 400 Bad Request${ENDL}${ENDL}`);
                return;
            }

            let file;
            try {
                let filePath = path.join(__dirname, req.path.slice(1) || 'index.html');
                file = fs.readFileSync(filePath);
                socket.write(`HTTP/1.1 200 OK${ENDL}`);
                socket.write(
                    filePath.endsWith('.html')
                        ? 'Content-Type: text/html; charset=UTF-8'
                        : 'Content-Type: application/octet-stream' // Just send anything that is not html as a file
                );
                socket.write(`${ENDL}${ENDL}`);
                socket.write(file);
                socket.end(ENDL);
            } catch {
                socket.end(`HTTP/1.1 404 Not Found${ENDL}${ENDL}`);
            }
        })
        .on('error', (error) => console.error('Got error: ', error));
}).listen(PORT, () => console.log(`listening on port ${PORT}...`));

function parseRequest(buffer) {
    let request = buffer.toString();
    let requestWithoutBody = request.split(`${ENDL}${ENDL}`)[0].split(ENDL);
    let startLine = requestWithoutBody.shift().split(' ');
    let headers = requestWithoutBody.reduce((result, line) => {
        let [, key, val] = line.match(/(.*): (.*)/);
        result[key] = val;
        return result;
    }, {});
    return {
        request,
        method: startLine[0],
        path: startLine[1],
        protocol: startLine[2],
        headers,
    };
}
