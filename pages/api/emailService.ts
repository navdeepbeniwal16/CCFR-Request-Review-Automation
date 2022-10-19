import { NextApiRequest, NextApiResponse } from 'next';
import { resolve } from 'path';

const nodemailer = require('nodemailer');


// Each request must have:
// email: email of the reciever
// emailText: the body text of the email
// emailType: either 'StatusUpdate' or 'ApplicationVerdicts'
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const query = req.query;
	const {email, emailText, emailType} = query;

	console.log(email);

	var transport = nodemailer.createTransport({
		host: "smtp.mailtrap.io",
		port: 2525,
		auth: {
		  user: "fbf7a66f0cad4b",
		  pass: "3cc57a37c5fef3"
		}
	  });

	return new Promise((response) => {
		if(emailType == 'StatusUpdate') {

			let mailDetails = {
				from: 'CCFR',
				to: email,
				subject: 'Application Update',
				text: emailText
			}
	
			transport.sendMail(mailDetails, function(error: any, info: { response: string; }){
				if (error) {
				  console.log(error);
				  return res.status(400).json({
					status: 400,
					message: 'Bad Request.'
					})
		
				} else {
				  console.log('Email sent: ' + info.response);
				  return res.status(200).json({
					status: 200,
					message: 'Email sent.'
					})
				}
			  });
	
		} else if(emailType == 'ApplicationVerdicts') {
			let mailDetails = {
				from: 'CCFR',
				to: email,
				subject: 'Application Verdicts',
				text: emailText
			}
	
			try {
				transport.sendMail(mailDetails, function(error: any, info: { response: string; }){
					console.log('Email sent: ' + info.response);
					return res.status(201).json({
						status: 200,
						message: 'Email sent.'
					})
				  });
			} catch (error) {
				console.log(error);
				return res.status(400).json({
				  status: 400,
				  message: 'Bad Request.'
				  })
			} 
		}
	})
	
};

export default handler;