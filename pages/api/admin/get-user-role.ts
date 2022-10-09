import { NextApiRequest, NextApiResponse } from 'next';

import { getUser, getUserRole } from '../../../lib/admin-users';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const userEmail = req.body.email;

    // Checking if passed arguments are correct
    try {
        if(userEmail === undefined || userEmail === null) {
            throw new Error("Email is not defined or null");
        }
    } catch (error: any) {
        return res.status(400).json({ success : false, message: 'Illegal Arguments : ' + error.message});
    }

    // Check if user exists
    const user = await getUser(userEmail)
    if(!user) {
        return res.status(404).json({ success : false, message: 'User doesn\'t exist'});
    }

    console.log('Fetched user from firebase : ' +  user);

    const userRole = await getUserRole(userEmail);
    if(userRole) {
        console.log('User role : ' + user.customClaims.role);
        return res.status(200).json({ success : true, email: userEmail, role: userRole});
    } else {
        console.log('User doesn\'t have any role assigned to it');
        return res.status(200).json({ success : true, email: userEmail, role: null});
    }
};

export default handler;