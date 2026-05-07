import {User} from '../models/User';
import {generateGuid} from '../utils/idGenerator';

export class AuthService {
    private users: User[] = [
        {uid: "0", username: "admin", password: "1234"}
    ];

    register(username: string, password: string): boolean {
        const userExist = this.users.some(u => u.username === username);
        if (userExist) {
            return false;
        }
        this.users.push({uid: this.users.length.toString(), username, password});
        return true;
    }

    login(username: string, password: string): string | null {
        const user = this.users.find(u => u.username === username && u.password === password);
        if (user) {
            const uid = generateGuid();
            user.uid = uid;
            return uid;
        }
        return null;
    }

    isAuthenticated(uid: string): User | undefined {
        return this.users.find(u => u.uid === uid);
    }
}

export const authService = new AuthService();
