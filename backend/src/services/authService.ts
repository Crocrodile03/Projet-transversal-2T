import User from '../models/User';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';

export class AuthService {

    createAccessToken(id: string, username: string, role?: string) {
        const secret = process.env.JWT_ACCESS_SECRET;
        if (!secret) throw new Error('JWT_ACCESS_SECRET not configured');
        return jwt.sign({ id, username, role }, secret, { expiresIn: '15m' });
    }

    createRefreshToken(id: string, username: string) {
        const secret = process.env.JWT_REFRESH_SECRET;
        if (!secret) throw new Error('JWT_REFRESH_SECRET not configured');
        return jwt.sign({ id, username }, secret, { expiresIn: '7d' });
    }

    async register(username: string, password: string) {
        const hashedPassword = await argon2.hash(password);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        const { password: _password, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword;
    }

    async login(username: string, password: string) {
        const user = await User.findOne({ username });
        if (!user) {
            throw new Error('User not found');
        }
        const isPasswordValid = await argon2.verify(user.password, password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        const accessToken = this.createAccessToken(user._id.toString(), user.username);
        const refreshToken = this.createRefreshToken(user._id.toString(), user.username);
        return { accessToken, refreshToken };
    }
}

