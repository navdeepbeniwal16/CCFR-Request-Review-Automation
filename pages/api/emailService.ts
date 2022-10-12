import { NextApiRequest, NextApiResponse } from 'next';

const nodemailer = require('nodemailer');

// Email types
const emailTypes = [
	{ type: 'Status Update' },
	{ type: 'Reset' },
];

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const email = req.body.email;
	const type = req.body.emailType;

	console.log(email);

	var transport = nodemailer.createTransport({
		host: "smtp.mailtrap.io",
		port: 2525,
		auth: {
		  user: "fbf7a66f0cad4b",
		  pass: "3cc57a37c5fef3"
		}
	  });
		
	if (type == 'Reset') {
		let mailDetails = {
			from: 'CCFR',
			to: 'michael.p.hannon@gmail.com',
			subject: 'Reset Your password',
			text: 'You are receiving this email if you have forgotten your password to ' +
			'your CCFR Portal account. Please click the link below to reset your password This link expires in 10 minutes from the time you recieved this email.'
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
	} else if (type == 'Update Status') {
		let mailDetails = {
			from: 'CCFR',
			to: 'michael.p.hannon@gmail.com',
			subject: 'Application Status Update',
			text: 'Update Status Email ' 		
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
	} else {
		return res.status(400).json({
			status:400,
			message: 'No Email type.'
		})
	}
};

export default handler;