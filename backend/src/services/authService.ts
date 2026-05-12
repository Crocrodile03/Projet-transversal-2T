import User from '../models/User';
import * as argon2 from 'argon2';

export class AuthService {

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
        const { password: _password, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword;
    }
}

