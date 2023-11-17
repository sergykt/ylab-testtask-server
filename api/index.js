#!/usr/bin/env node
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const PORT = process.env.PORT || 3001;

const corsOptions = { origin: true };

const app = express();
app.use(bodyParser.json());
app.use(cors(corsOptions));

transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

app.post('/api/users/login', async (req, res) => {
  try {
    const data = req.body;
    const { email } = data;

    const htmlBody = (
      <>
        <h1>Hello!</h1>
        <p>This email is to confirm that your recent login attempt was successful. If this wasn't you, please contact us immediately.</p>
      </>
    );

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: `Logged in Ylab-test-task`,
      text: '',
      html: htmlBody,
    });

    return res.status(200).send('Success!');
  } catch (err) {
    console.error(err);
    return res.status(500).end();
  }
});

const start = async () => {
  try {
    await app.listen(PORT);
    console.log(`Server is running on port ${PORT}.`);
  } catch (err) {
    console.error(err);
  }
};

start();
