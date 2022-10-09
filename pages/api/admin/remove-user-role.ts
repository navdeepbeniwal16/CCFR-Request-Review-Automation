import { NextApiRequest, NextApiResponse } from 'next';

import { userExists, removeUserRole } from '../../../lib/admin-users';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const userEmail = req.body.email;

    // Checking if passed arguments are correct
    try {
        if(userEmail === undefined || userEmail === null) {
            throw new Error("Email is either not defined or is null");
        }
    } catch (error: any) {
        return res.status(400).json({ success : false, message: 'Illegal Arguments : ' + error.message});
    }

    // Check if user exists
    const isExistingUser = await userExists(userEmail)
    if(!isExistingUser) {
        return res.status(404).json({ success : false, message: 'User doesn\'t exist'});
    }

    // Call removeUseRole method
    const isRoleRemoved = await removeUserRole(userEmail);
    if(!isRoleRemoved) {
        return res.status(500).json({ success : false, message: 'Internal Server Error'});
    }

    return res.status(200).json({ success : true, message: 'Role removed successfully'});
};

export default handler;