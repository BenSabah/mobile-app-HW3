import {NextFunction, Request, Response} from 'express';
import {authService} from '../services/AuthService';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    // skip auth for public routes (registration/login endpoints)
    if (req.path.startsWith('/register/') || req.path.startsWith('/login/')) {
        return next();
    }

    let cookieUid = req.cookies.uid;
    let authenticatedUser = authService.isAuthenticated(cookieUid);

    if (authenticatedUser) {
        // If a user is logged in and tries to access root, redirect to events
        if (req.path === '/') {
            return res.redirect("/events");
        }
        return next();
    }

    // Not authenticated: render the login page for root or redirect to root for other routes
    if (req.path === '/') {
        res.render("login-page");
    } else {
        // For pages like /events or /item/:id, if not logged in, show a login page
        res.render("login-page");
    }
}
