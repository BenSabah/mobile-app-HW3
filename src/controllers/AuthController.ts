import {Request, Response} from 'express';
import {authService} from '../services/AuthService';

export class AuthController {
    register(req: Request, res: Response) {
        let username = req.params.username;
        let password = req.params.password;

        if (authService.register(<string>username, <string>password)) {
            console.log("Registration successful");
            res.sendStatus(200);
        } else {
            console.log("user already exists");
            res.sendStatus(500);
        }
    }

    login(req: Request, res: Response) {
        let username = req.params.username;
        let password = req.params.password;
        const uid = authService.login(<string>username, <string>password);

        if (uid) {
            res.cookie('uid', uid, {maxAge: 3.6e+6});
            console.log("user logged in = " + username);
            res.sendStatus(200);
        } else {
            console.log("user or password were not found");
            res.sendStatus(500);
        }
    }
}

export const authController = new AuthController();
