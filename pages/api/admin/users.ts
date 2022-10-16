import { UserRecord } from 'firebase-admin/auth';
import { NextApiRequest, NextApiResponse } from 'next';

import { getAllUsers, getUsersByRole } from '../../../lib/admin-users'
import { UserRole } from '../../../lib/utilities/AppEnums';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        let users = [];
        if (req.query.role) {
            const role = parseUserRole(req);
            if (role === UserRole.ADMIN ||
                role === UserRole.PROGRAM_MANAGER ||
                role === UserRole.SC_MEMBER ||
                role === UserRole.BGW_CHAIR) {
                users = await getUsersByRole(role);
            } else {
                return res.status(400).json({ success: false, message: 'Illegal Arguments : User role is incorrect' });
            }
        } else {
            users = await getAllUsers();
        }

        if (users.length === 0) {
            console.log(`No user found...`);
            return res.status(200).json({ success: true, length: 0, users: [] });
        } else {
            console.log(`Number of user found : ${users.length}`);
            return res.status(200).json({ success: true, length: users.length, users: users });
        }
    } catch (error: any) {
        return res.status(500).json({ success: false, message: 'Internal Server Error : ' + error.message });
    }
};

const parseUserRole = (req: NextApiRequest) => {
    const userRoleString = req.query.role;

    if (typeof userRoleString === "string" && userRoleString !== '') {
        return userRoleString;
    } else {
        throw new Error("Role parameter in body is incorrect");
    }
}

export default handler;