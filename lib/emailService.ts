const nodemailer = require('nodemailer');

export const emailSender = (email: string) => {
	let mailTransporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'smartexibit@gmail.com',
			pass: 'rXg8d$61n7%z'
		}
	});
	
	let mailDetails = {
		from: 'smartexibit@gmail.com',
		to: 'email',
		subject: 'Reset Your password',
		text: 'You are receiving this email if you have forgotten your password to ' +
		'your CCFR Portal account. Please click the link below to reset your password This link expires in 10 minutes from the time you recieved this email.'
	};
	
	mailTransporter.sendMail(mailDetails);
}



