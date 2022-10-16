import { NextApiRequest, NextApiResponse } from 'next';

import { getUser, getUserRole, getUsersByRole } from '../../../lib/admin-users';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const role = req.body.role;

    // Checking if passed arguments are correct
    try {
        if(role === undefined || role === null) {
            throw new Error("Role is not defined or null");
        }
    } catch (error: any) {
        return res.status(400).json({ success : false, message: 'Illegal Arguments : ' + error.message});
    }

    // Check if user exists
    try {
        const users = await getUsersByRole(role);
        if(users.length === 0) {
            console.log(`No user with the role of : ${role} found...`);
            return res.status(200).json({ success : true, length: 0, users: []});
        } else {
            console.log(`Number of user with the role of ${role} found : ${users.length}`);
            return res.status(200).json({ success : true, length: users.length, users: users});
        }
    } catch (error: any) {
        return res.status(500).json({ success : false, message: 'Internal Server Error : ' + error.message});
    }
    

    // console.log('Fetched user from firebase : ' +  user);

    // const userRole = await getUserRole(userEmail);
    // if(userRole) {
    //     console.log('User role : ' + user.customClaims.role);
    //     return res.status(200).json({ success : true, email: userEmail, role: userRole});
    // } else {
    //     console.log('User doesn\'t have any role assigned to it');
    //     return res.status(200).json({ success : true, email: userEmail, role: null});
    // }
};

export default handler;