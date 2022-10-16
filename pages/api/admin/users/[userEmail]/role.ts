import { NextApiRequest, NextApiResponse } from 'next';

import { getUser, getUserRole, setUserRole } from '../../../../../lib/admin-users';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    let isResponseSent = false;
    switch (req.method) {
        case 'GET':
            isResponseSent = await handelGet(req, res);
            break;
        case 'POST':
            isResponseSent = await handelPost(req, res);
            break;
        default:
            console.log('Default section is entered...');
            res.status(400).json({ success: false, message: 'Illegal HttpMethod : ' });
    }

    if (!isResponseSent) {
        return res.status(400).json({ success: false, message: 'Unknown HttpMethod : ' });
    }
};

const handelGet = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log('Entering GET handler...');

    let userEmail: string;
    try {
        userEmail = parseUserEmail(req);
    } catch (error: any) {
        res.status(400).json({ success: false, message: 'Illegal Arguments : ' + error.message });
        return true;
    }

    // Check if user exists
    const user = await getUser(userEmail)
    if (!user) {
        res.status(404).json({ success: false, message: 'User doesn\'t exist' });
        return true;
    }

    console.log('Fetched user from firebase : ' + user);
    const userRole = await getUserRole(userEmail);
    if (userRole) {
        console.log('User role : ' + user.customClaims.role);
        res.status(200).json({ success: true, email: userEmail, role: userRole });
    } else {
        console.log('User doesn\'t have any role assigned to it');
        res.status(200).json({ success: true, email: userEmail, role: null });
    }

    return true;
}

const handelPost = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log('Entering POST handler...');

    let userEmail: string;
    let role: string;
    try {
        userEmail = parseUserEmail(req);
        role = parseUserRole(req);
        console.log('Role to be assigned : ' + role);
    } catch (error: any) {
        res.status(400).json({ success: false, message: 'Illegal Arguments : ' + error.message });
        return true;
    }

    // Check if user exists
    const isUserRoleSet = await setUserRole(userEmail, role);
    if (!isUserRoleSet) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else {
        res.status(200).json({ success: true, message: 'Role set successfully' });
    }

    return true;
}

const parseUserEmail = (req: NextApiRequest) => {
    const userEmailString = req.query.userEmail;

    if (typeof userEmailString === "string" && userEmailString !== '' && !Number(userEmailString)) {
        return userEmailString;
    } else {
        throw new Error("Email parameter in url is incorrect");
    }
}

const parseUserRole = (req: NextApiRequest) => {
    const userRoleString = req.body.role;

    if (typeof userRoleString === "string" && userRoleString !== '') {
        return userRoleString;
    } else {
        throw new Error("Role parameter in body is incorrect");
    }
}

export default handler;