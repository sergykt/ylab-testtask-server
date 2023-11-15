#!/usr/bin/env node
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;

const corsOptions = { origin: true };

const app = express();
app.use(bodyParser.json());
app.use(cors(corsOptions));

let tokens = [];

transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

app.post('/api/users/signup', async (req, res) => {
  try {
    const data = req.body;
    console.log(req.body);
    const { email } = data;
    const hash = uuidv4();
    const fullLink = `${process.env.CLIENT_URL}/verify/?verifyToken=${hash}`;
    tokens.push(hash);

    const htmlBody = (
      `<p>Здравствуйте!</p>
      <p>Вы зарегистрировались на нашем сайте и теперь можете активировать свой профиль, перейдя по следующей ссылке:</p>
      <a href="${fullLink}">Активировать профиль</a>
      <p>Если вы не регистрировались на нашем сайте, пожалуйста, проигнорируйте это сообщение.</p>`
    );

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: `Регистрация ylab-test-task`,
      text: '',
      html: htmlBody,
    });

    return res.status(201).end();
  } catch (err) {
    console.error(err);
    return res.status(500).end();
  }
});

app.get('/api/users/verify', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(404).end();
    }
    if (tokens.includes(token)) {
      return res.status(200).end();
    }
    return res.status(404).end();
  } catch (err) {
    console.error(err);
    return res.status(500).end();
  }
});

const start = () => {
  try {
    app.listen(PORT);
    console.log(`Server is running on port ${PORT}.`);
  } catch (err) {
    console.error(err);
  }
};

start();
