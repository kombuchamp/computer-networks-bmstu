'use strict';
const PORT = 3001;

const net = require('net'); // TCP sockets node.js api
const fs = require('fs');
const path = require('path');

// Create TCP socket, listen for connections
net.createServer((socket) => {
    socket.on('data', (buffer) => {
        let req;
        try {
            req = parseRequest(buffer);
        } catch (e) {
            console.error('Something went wrong');
            console.error(e);
            socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
            return;
        }
        if (
            req.method !== 'GET' || // Accept only get requests
            !req.headers.Host || // Just check if its there as requested in lab description
            !req.path.startsWith('/') ||
            req.protocol !== 'HTTP/1.1'
        ) {
            socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
            return;
        }

        let file;
        try {
            let filePath = path.join(__dirname, req.path.slice(1) || 'index.html');
            file = fs.readFileSync(filePath);
            socket.write('HTTP/1.1 200 OK\r\n');
            socket.write(
                filePath.endsWith('.html')
                    ? 'Content-Type: text/html; charset=UTF-8'
                    : 'Content-Type: application/octet-stream'
            );
            socket.write('\r\n\r\n');
            socket.write(file);
            socket.end('\r\n');
            return;
        } catch {
            socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
            return;
        }
    });
}).listen(PORT, () => console.log(`listening on port ${PORT}...`));

function parseRequest(buffer) {
    let requestWithoutBody = buffer.toString().split('\r\n\r\n')[0].split('\r\n');
    let startLine = requestWithoutBody.shift().split(' ');
    let headers = requestWithoutBody.reduce((result, line) => {
        let [, key, val] = line.match(/(.*): (.*)/);
        result[key] = val;
        return result;
    }, {});
    return {
        method: startLine[0],
        path: startLine[1],
        protocol: startLine[2],
        headers,
    };
}
