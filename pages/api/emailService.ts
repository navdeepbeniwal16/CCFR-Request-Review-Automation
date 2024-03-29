import { NextApiRequest, NextApiResponse } from 'next';

import nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';


// Each request must have:
// email: email of the reciever
// emailText: the body text of the email
// emailType: either 'StatusUpdate' or 'ApplicationVerdicts'
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const query = req.query;
	const {email, emailText, emailType} = query;
	var message = "<p> " + emailText + " </p>";

	console.log(email);

	var transport = process.env.GMAIL_LOGIN ? nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.GMAIL_LOGIN,
			pass: process.env.GMAIL_PWORD
		}
	}) : nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "2525"),
        auth: {
            user: process.env.SMTP_LOGIN,
            pass: process.env.SMTP_PWORD,
        }
	});

	return new Promise((response) => {
		if(emailType == 'StatusUpdate') {

			let mailDetails: MailOptions = {
				from: 'CCFR',
				to: email,
				subject: 'Application Update',
				text: emailText as string,
				html: message
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
			let mailDetails: MailOptions = {
				from: 'CCFR',
				to: email,
				subject: 'Application Verdicts',
				text: emailText as string,
				html: message
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