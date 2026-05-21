import { expressjwt } from 'express-jwt';
import db from '../_helpers/db';

// Load file config only in non-production
let fileConfig: any = {};
if (process.env.NODE_ENV !== 'production') {
    try {
        fileConfig = require('../config.json');
    } catch (e) {
        // config.json not present, rely on env vars
    }
}

const secret = process.env.JWT_SECRET || fileConfig.secret;

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required in production');
}

export default function authorize(roles: any = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // Authenticate JWT token and attach user to request
        expressjwt({ secret, algorithms: ['HS256'] }),

        // Authorize based on user role
        async (req: any, res: any, next: any) => {
            const account = await db.Account.findByPk(req.auth.id);

            if (!account || (roles.length && !roles.includes(account.role))) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            req.auth.role = account.role;
            const refreshTokens = await account.getRefreshTokens();
            req.auth.ownsToken = (token: any) => !!refreshTokens.find((x: any) => x.token === token);
            next();
        }
    ];
}
