'use strict';

require('dotenv').config(); // Read config from .env
const readline = require('readline');
const nodemailer = require('nodemailer');

// Create CLI
const io = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
// Configure SMTP transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.USER,
        pass: process.env.TOKEN,
    },
});

const sendInfo = {};

// Send email when i/o session is complete
io.on('close', () => {
    transporter.sendMail(
        {
            from: process.env.FROM_EMAIL,
            ...sendInfo,
        },
        (err, info) => {
            if (err) {
                console.error('Something went wrong ', err);
            } else if (info) {
                console.log('Success ', info);
            }
        }
    );
});

// Request email info from user
console.log('*** Send email utility ***');
io.question('To: ', (answer) => {
    sendInfo.to = answer;
    io.question('Subject: ', (answer) => {
        sendInfo.subject = answer;
        io.question('Text: ', (answer) => {
            sendInfo.text = answer;
            io.question('Attachments (space separated list of paths, i.e. ./example.txt): ', (answer) => {
                sendInfo.attachments = answer
                    ? answer.split(' ').map((path) => ({
                          filename: path.substring(path.lastIndexOf('/') + 1),
                          path,
                      }))
                    : null;
                io.close();
            });
        });
    });
});
