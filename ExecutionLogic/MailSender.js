require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs');

// Read the content of the text files
const file1Content = fs.readFileSync('../StatusReport/MonitoringReport_06-13.txt', 'utf-8');
const file2Content = fs.readFileSync('../StatusReport/Partial_Failures_06-13.txt', 'utf-8');

// Create a transporter using nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS
    }
});

// Define email options
const mailOptions = {
    from: process.env.GMAIL_USER,
    to: 'aroy@camelot-itlab.com',
    subject: 'Daily Monitoring',
    text: 'Attached are the daily text files.',
    attachments: [
        { filename: 'monitoringReport.txt', content: file1Content },
        { filename: 'partialFailures.txt', content: file2Content }
    ]
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log('Error:', error);
    } else {
        console.log('Email sent:', info.response);
    }
});
