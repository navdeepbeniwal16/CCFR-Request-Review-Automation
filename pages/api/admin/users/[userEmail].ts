import { NextApiRequest, NextApiResponse } from 'next';

import { getUser } from '../../../../lib/admin-users'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    let userEmail: string;

    // Checking if passed arguments are correct
    try {
        const userEmailString = req.query.userEmail;

        if (userEmailString && typeof userEmailString === "string" && userEmailString !== '' && !Number(userEmailString)) {
            userEmail = userEmailString;
        } else {
            throw new Error("Email parameter in url is incorrect");
        }
    } catch (error: any) {
        return res.status(400).json({ success: false, message: 'Illegal Arguments : ' + error.message });
    }

    // Check if user exists
    try {
        const user = await getUser(userEmail)
        if (!user) {
            return res.status(404).json({ success: false, message: 'User doesn\'t exist' });
        } else {
            return res.status(200).json({ success: true, user: user });
        }
    } catch (error: any) {
        return res.status(500).json({ success: false, message: 'Internal Server Error : ' + error.message });
    }
};

export default handler;