import {Router} from 'express';
const router = Router();
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const smtpUsername = 'saoirse.mooney@gmail.com';
const smtpPassword = process.env.PASSWORD;

router
.route('/')
.get(async (req, res) => {
    res.render("homepage", {title: "homepage"})
})

router
.route('/aboutme')
.get(async (req, res) => {
    res.render("about", {title: "about"})
})

router
.route('/books')
.get(async (req,res) => {
    if (req.query.success!=null) {
        const success = req.query.success;
        const error_message = req.query.error ? req.query.error : null;
        return res.render("books", {title: "books", success: success, error: error_message})
    }
    res.render("books", {title: "books"})
})

router.post('/sendbook', (req, res) => {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: smtpUsername,
        pass: smtpPassword
      }
    });
  
    const mailOptions = {
      from: req.body.email,
      to: 'saoirse.mooney@gmail.com',
      subject: 'New Book Recommendation Submission',
      text: `Name: ${req.body.name}\nEmail: ${req.body.email}\nTitle: ${req.body.title}\nAuthor: ${req.body.author}\nMessage: ${req.body.message}`
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        let succes = false;
        res.redirect('/books?success=${success}&error=${error}');
      } else {
        console.log('Email sent: ' + info.response);
        let success=true;
        res.redirect('/book?success=${success}');
      }
    });
  });

export default router