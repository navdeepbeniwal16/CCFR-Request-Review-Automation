import { NextApiRequest, NextApiResponse } from 'next';

import { UserRole } from '../../../lib/utilities/AppEnums';
import { userExists, setUserRole } from '../../../lib/admin-users';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const userEmail = req.body.email;
    const userRole = req.body.role;

    // Checking if passed arguments are correct
    try {
        if(userEmail === undefined || userEmail === null || userRole === undefined || userRole === null) {
            throw new Error("Email or Role are not defined or null");
        }

        if(userRole !== UserRole.ADMIN && userRole !== UserRole.APPLICANT && userRole !== UserRole.BGW_CHAIR && userRole !== UserRole.PROGRAM_MANAGER && userRole !== UserRole.SC_MEMBER) {
            throw new Error("UserRole is not valid");
        }
    } catch (error: any) {
        return res.status(400).json({ success : false, message: 'Illegal Arguments : ' + error.message});
    }

    // Check if user exists
    const isExistingUser = await userExists(userEmail)
    if(!isExistingUser) {
        return res.status(404).json({ success : false, message: 'User doesn\'t exist'});
    }

    // Call setUseRole method
    const isUpdated = await setUserRole(userEmail, userRole);
    if(!isUpdated) {
        return res.status(500).json({ success : false, message: 'Internal Server Error'});
    }

    return res.status(200).json({ success : true, message: 'Role assigned successfully'});
};

export default handler;

